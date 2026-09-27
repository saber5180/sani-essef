"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function AuthForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const response = await fetch(mode === "login" ? "/api/auth/login" : "/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const body = (await response.json()) as { error?: string; role?: string };
    if (!response.ok) {
      setError(body.error || "Connexion impossible.");
      return;
    }
    const next = params.get("next");
    if (body.role === "admin") router.push(next || "/admin");
    else router.push(next && next.startsWith("/") ? next : "/account");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-serif text-5xl">{mode === "login" ? "Connexion" : "Créer un compte"}</h1>
      <form onSubmit={onSubmit} className="mt-8 grid gap-3">
        {mode === "register" ? (
          <>
            <input name="firstName" required placeholder="Prénom" className="border border-black/10 px-3 py-3" />
            <input name="lastName" required placeholder="Nom" className="border border-black/10 px-3 py-3" />
            <input name="phone" placeholder="Téléphone" className="border border-black/10 px-3 py-3" />
          </>
        ) : null}
        <input name="email" type="email" required placeholder="Email" className="border border-black/10 px-3 py-3" />
        <input name="password" type="password" required minLength={6} placeholder="Mot de passe" className="border border-black/10 px-3 py-3" />
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button className="rounded-md bg-ink px-4 py-3 text-[12px] uppercase tracking-[0.16em] text-white">
          {mode === "login" ? "Entrer" : "Créer le compte"}
        </button>
      </form>
      <button type="button" className="mt-4 text-sm text-stone" onClick={() => setMode(mode === "login" ? "register" : "login")}>
        {mode === "login" ? "Pas encore de compte ?" : "Déjà client ?"}
      </button>
    </div>
  );
}
