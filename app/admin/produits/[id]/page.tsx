import { notFound } from "next/navigation";
import { ProductEditor } from "@/components/admin/ProductEditor";
import { readDb } from "@/lib/store";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await readDb();
  const product = db.products.find((item) => item.id === id);
  if (!product) notFound();
  return (
    <div>
      <h1 className="mb-8 font-serif text-5xl">Modifier</h1>
      <ProductEditor initial={product} categories={db.categories} subcategories={db.subcategories} />
    </div>
  );
}
