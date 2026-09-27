import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { ProductCard } from "@/components/product/ProductCard";
import { productBySlug, similarProducts } from "@/lib/catalog";
import { readDb, updateDb } from "@/lib/store";
import { getDictionary } from "@/lib/locale";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const db = await readDb();
  const product = productBySlug(db, slug);
  if (!product) return { title: "Produit" };
  return {
    title: { absolute: product.seoTitle || `${product.name} | STE SANI-ESSEF` },
    description: product.seoDescription || product.shortDescription,
    keywords: product.seoKeywords,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { t } = await getDictionary();
  const db = await readDb();
  const product = productBySlug(db, slug);
  if (!product || !product.published) notFound();
  await updateDb((store) => {
    const current = store.products.find((item) => item.id === product.id);
    if (current) current.views += 1;
  });
  const related = similarProducts(db, product, 4);
  const reviews = db.reviews.filter((review) => review.productId === product.id && review.approved);

  return (
    <>
      <ProductPurchase product={product} reviews={reviews} />
      {related.length ? (
        <section className="mx-auto max-w-page px-4 pb-20 md:px-8">
          <h2 className="font-serif text-4xl">{t.similar}</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
