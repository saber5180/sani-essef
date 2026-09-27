import { NextResponse } from "next/server";
import { denied, requireAdmin } from "@/lib/guard";
import { readDb, updateDb } from "@/lib/store";

export async function GET() {
  const db = await readDb();
  return NextResponse.json(db.reviews);
}

export async function POST(request: Request) {
  const body = (await request.json()) as { productId?: string; authorName?: string; rating?: number; comment?: string };
  if (!body.productId || !body.authorName || !body.comment) {
    return NextResponse.json({ error: "Avis incomplet." }, { status: 400 });
  }
  const review = await updateDb((db) => {
    const created = {
      id: crypto.randomUUID(),
      productId: body.productId || "",
      authorName: body.authorName || "",
      rating: Math.min(5, Math.max(1, Number(body.rating) || 5)),
      comment: body.comment || "",
      approved: false,
      createdAt: new Date().toISOString(),
    };
    db.reviews.unshift(created);
    return created;
  });
  return NextResponse.json({ id: review.id });
}

export async function PUT(request: Request) {
  if (!(await requireAdmin())) return denied();
  const body = (await request.json()) as { id?: string; approved?: boolean };
  const review = await updateDb((db) => {
    const current = db.reviews.find((item) => item.id === body.id);
    if (!current) return null;
    current.approved = Boolean(body.approved);
    return current;
  });
  if (!review) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  return NextResponse.json(review);
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) return denied();
  const { id } = (await request.json()) as { id?: string };
  await updateDb((db) => {
    db.reviews = db.reviews.filter((item) => item.id !== id);
  });
  return NextResponse.json({ ok: true });
}
