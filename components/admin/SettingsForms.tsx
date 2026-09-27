"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Banner, Settings } from "@/lib/types";

export function SettingsForms({ banner, settings }: { banner: Banner; settings: Settings }) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function save(event: FormEvent<HTMLFormElement>, key: "banner" | "settings") {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const body = key === "banner" ? { banner: { ...banner, ...data, active: true } } : { settings: { ...settings, ...data } };
    await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setMessage("Enregistré.");
    router.refresh();
  }

  return (
    <div className="grid gap-8">
      <form onSubmit={(event) => save(event, "banner")} className="grid gap-3 bg-white p-5">
        <h2 className="font-serif text-3xl">Bannière d&apos;accueil</h2>
        <input name="title" defaultValue={banner.title} className="border border-black/10 px-3 py-2" />
        <textarea name="subtitle" defaultValue={banner.subtitle} className="h-24 border border-black/10 px-3 py-2" />
        <input name="eyebrow" defaultValue={banner.eyebrow} className="border border-black/10 px-3 py-2" />
        <input name="image" defaultValue={banner.image} className="border border-black/10 px-3 py-2" />
        <button className="rounded-md bg-ink px-4 py-2 text-sm text-white">Enregistrer la bannière</button>
      </form>
      <form onSubmit={(event) => save(event, "settings")} className="grid gap-3 bg-white p-5 md:grid-cols-2">
        <h2 className="font-serif text-3xl md:col-span-2">Paramètres</h2>
        <input name="phone" defaultValue={settings.phone} className="border border-black/10 px-3 py-2" />
        <input name="gsm" defaultValue={settings.gsm} className="border border-black/10 px-3 py-2" />
        <input name="address" defaultValue={settings.address} className="border border-black/10 px-3 py-2 md:col-span-2" />
        <input name="hours" defaultValue={settings.hours} className="border border-black/10 px-3 py-2" />
        <input name="days" defaultValue={settings.days} className="border border-black/10 px-3 py-2" />
        <input name="slogan" defaultValue={settings.slogan} className="border border-black/10 px-3 py-2 md:col-span-2" />
        <input name="facebook" defaultValue={settings.facebook} placeholder="Facebook" className="border border-black/10 px-3 py-2" />
        <input name="instagram" defaultValue={settings.instagram} placeholder="Instagram" className="border border-black/10 px-3 py-2" />
        <button className="rounded-md bg-ink px-4 py-2 text-sm text-white md:col-span-2">Enregistrer</button>
      </form>
      {message ? <p className="text-sm">{message}</p> : null}
    </div>
  );
}
