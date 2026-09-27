import { NextResponse } from "next/server";
import { getSession } from "./auth";

export async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "admin") return null;
  return session;
}

export function denied() {
  return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
}
