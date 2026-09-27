"use client";

import { FormEvent, useState } from "react";
import { company, generalWhatsappMessage, whatsappLink } from "@/lib/company";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      setSent(true);
      form.reset();
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <input name="name" required placeholder="Nom" className="border border-black/10 px-3 py-3" />
      <input name="phone" placeholder="Téléphone" className="border border-black/10 px-3 py-3" />
      <input name="email" type="email" placeholder="Email" className="border border-black/10 px-3 py-3" />
      <textarea name="message" required placeholder="Message" className="h-32 border border-black/10 px-3 py-3" />
      <button className="rounded-md bg-ink px-4 py-3 text-[12px] uppercase tracking-[0.16em] text-white">Envoyer</button>
      {sent ? <p>Merci. Votre message a bien été envoyé.</p> : null}
      <span className="sr-only">{whatsappLink(generalWhatsappMessage())}</span>
    </form>
  );
}

export function ContactActions() {
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <a href={`tel:${company.phoneTel}`} className="rounded-md bg-ink px-4 py-3 text-[12px] uppercase tracking-[0.16em] text-white">
        Appeler
      </a>
      <a href={whatsappLink(generalWhatsappMessage())} className="rounded-md border border-ink/15 px-4 py-3 text-[12px] uppercase tracking-[0.16em]">
        WhatsApp
      </a>
    </div>
  );
}
