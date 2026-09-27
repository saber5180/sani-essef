import { NextResponse } from "next/server";
import { denied, requireAdmin } from "@/lib/guard";
import { readDb, updateDb } from "@/lib/store";
import { saveUpload } from "@/lib/upload";

export async function GET() {
  if (!(await requireAdmin())) return denied();
  const db = await readDb();
  return NextResponse.json(db.quotes);
}

export async function POST(request: Request) {
  const form = await request.formData();
  const name = String(form.get("name") || "");
  const phone = String(form.get("phone") || "");
  if (!name || !phone) return NextResponse.json({ error: "Nom et téléphone requis." }, { status: 400 });
  const file = form.get("image");
  const imageUrl = file instanceof File && file.size > 0 ? await saveUpload(file) : null;
  const quote = await updateDb((db) => {
    const created = {
      id: crypto.randomUUID().slice(0, 8).toUpperCase(),
      name,
      phone,
      email: String(form.get("email") || ""),
      productName: String(form.get("productName") || ""),
      quantity: String(form.get("quantity") || ""),
      surface: String(form.get("surface") || ""),
      message: String(form.get("message") || ""),
      imageUrl,
      status: "new" as const,
      createdAt: new Date().toISOString(),
    };
    db.quotes.unshift(created);
    return created;
  });
  return NextResponse.json({ id: quote.id });
}
