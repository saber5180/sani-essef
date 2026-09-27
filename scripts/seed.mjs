import fs from "fs";
import path from "path";
import { Pool } from "pg";

const connectionString = (process.env.DATABASE_URL || "").replace(/[&?]channel_binding=require/g, "");
const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  const file = path.join(process.cwd(), "data", "db.json");
  if (!fs.existsSync(file)) {
    console.log("No local data/db.json yet. The first page visit will seed Neon.");
    return;
  }
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  await pool.query(
    `INSERT INTO app_store (id, data, updated_at)
     VALUES (1, $1::jsonb, now())
     ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
    [JSON.stringify(data)],
  );
  console.log(`Seeded Neon with ${data.products?.length || 0} products.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
