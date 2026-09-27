import type { Database, Product } from "./types";
import { productSearchText } from "./catalog";

export type CatalogProduct = Product & {
  searchText: string;
  categoryName: string;
  subcategoryName: string;
};

export function toCatalog(db: Database): CatalogProduct[] {
  return db.products
    .filter((product) => product.published)
    .map((product) => ({
      ...product,
      searchText: productSearchText(db, product),
      categoryName: db.categories.find((category) => category.id === product.categoryId)?.name || "",
      subcategoryName: db.subcategories.find((item) => item.id === product.subcategoryId)?.name || "",
    }));
}
