import { CategoryManager } from "@/components/admin/CategoryManager";
import { readDb } from "@/lib/store";

export default async function CategoriesAdmin() {
  const db = await readDb();
  return (
    <div>
      <h1 className="mb-8 font-serif text-5xl">Catégories</h1>
      <CategoryManager categories={db.categories} subcategories={db.subcategories} />
    </div>
  );
}
