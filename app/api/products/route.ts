import { NextResponse } from "next/server";
import { denied, requireAdmin } from "@/lib/guard";
import { slugify } from "@/lib/format";
import { readDb, updateDb } from "@/lib/store";
import type { Product } from "@/lib/types";

export async function GET() {
  const db = await readDb();
  return NextResponse.json(db.products);
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return denied();
  const body = (await request.json()) as Partial<Product>;
  if (!body.name) return NextResponse.json({ error: "Le nom est requis." }, { status: 400 });
  const now = new Date().toISOString();
  const product = await updateDb((db) => {
    const created: Product = {
      id: crypto.randomUUID(),
      name: body.name || "Produit",
      slug: body.slug || slugify(body.name || "produit"),
      description: body.description || "",
      shortDescription: body.shortDescription || "",
      reference: body.reference ?? null,
      categoryId: body.categoryId || db.categories[0]?.id || "",
      subcategoryId: body.subcategoryId || "",
      brand: body.brand ?? null,
      material: body.material ?? null,
      finish: body.finish ?? null,
      color: body.color ?? null,
      format: body.format ?? null,
      originCountry: body.originCountry ?? null,
      madeIn: body.madeIn ?? null,
      style: body.style ?? null,
      usage: body.usage ?? null,
      price: body.price ?? null,
      oldPrice: body.oldPrice ?? null,
      discount: body.discount ?? null,
      currency: "TND",
      unit: body.unit ?? null,
      stock: body.stock ?? null,
      stockStatus: body.stockStatus || "on_request",
      featured: Boolean(body.featured),
      newProduct: Boolean(body.newProduct),
      promotion: Boolean(body.promotion),
      bestSeller: Boolean(body.bestSeller),
      limitedStock: Boolean(body.limitedStock),
      calculatorEnabled: Boolean(body.calculatorEnabled),
      lossPercent: body.lossPercent ?? 10,
      published: body.published !== false,
      seoTitle: body.seoTitle || "",
      seoDescription: body.seoDescription || "",
      seoKeywords: body.seoKeywords || "",
      images: body.images || [],
      variants: body.variants || [],
      technical: body.technical || [],
      extraInfo: body.extraInfo || "Information disponible sur demande.",
      views: 0,
      ordersCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    db.products.unshift(created);
    return created;
  });
  return NextResponse.json(product);
}
