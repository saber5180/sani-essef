import { NextResponse } from "next/server";
import { denied, requireAdmin } from "@/lib/guard";
import { slugify } from "@/lib/format";
import { updateDb } from "@/lib/store";

export async function POST(request: Request) {
  if (!(await requireAdmin())) return denied();
  const body = (await request.json()) as { categoryId?: string; name?: string; description?: string };
  if (!body.categoryId || !body.name) return NextResponse.json({ error: "Catégorie et nom requis." }, { status: 400 });
  const subcategory = await updateDb((db) => {
    const created = {
      id: crypto.randomUUID(),
      categoryId: body.categoryId || "",
      name: body.name || "",
      slug: slugify(body.name || "sous-categorie"),
      description: body.description || "",
    };
    db.subcategories.push(created);
    return created;
  });
  return NextResponse.json(subcategory);
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) return denied();
  const { id } = (await request.json()) as { id?: string };
  await updateDb((db) => {
    db.subcategories = db.subcategories.filter((item) => item.id !== id);
  });
  return NextResponse.json({ ok: true });
}
