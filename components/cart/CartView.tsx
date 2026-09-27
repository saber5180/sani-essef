"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart, useI18n } from "@/components/providers/Providers";
import { money, unitLabel } from "@/lib/format";

export function CartView() {
  const { lines, setQty, remove, clear } = useCart();
  const { t } = useI18n();
  const priced = lines.every((line) => line.price != null);
  const total = priced ? lines.reduce((sum, line) => sum + (line.price || 0) * line.quantity, 0) : null;

  return (
    <div className="mx-auto max-w-page px-4 py-12 md:px-8 md:py-16">
      <h1 className="font-serif text-5xl md:text-6xl">{t.cart}</h1>
      {lines.length === 0 ? (
        <div className="mt-10 bg-mist px-6 py-16">
          <p className="font-serif text-3xl">{t.emptyCart}</p>
          <Link href="/shop" className="mt-6 inline-block rounded-md bg-ink px-5 py-3 text-[12px] uppercase tracking-[0.16em] text-white">
            {t.seeProducts}
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            {lines.map((line) => (
              <article key={line.key} className="grid grid-cols-[96px_1fr] gap-4 border-b border-black/10 pb-6 sm:grid-cols-[140px_1fr_auto]">
                <div className="relative aspect-square bg-mist">
                  {line.image ? <Image src={line.image} alt={line.name} fill className="object-cover" /> : null}
                </div>
                <div>
                  <h2 className="font-serif text-2xl">{line.name}</h2>
                  <p className="mt-1 text-sm text-stone">Réf. {line.reference || "Disponible sur demande"}</p>
                  {line.finish ? <p className="text-sm text-stone">{line.finish}</p> : null}
                  <p className="mt-2 text-sm">{line.price == null ? "Prix sur demande" : `${line.price} DT`}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <button type="button" aria-label="Diminuer" onClick={() => setQty(line.key, Math.max(0, Math.round((line.quantity - 0.5) * 10) / 10))} className="grid h-8 w-8 place-items-center rounded-md border border-black/15">
                      <Minus size={14} />
                    </button>
                    <span>
                      {line.quantity} {unitLabel(line.unit)}
                    </span>
                    <button type="button" aria-label="Augmenter" onClick={() => setQty(line.key, Math.round((line.quantity + 0.5) * 10) / 10)} className="grid h-8 w-8 place-items-center rounded-md border border-black/15">
                      <Plus size={14} />
                    </button>
                    <button type="button" aria-label="Supprimer" onClick={() => remove(line.key)} className="text-stone">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-sm sm:text-right">{line.price == null ? "Sur devis" : money((line.price || 0) * line.quantity)}</p>
              </article>
            ))}
            <button type="button" onClick={clear} className="text-[12px] uppercase tracking-[0.16em] text-stone">
              Vider le panier
            </button>
          </div>
          <aside className="h-fit bg-mist p-6">
            <p className="text-[11px] uppercase tracking-[0.18em] text-wood">Total</p>
            <p className="mt-3 font-serif text-4xl">{money(total)}</p>
            {!priced ? <p className="mt-2 text-sm text-stone">Certains prix seront confirmés par le showroom.</p> : null}
            <Link href="/checkout" className="mt-6 block rounded-md bg-ink px-4 py-3 text-center text-[12px] uppercase tracking-[0.16em] text-white">
              {t.checkout}
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
