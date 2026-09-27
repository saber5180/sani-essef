import { NextResponse } from "next/server";
import { denied, requireAdmin } from "@/lib/guard";
import { slugify } from "@/lib/format";
import { readDb, updateDb } from "@/lib/store";
import type { Project } from "@/lib/types";

export async function GET() {
  const db = await readDb();
  return NextResponse.json(db.projects);
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return denied();
  const body = (await request.json()) as Partial<Project>;
  if (!body.title) return NextResponse.json({ error: "Titre requis." }, { status: 400 });
  const project = await updateDb((db) => {
    const created: Project = {
      id: crypto.randomUUID(),
      title: body.title || "",
      slug: slugify(body.title || "realisation"),
      description: body.description || "",
      room: body.room || "",
      image: body.image || "/images/hero.jpg",
      productIds: body.productIds || [],
      published: body.published !== false,
      sortOrder: db.projects.length + 1,
      createdAt: new Date().toISOString(),
    };
    db.projects.unshift(created);
    return created;
  });
  return NextResponse.json(project);
}

export async function PUT(request: Request) {
  if (!(await requireAdmin())) return denied();
  const body = (await request.json()) as Partial<Project> & { id?: string };
  const project = await updateDb((db) => {
    const current = db.projects.find((item) => item.id === body.id);
    if (!current) return null;
    Object.assign(current, body, { id: current.id });
    return current;
  });
  if (!project) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  return NextResponse.json(project);
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) return denied();
  const { id } = (await request.json()) as { id?: string };
  await updateDb((db) => {
    db.projects = db.projects.filter((item) => item.id !== id);
  });
  return NextResponse.json({ ok: true });
}
