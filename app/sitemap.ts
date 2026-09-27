import type { MetadataRoute } from "next";
import { readDb } from "@/lib/store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const db = await readDb();
  const staticRoutes = ["", "/shop", "/cart", "/checkout", "/quote", "/about", "/projects", "/promotions", "/contact", "/login"].map((path) => ({
    url: `${base}${path || "/"}`,
  }));
  return [
    ...staticRoutes,
    ...db.categories.map((category) => ({ url: `${base}/shop/category/${category.slug}` })),
    ...db.products.filter((product) => product.published).map((product) => ({ url: `${base}/product/${product.slug}` })),
  ];
}
