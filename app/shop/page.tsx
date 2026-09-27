import type { Metadata } from "next";
import { ShopBrowser } from "@/components/shop/ShopBrowser";
import { toCatalog } from "@/lib/catalog-view";
import { readDb } from "@/lib/store";

export const metadata: Metadata = {
  title: "Boutique",
  description: "Carrelage, salle de bain, sanitaires, robinetterie et revêtements chez STE SANI-ESSEF à Ksour Essef.",
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const db = await readDb();
  return (
    <ShopBrowser
      products={toCatalog(db)}
      categories={db.categories}
      subcategories={db.subcategories}
      initialQuery={q || ""}
      title="La boutique"
      intro="Carrelages, revêtements et équipements pour composer un intérieur. Filtrez par format, couleur, finition ou origine."
    />
  );
}
