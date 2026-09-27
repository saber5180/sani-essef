import { Pool } from "pg";

function connectionString() {
  const raw = process.env.DATABASE_URL || "";
  return raw.replace(/[&?]channel_binding=require/g, "");
}

let pool: Pool | null = null;

export function getPool() {
  if (!process.env.DATABASE_URL) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: connectionString(),
      ssl: { rejectUnauthorized: false },
      max: 4,
    });
  }
  return pool;
}
