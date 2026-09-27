import { NextResponse } from "next/server";
import { denied, requireAdmin } from "@/lib/guard";
import { updateDb } from "@/lib/store";
import type { Product } from "@/lib/types";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  if (!(await requireAdmin())) return denied();
  const { id } = await params;
  const body = (await request.json()) as Partial<Product>;
  const product = await updateDb((db) => {
    const current = db.products.find((item) => item.id === id);
    if (!current) return null;
    Object.assign(current, body, { id, updatedAt: new Date().toISOString() });
    return current;
  });
  if (!product) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  return NextResponse.json(product);
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await requireAdmin())) return denied();
  const { id } = await params;
  const removed = await updateDb((db) => {
    const before = db.products.length;
    db.products = db.products.filter((item) => item.id !== id);
    return before !== db.products.length;
  });
  if (!removed) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
