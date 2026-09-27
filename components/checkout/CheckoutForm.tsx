"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { GOVERNORATES } from "@/lib/format";
import { useCart } from "@/components/providers/Providers";

type FormValues = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  governorate: string;
  comment: string;
  mode: "delivery" | "pickup" | "quote";
  contactWhatsapp: boolean;
};

export function CheckoutForm() {
  const cart = useCart();
  const router = useRouter();
  const [done, setDone] = useState("");
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: { mode: "delivery", governorate: "Mahdia", contactWhatsapp: true, city: "Ksour Essef" },
  });

  if (!cart.lines.length && !done) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="font-serif text-5xl">Commande</h1>
        <p className="mt-4 text-stone">Ajoutez un produit avant de commander.</p>
      </div>
    );
  }

  async function onSubmit(values: FormValues) {
    setError("");
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, items: cart.lines }),
    });
    if (!response.ok) {
      setError("La commande n'a pas pu être envoyée.");
      return;
    }
    const data = (await response.json()) as { id: string };
    cart.clear();
    setDone(data.id);
    router.refresh();
  }

  if (done) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <p className="text-[11px] uppercase tracking-[0.22em] text-wood">Commande {done}</p>
        <h1 className="mt-3 font-serif text-5xl">Merci. Votre demande est enregistrée.</h1>
        <p className="mt-4 text-stone">Notre équipe vous contactera pour confirmer le prix, la disponibilité et le retrait ou la livraison.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <h1 className="font-serif text-5xl">Commande</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-4 sm:grid-cols-2">
        <Field label="Prénom" name="firstName" register={register} required />
        <Field label="Nom" name="lastName" register={register} required />
        <Field label="Téléphone" name="phone" register={register} required />
        <Field label="Email" name="email" register={register} type="email" />
        <label className="sm:col-span-2 text-sm">
          Adresse
          <input {...register("address")} className="mt-1 w-full border border-black/10 px-3 py-2" />
        </label>
        <Field label="Ville" name="city" register={register} required />
        <label className="text-sm">
          Gouvernorat
          <select {...register("governorate")} className="mt-1 w-full border border-black/10 bg-white px-3 py-2">
            {GOVERNORATES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <fieldset className="sm:col-span-2">
          <legend className="text-sm">Mode de commande</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {[
              ["delivery", "Livraison"],
              ["pickup", "Retrait en magasin"],
              ["quote", "Demande de devis"],
            ].map(([value, label]) => (
              <label key={value} className="flex items-center gap-2 border border-black/10 px-3 py-3 text-sm">
                <input type="radio" value={value} {...register("mode")} />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="sm:col-span-2 flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("contactWhatsapp")} />
          Je souhaite être contacté par WhatsApp
        </label>
        <label className="sm:col-span-2 text-sm">
          Commentaire
          <textarea {...register("comment")} className="mt-1 h-28 w-full border border-black/10 px-3 py-2" />
        </label>
        {error ? <p className="sm:col-span-2 text-sm text-red-700">{error}</p> : null}
        <button className="sm:col-span-2 rounded-md bg-ink px-4 py-3 text-[12px] uppercase tracking-[0.16em] text-white">Valider la commande</button>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  register,
  required,
  type = "text",
}: {
  label: string;
  name: "firstName" | "lastName" | "phone" | "email" | "city";
  register: ReturnType<typeof useForm<FormValues>>["register"];
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="text-sm">
      {label}
      <input type={type} required={required} {...register(name, { required })} className="mt-1 w-full border border-black/10 px-3 py-2" />
    </label>
  );
}
