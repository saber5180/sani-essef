import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { sessionCookie, signSession } from "@/lib/auth";
import { readDb } from "@/lib/store";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };
  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";
  const db = await readDb();
  const user = db.users.find((item) => item.email === email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return NextResponse.json({ error: "Identifiants incorrects." }, { status: 401 });
  }
  const token = await signSession({
    id: user.id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
  });
  const cookie = sessionCookie(token);
  const response = NextResponse.json({ role: user.role, email: user.email, firstName: user.firstName });
  response.cookies.set(cookie.name, cookie.value, cookie.options);
  return response;
}
