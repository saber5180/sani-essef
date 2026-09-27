import fs from "fs";
import path from "path";
import type { Database } from "./types";
import { createSeed } from "./seed";
import { getPool, usesPostgres } from "./postgres";

const dbPath = path.join(process.cwd(), "data", "db.json");

function writeFile(db: Database) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf8");
}

async function ensureStore() {
  const pool = getPool();
  if (!pool) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS app_store (
      id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
}

async function readPostgres(): Promise<Database> {
  const pool = getPool();
  if (!pool) throw new Error("PostgreSQL is not configured.");
  await ensureStore();
  const existing = await pool.query<{ data: Database }>("SELECT data FROM app_store WHERE id = 1");
  if (existing.rows[0]?.data) return existing.rows[0].data;
  const seeded = await createSeed();
  await pool.query("INSERT INTO app_store (id, data, updated_at) VALUES (1, $1::jsonb, now())", [JSON.stringify(seeded)]);
  return seeded;
}

async function writePostgres(db: Database) {
  const pool = getPool();
  if (!pool) throw new Error("PostgreSQL is not configured.");
  await pool.query("UPDATE app_store SET data = $1::jsonb, updated_at = now() WHERE id = 1", [JSON.stringify(db)]);
}

async function readFile(): Promise<Database> {
  if (!fs.existsSync(dbPath)) {
    const db = await createSeed();
    writeFile(db);
    return db;
  }
  return JSON.parse(fs.readFileSync(dbPath, "utf8")) as Database;
}

export async function readDb(): Promise<Database> {
  return usesPostgres() ? readPostgres() : readFile();
}

let queue: Promise<unknown> = Promise.resolve();

export function updateDb<T>(mutator: (db: Database) => T): Promise<T> {
  const run = queue.then(async () => {
    const db = await readDb();
    const result = mutator(db);
    if (usesPostgres()) await writePostgres(db);
    else writeFile(db);
    return result;
  });
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}
