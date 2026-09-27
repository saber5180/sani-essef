import type { Database, Product } from "./types";
import { compactSize, normalizeSearch } from "./format";

export function publishedProducts(db: Database) {
  return db.products.filter((product) => product.published);
}

export function categoryBySlug(db: Database, slug: string) {
  return db.categories.find((category) => category.slug === slug);
}

export function productBySlug(db: Database, slug: string) {
  return db.products.find((product) => product.slug === slug);
}

export function categoryName(db: Database, id: string) {
  return db.categories.find((category) => category.id === id)?.name || "";
}

export function subcategoryName(db: Database, id: string) {
  return db.subcategories.find((item) => item.id === id)?.name || "";
}

export function productSearchText(db: Database, product: Product) {
  return [
    product.name,
    product.reference,
    product.format,
    product.color,
    product.style,
    product.finish,
    product.material,
    product.originCountry,
    product.madeIn,
    product.description,
    product.seoKeywords,
    categoryName(db, product.categoryId),
    subcategoryName(db, product.subcategoryId),
    ...product.variants.map((variant) => variant.name),
  ]
    .filter(Boolean)
    .join(" ");
}

export function matchesQuery(db: Database, product: Product, query: string) {
  const q = normalizeSearch(query);
  if (!q) return true;
  const hay = normalizeSearch(productSearchText(db, product));
  if (hay.includes(q)) return true;
  const compactQuery = compactSize(query);
  const compactHay = compactSize(productSearchText(db, product));
  return compactQuery.length > 2 && compactHay.includes(compactQuery);
}

export function similarProducts(db: Database, product: Product, limit = 4) {
  return publishedProducts(db)
    .filter((item) => item.id !== product.id)
    .map((item) => {
      let score = 0;
      if (item.categoryId === product.categoryId) score += 1;
      if (item.subcategoryId === product.subcategoryId) score += 3;
      if (item.style && item.style === product.style) score += 3;
      if (item.format && item.format === product.format) score += 2;
      if (item.color && product.color && normalizeSearch(item.color).split(" ").some((word) => normalizeSearch(product.color || "").includes(word))) {
        score += 2;
      }
      return { item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.item);
}

export function filterProducts(
  products: Product[],
  filters: {
    category?: string;
    subcategory?: string;
    formats?: string[];
    colors?: string[];
    finishes?: string[];
    materials?: string[];
    origins?: string[];
    styles?: string[];
    availability?: string[];
    minPrice?: number | null;
    maxPrice?: number | null;
  },
) {
  return products.filter((product) => {
    if (filters.category && product.categoryId !== filters.category) return false;
    if (filters.subcategory && product.subcategoryId !== filters.subcategory) return false;
    if (filters.formats?.length && !filters.formats.includes(product.format || "Autre")) return false;
    if (filters.colors?.length && !filters.colors.includes(product.color || "Autre")) return false;
    if (filters.finishes?.length) {
      const finishes = [product.finish, ...product.variants.map((variant) => variant.finish)].filter(Boolean) as string[];
      if (!finishes.some((finish) => filters.finishes?.includes(finish))) return false;
    }
    if (filters.materials?.length && !filters.materials.includes(product.material || "Autre")) return false;
    if (filters.origins?.length && !filters.origins.includes(product.originCountry || "Autre")) return false;
    if (filters.styles?.length && !filters.styles.includes(product.style || "Autre")) return false;
    if (filters.availability?.length && !filters.availability.includes(product.stockStatus)) return false;
    if (filters.minPrice != null && (product.price == null || product.price < filters.minPrice)) return false;
    if (filters.maxPrice != null && (product.price == null || product.price > filters.maxPrice)) return false;
    return true;
  });
}
