import { NextResponse } from "next/server";
import { denied, requireAdmin } from "@/lib/guard";
import { updateDb } from "@/lib/store";
import type { Quote } from "@/lib/types";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return denied();
  const { id } = await params;
  const body = (await request.json()) as Partial<Quote>;
  const quote = await updateDb((db) => {
    const current = db.quotes.find((item) => item.id === id);
    if (!current) return null;
    if (body.status) current.status = body.status;
    return current;
  });
  if (!quote) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  return NextResponse.json(quote);
}
