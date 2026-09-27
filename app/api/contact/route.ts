import { NextResponse } from "next/server";
import { denied, requireAdmin } from "@/lib/guard";
import { readDb, updateDb } from "@/lib/store";

export async function GET() {
  if (!(await requireAdmin())) return denied();
  const db = await readDb();
  return NextResponse.json(db.messages);
}

export async function POST(request: Request) {
  const body = (await request.json()) as { name?: string; phone?: string; email?: string; message?: string };
  if (!body.name || !body.message) return NextResponse.json({ error: "Message incomplet." }, { status: 400 });
  const message = await updateDb((db) => {
    const created = {
      id: crypto.randomUUID(),
      name: body.name || "",
      phone: body.phone || "",
      email: body.email || "",
      message: body.message || "",
      read: false,
      createdAt: new Date().toISOString(),
    };
    db.messages.unshift(created);
    return created;
  });
  return NextResponse.json({ id: message.id });
}
