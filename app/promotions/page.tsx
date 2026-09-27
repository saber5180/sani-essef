import type { Metadata } from "next";
import { ProductCard } from "@/components/product/ProductCard";
import { publishedProducts } from "@/lib/catalog";
import { discountPercent } from "@/lib/format";
import { readDb } from "@/lib/store";
import { ButtonLink } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Nos offres",
  description: "Promotions carrelage et équipements maison chez STE SANI-ESSEF à Ksour Essef.",
};

export default async function PromotionsPage() {
  const db = await readDb();
  const promos = publishedProducts(db).filter((product) => product.promotion);
  return (
    <div className="mx-auto max-w-page px-4 py-12 md:px-8 md:py-16">
      <p className="text-[11px] uppercase tracking-[0.28em] text-wood">Showroom</p>
      <h1 className="mt-3 font-serif text-5xl md:text-7xl">Nos offres</h1>
      <p className="mt-4 max-w-2xl text-stone">Ancien prix, nouveau prix et réduction apparaissent seulement lorsque l&apos;équipe les a saisis.</p>
      {promos.length ? (
        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-3">
          {promos.map((product) => (
            <div key={product.id}>
              <ProductCard product={product} />
              {product.oldPrice && product.price ? (
                <p className="mt-2 text-sm text-wood">−{discountPercent(product.price, product.oldPrice)}%</p>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-12 bg-mist px-6 py-16 md:px-12">
          <p className="font-serif text-4xl">Aucune promotion publiée pour le moment.</p>
          <p className="mt-3 max-w-xl text-stone">Contactez le showroom pour connaître les conditions en cours. Les badges promotion, nouveauté et stock limité se gèrent depuis l&apos;administration.</p>
          <div className="mt-6">
            <ButtonLink href="/quote">Demander un devis</ButtonLink>
          </div>
        </div>
      )}
    </div>
  );
}
