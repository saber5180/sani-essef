"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";

export function QuoteForm() {
  const params = useSearchParams();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/quotes", { method: "POST", body: form });
    if (!response.ok) {
      setError("Envoi impossible pour le moment.");
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <h1 className="font-serif text-5xl">Merci pour votre demande.</h1>
        <p className="mt-4 text-lg text-stone">Notre équipe vous contactera prochainement.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <p className="text-[11px] uppercase tracking-[0.22em] text-wood">Showroom</p>
      <h1 className="mt-3 font-serif text-5xl md:text-6xl">Demander un devis</h1>
      <form onSubmit={onSubmit} className="mt-8 grid gap-4">
        <input name="name" required placeholder="Nom" className="border border-black/10 px-3 py-3" />
        <input name="phone" required placeholder="Téléphone" className="border border-black/10 px-3 py-3" />
        <input name="email" type="email" placeholder="Email" className="border border-black/10 px-3 py-3" />
        <input name="productName" defaultValue={params.get("produit") || ""} placeholder="Produit" className="border border-black/10 px-3 py-3" />
        <div className="grid gap-4 sm:grid-cols-2">
          <input name="quantity" placeholder="Quantité" className="border border-black/10 px-3 py-3" />
          <input name="surface" placeholder="Surface souhaitée" className="border border-black/10 px-3 py-3" />
        </div>
        <textarea name="message" placeholder="Message" className="h-32 border border-black/10 px-3 py-3" />
        <label className="text-sm text-stone">
          Image facultative
          <input name="image" type="file" accept="image/*" className="mt-2 block w-full" />
        </label>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button className="rounded-md bg-ink px-4 py-3 text-[12px] uppercase tracking-[0.16em] text-white">Demander un devis</button>
      </form>
    </div>
  );
}
