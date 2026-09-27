import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { sessionCookie, signSession } from "@/lib/auth";
import { updateDb } from "@/lib/store";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";
  if (!email || password.length < 6) {
    return NextResponse.json({ error: "Email et mot de passe (6 caractères minimum) requis." }, { status: 400 });
  }
  const user = await updateDb((db) => {
    if (db.users.some((item) => item.email === email)) return null;
    const created = {
      id: crypto.randomUUID(),
      email,
      passwordHash: "",
      firstName: body.firstName || "",
      lastName: body.lastName || "",
      phone: body.phone || "",
      role: "customer" as const,
      createdAt: new Date().toISOString(),
    };
    db.users.push(created);
    return created;
  });
  if (!user) return NextResponse.json({ error: "Un compte existe déjà avec cet email." }, { status: 409 });
  user.passwordHash = await bcrypt.hash(password, 10);
  await updateDb((db) => {
    const current = db.users.find((item) => item.id === user.id);
    if (current) current.passwordHash = user.passwordHash;
  });
  const token = await signSession({ id: user.id, email: user.email, role: "customer", firstName: user.firstName });
  const cookie = sessionCookie(token);
  const response = NextResponse.json({ role: "customer", email: user.email, firstName: user.firstName });
  response.cookies.set(cookie.name, cookie.value, cookie.options);
  return response;
}
