import { NextResponse } from "next/server";
import { denied, requireAdmin } from "@/lib/guard";
import { slugify } from "@/lib/format";
import { readDb, updateDb } from "@/lib/store";

export async function GET() {
  const db = await readDb();
  return NextResponse.json({ categories: db.categories, subcategories: db.subcategories });
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return denied();
  const body = (await request.json()) as { name?: string; description?: string; image?: string };
  if (!body.name) return NextResponse.json({ error: "Nom requis." }, { status: 400 });
  const category = await updateDb((db) => {
    const created = {
      id: crypto.randomUUID(),
      name: body.name || "",
      slug: slugify(body.name || "categorie"),
      description: body.description || "",
      image: body.image || "/images/hero.jpg",
      sortOrder: db.categories.length + 1,
    };
    db.categories.push(created);
    return created;
  });
  return NextResponse.json(category);
}

export async function PUT(request: Request) {
  if (!(await requireAdmin())) return denied();
  const body = (await request.json()) as { id?: string; name?: string; description?: string; image?: string };
  const category = await updateDb((db) => {
    const current = db.categories.find((item) => item.id === body.id);
    if (!current) return null;
    if (body.name) {
      current.name = body.name;
      current.slug = slugify(body.name);
    }
    if (body.description != null) current.description = body.description;
    if (body.image) current.image = body.image;
    return current;
  });
  if (!category) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  return NextResponse.json(category);
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) return denied();
  const { id } = (await request.json()) as { id?: string };
  await updateDb((db) => {
    db.categories = db.categories.filter((item) => item.id !== id);
    db.subcategories = db.subcategories.filter((item) => item.categoryId !== id);
  });
  return NextResponse.json({ ok: true });
}
