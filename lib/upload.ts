import fs from "fs/promises";
import path from "path";

export async function saveUpload(file: File) {
  const safe = file.name.replace(/[^\w.\-]+/g, "-").slice(-80);
  const filename = `${crypto.randomUUID()}-${safe || "image"}`;
  const directory = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(directory, { recursive: true });
  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(directory, filename), bytes);
  return `/uploads/${filename}`;
}
