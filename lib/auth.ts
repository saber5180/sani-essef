import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export type Session = {
  id: string;
  email: string;
  role: "admin" | "customer";
  firstName: string;
};

function secret() {
  return new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret-change-me");
}

export async function signSession(session: Session) {
  return new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.id)
    .setExpirationTime("7d")
    .sign(secret());
}

export async function readToken(token: string | undefined): Promise<Session | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return {
      id: String(payload.id || ""),
      email: String(payload.email || ""),
      role: payload.role === "admin" ? "admin" : "customer",
      firstName: String(payload.firstName || ""),
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  return readToken(jar.get("sani_session")?.value);
}

export function sessionCookie(token: string) {
  return {
    name: "sani_session",
    value: token,
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    },
  };
}
