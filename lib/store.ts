import fs from "fs";
import path from "path";
import type { Database } from "./types";
import { createSeed } from "./seed";

const dbPath = path.join(process.cwd(), "data", "db.json");
let memory: Database | null = null;
let seededCache: Database | null = null;

async function seededCatalog() {
  if (!seededCache) seededCache = await createSeed();
  return seededCache;
}

function usesPostgres() {
  return Boolean(process.env.DATABASE_URL);
}

function writeFile(db: Database) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf8");
}

function tryWriteFile(db: Database) {
  try {
    writeFile(db);
  } catch {
    memory = db;
  }
}

function mergeCatalog(current: Database, seeded: Database): { db: Database; changed: boolean } {
  let changed = false;
  const products = [...current.products];
  for (const item of seeded.products) {
    const index = products.findIndex((product) => product.id === item.id);
    if (index === -1) {
      products.push(item);
      changed = true;
      continue;
    }
    const missing = item.images.filter((image) => !products[index].images.some((existing) => existing.url === image.url));
    if (missing.length) {
      products[index] = { ...products[index], images: [...missing, ...products[index].images] };
      changed = true;
    }
  }
  const subcategories = [...current.subcategories];
  for (const item of seeded.subcategories) {
    if (!subcategories.some((sub) => sub.id === item.id)) {
      subcategories.push(item);
      changed = true;
    }
  }
  const categories = [...current.categories];
  for (const item of seeded.categories) {
    if (!categories.some((category) => category.id === item.id)) {
      categories.push(item);
      changed = true;
    }
  }
  return { db: { ...current, products, subcategories, categories }, changed };
}

async function pool() {
  const { getPool } = await import("./postgres");
  const client = getPool();
  if (!client) throw new Error("PostgreSQL is not configured.");
  return client;
}

async function ensureStore() {
  const client = await pool();
  await client.query(`
    CREATE TABLE IF NOT EXISTS app_store (
      id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
}

async function readPostgres(): Promise<Database> {
  const client = await pool();
  await ensureStore();
  const existing = await client.query<{ data: Database }>("SELECT data FROM app_store WHERE id = 1");
  if (existing.rows[0]?.data) {
    const seeded = await seededCatalog();
    const merged = mergeCatalog(existing.rows[0].data, seeded);
    if (merged.changed) {
      await client.query("UPDATE app_store SET data = $1::jsonb, updated_at = now() WHERE id = 1", [JSON.stringify(merged.db)]);
    }
    memory = merged.db;
    return merged.db;
  }
  const seeded = await seededCatalog();
  await client.query("INSERT INTO app_store (id, data, updated_at) VALUES (1, $1::jsonb, now())", [JSON.stringify(seeded)]);
  memory = seeded;
  return seeded;
}

async function writePostgres(db: Database) {
  const client = await pool();
  await client.query("UPDATE app_store SET data = $1::jsonb, updated_at = now() WHERE id = 1", [JSON.stringify(db)]);
}

async function readFile(): Promise<Database> {
  try {
    if (fs.existsSync(dbPath)) {
      const db = JSON.parse(fs.readFileSync(dbPath, "utf8")) as Database;
      const seeded = await seededCatalog();
      const merged = mergeCatalog(db, seeded);
      if (merged.changed) tryWriteFile(merged.db);
      memory = merged.db;
      return merged.db;
    }
  } catch {
    if (memory) return memory;
  }
  if (memory) return memory;
  const db = await seededCatalog();
  tryWriteFile(db);
  memory = db;
  return db;
}

export async function readDb(): Promise<Database> {
  if (usesPostgres()) {
    try {
      return await readPostgres();
    } catch (error) {
      console.error("Neon unavailable, using local catalog.", error);
      return readFile();
    }
  }
  return readFile();
}

let queue: Promise<unknown> = Promise.resolve();

export function updateDb<T>(mutator: (db: Database) => T): Promise<T> {
  const run = queue.then(async () => {
    const db = await readDb();
    const result = mutator(db);
    memory = db;
    if (usesPostgres()) {
      try {
        await writePostgres(db);
      } catch (error) {
        console.error("Neon write failed.", error);
        tryWriteFile(db);
      }
    } else {
      tryWriteFile(db);
    }
    return result;
  });
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}
