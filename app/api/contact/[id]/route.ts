import { NextResponse } from "next/server";
import { denied, requireAdmin } from "@/lib/guard";
import { updateDb } from "@/lib/store";

export async function PUT(request: Request) {
  if (!(await requireAdmin())) return denied();
  const body = (await request.json()) as { id?: string; read?: boolean };
  await updateDb((db) => {
    const current = db.messages.find((item) => item.id === body.id);
    if (current && body.read != null) current.read = body.read;
  });
  return NextResponse.json({ ok: true });
}
