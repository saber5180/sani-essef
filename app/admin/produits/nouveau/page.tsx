import { ProductEditor } from "@/components/admin/ProductEditor";
import { readDb } from "@/lib/store";

export default async function NewProductPage() {
  const db = await readDb();
  return (
    <div>
      <h1 className="mb-8 font-serif text-5xl">Nouveau produit</h1>
      <p className="mb-6 max-w-2xl text-sm text-stone">Laissez vides les champs inconnus. Le site affichera « Disponible sur demande ».</p>
      <ProductEditor initial={null} categories={db.categories} subcategories={db.subcategories} />
    </div>
  );
}
