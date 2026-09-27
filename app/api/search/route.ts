import { NextResponse } from "next/server";
import { matchesQuery, publishedProducts } from "@/lib/catalog";
import { readDb } from "@/lib/store";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q") || "";
  const db = await readDb();
  const products = publishedProducts(db)
    .filter((product) => matchesQuery(db, product, query))
    .slice(0, 8)
    .map((product) => ({
      slug: product.slug,
      name: product.name,
      format: product.format,
      image: product.images[0]?.url || null,
    }));
  const needle = query.toLowerCase();
  const categories = db.categories
    .filter((category) => category.name.toLowerCase().includes(needle) || category.description.toLowerCase().includes(needle) || needle.includes(category.name.toLowerCase()))
    .slice(0, 6)
    .map((category) => ({ slug: category.slug, name: category.name }));
  const projects = db.projects
    .filter((project) => project.title.toLowerCase().includes(needle))
    .slice(0, 4)
    .map((project) => ({ slug: project.slug, title: project.title }));
  return NextResponse.json({ products, categories, projects });
}
