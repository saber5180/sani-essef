import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShopBrowser } from "@/components/shop/ShopBrowser";
import { categoryBySlug } from "@/lib/catalog";
import { toCatalog } from "@/lib/catalog-view";
import { readDb } from "@/lib/store";

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: slug } = await params;
  const db = await readDb();
  const category = categoryBySlug(db, slug);
  return {
    title: category ? `${category.name} Tunisie` : "Catégorie",
    description: category?.description || "Catégorie STE SANI-ESSEF",
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const db = await readDb();
  const category = categoryBySlug(db, slug);
  if (!category) notFound();
  return (
    <ShopBrowser
      products={toCatalog(db)}
      categories={db.categories}
      subcategories={db.subcategories}
      categoryId={category.id}
      title={category.name}
      intro={category.description}
    />
  );
}
