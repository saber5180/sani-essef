import { NextResponse } from "next/server";
import { denied, requireAdmin } from "@/lib/guard";
import { readDb, updateDb } from "@/lib/store";
import type { Banner, Settings } from "@/lib/types";

export async function GET() {
  const db = await readDb();
  return NextResponse.json({ banners: db.banners, settings: db.settings });
}

export async function PUT(request: Request) {
  if (!(await requireAdmin())) return denied();
  const body = (await request.json()) as { banner?: Banner; settings?: Settings };
  const saved = await updateDb((db) => {
    if (body.banner) {
      const current = db.banners.find((item) => item.id === body.banner?.id) || db.banners[0];
      if (current) Object.assign(current, body.banner, { id: current.id });
    }
    if (body.settings) db.settings = { ...db.settings, ...body.settings };
    return { banners: db.banners, settings: db.settings };
  });
  return NextResponse.json(saved);
}
