import fs from "fs";
import path from "path";
import { Pool } from "pg";

const connectionString = (process.env.DATABASE_URL || "").replace(/[&?]channel_binding=require/g, "");

if (!connectionString) {
  console.error("DATABASE_URL is missing.");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  const schema = fs.readFileSync(path.join(process.cwd(), "db", "schema.sql"), "utf8");
  await pool.query(schema);
  const check = await pool.query("SELECT COUNT(*)::int AS n FROM app_store");
  console.log(`Neon ready. app_store rows: ${check.rows[0].n}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
