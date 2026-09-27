"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Category, Product, Subcategory } from "@/lib/types";

const emptyProduct = (categories: Category[], subcategories: Subcategory[]): Product => ({
  id: "",
  name: "",
  slug: "",
  description: "",
  shortDescription: "",
  reference: null,
  categoryId: categories[0]?.id || "",
  subcategoryId: subcategories.find((item) => item.categoryId === categories[0]?.id)?.id || "",
  brand: null,
  material: null,
  finish: null,
  color: null,
  format: null,
  originCountry: null,
  madeIn: null,
  style: null,
  usage: null,
  price: null,
  oldPrice: null,
  discount: null,
  currency: "TND",
  unit: null,
  stock: null,
  stockStatus: "on_request",
  featured: false,
  newProduct: false,
  promotion: false,
  bestSeller: false,
  limitedStock: false,
  calculatorEnabled: false,
  lossPercent: 10,
  published: true,
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  images: [],
  variants: [],
  technical: [],
  extraInfo: "",
  views: 0,
  ordersCount: 0,
  createdAt: "",
  updatedAt: "",
});

export function ProductEditor({
  initial,
  categories,
  subcategories,
}: {
  initial: Product | null;
  categories: Category[];
  subcategories: Subcategory[];
}) {
  const router = useRouter();
  const [product, setProduct] = useState<Product>(initial || emptyProduct(categories, subcategories));
  const [error, setError] = useState("");
  const subs = useMemo(() => subcategories.filter((item) => item.categoryId === product.categoryId), [subcategories, product.categoryId]);

  function set<K extends keyof Product>(key: K, value: Product[K]) {
    setProduct((current) => ({ ...current, [key]: value }));
  }

  async function upload(file: File) {
    const form = new FormData();
    form.set("file", file);
    const response = await fetch("/api/upload", { method: "POST", body: form });
    const data = (await response.json()) as { url?: string };
    if (data.url) {
      set("images", [...product.images, { id: crypto.randomUUID(), url: data.url, alt: product.name, order: product.images.length }]);
    }
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setError("");
    const payload = {
      ...product,
      price: product.price,
      oldPrice: product.oldPrice,
      stock: product.stock,
      images: product.images.map((image, order) => ({ ...image, order })),
    };
    const response = await fetch(product.id ? `/api/products/${product.id}` : "/api/products", {
      method: product.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      setError("Enregistrement impossible.");
      return;
    }
    router.push("/admin/produits");
    router.refresh();
  }

  async function remove() {
    if (!product.id || !confirm("Supprimer ce produit ?")) return;
    await fetch(`/api/products/${product.id}`, { method: "DELETE" });
    router.push("/admin/produits");
    router.refresh();
  }

  return (
    <form onSubmit={save} className="grid max-w-4xl gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Text label="Nom" value={product.name} onChange={(value) => set("name", value)} required />
        <Text label="Slug" value={product.slug} onChange={(value) => set("slug", value)} />
        <Text label="Référence" value={product.reference || ""} onChange={(value) => set("reference", value || null)} />
        <Text label="Marque" value={product.brand || ""} onChange={(value) => set("brand", value || null)} />
        <Text label="Matière" value={product.material || ""} onChange={(value) => set("material", value || null)} />
        <Text label="Finition" value={product.finish || ""} onChange={(value) => set("finish", value || null)} />
        <Text label="Couleur" value={product.color || ""} onChange={(value) => set("color", value || null)} />
        <Text label="Format" value={product.format || ""} onChange={(value) => set("format", value || null)} />
        <Text label="Origine" value={product.originCountry || ""} onChange={(value) => set("originCountry", value || null)} />
        <Text label="Pays de fabrication" value={product.madeIn || ""} onChange={(value) => set("madeIn", value || null)} />
        <Text label="Style" value={product.style || ""} onChange={(value) => set("style", value || null)} />
        <Text label="Usage" value={product.usage || ""} onChange={(value) => set("usage", value || null)} />
        <label className="text-sm">
          Catégorie
          <select value={product.categoryId} onChange={(event) => set("categoryId", event.target.value)} className="mt-1 w-full border border-black/10 bg-white px-3 py-2">
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Sous-catégorie
          <select value={product.subcategoryId} onChange={(event) => set("subcategoryId", event.target.value)} className="mt-1 w-full border border-black/10 bg-white px-3 py-2">
            <option value="">—</option>
            {subs.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <Text label="Prix (DT)" value={product.price ?? ""} onChange={(value) => set("price", value === "" ? null : Number(value))} />
        <Text label="Ancien prix" value={product.oldPrice ?? ""} onChange={(value) => set("oldPrice", value === "" ? null : Number(value))} />
        <label className="text-sm">
          Unité
          <select value={product.unit || ""} onChange={(event) => set("unit", (event.target.value || null) as Product["unit"])} className="mt-1 w-full border border-black/10 bg-white px-3 py-2">
            <option value="">Sur demande</option>
            <option value="m2">m²</option>
            <option value="piece">Pièce</option>
            <option value="carton">Carton</option>
            <option value="request">Prix sur demande</option>
          </select>
        </label>
        <label className="text-sm">
          Disponibilité
          <select value={product.stockStatus} onChange={(event) => set("stockStatus", event.target.value as Product["stockStatus"])} className="mt-1 w-full border border-black/10 bg-white px-3 py-2">
            <option value="on_request">Sur demande</option>
            <option value="available">En stock</option>
            <option value="limited">Stock limité</option>
            <option value="out">Rupture</option>
          </select>
        </label>
        <Text label="Stock" value={product.stock ?? ""} onChange={(value) => set("stock", value === "" ? null : Number(value))} />
        <Text label="Marge de perte %" value={product.lossPercent} onChange={(value) => set("lossPercent", Number(value))} />
      </div>
      <Area label="Description courte" value={product.shortDescription} onChange={(value) => set("shortDescription", value)} />
      <Area label="Description" value={product.description} onChange={(value) => set("description", value)} />
      <Area label="Informations complémentaires" value={product.extraInfo} onChange={(value) => set("extraInfo", value)} />
      <div className="flex flex-wrap gap-4 text-sm">
        <Check label="Publier" checked={product.published} onChange={(value) => set("published", value)} />
        <Check label="Mis en avant" checked={product.featured} onChange={(value) => set("featured", value)} />
        <Check label="Nouveauté" checked={product.newProduct} onChange={(value) => set("newProduct", value)} />
        <Check label="Promotion" checked={product.promotion} onChange={(value) => set("promotion", value)} />
        <Check label="Meilleure vente" checked={product.bestSeller} onChange={(value) => set("bestSeller", value)} />
        <Check label="Stock limité" checked={product.limitedStock} onChange={(value) => set("limitedStock", value)} />
        <Check label="Calculateur m²" checked={product.calculatorEnabled} onChange={(value) => set("calculatorEnabled", value)} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Text label="SEO title" value={product.seoTitle} onChange={(value) => set("seoTitle", value)} />
        <Text label="SEO description" value={product.seoDescription} onChange={(value) => set("seoDescription", value)} />
        <Text label="SEO mots-clés" value={product.seoKeywords} onChange={(value) => set("seoKeywords", value)} />
      </div>
      <section className="bg-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl">Images</h2>
          <label className="cursor-pointer text-sm underline">
            Upload
            <input type="file" accept="image/*" className="hidden" onChange={(event) => event.target.files?.[0] && upload(event.target.files[0])} />
          </label>
        </div>
        <div className="mt-3 space-y-2">
          {product.images.map((image, index) => (
            <div key={image.id} className="grid grid-cols-[1fr_auto_auto] gap-2">
              <input value={image.url} onChange={(event) => set("images", product.images.map((item) => (item.id === image.id ? { ...item, url: event.target.value } : item)))} className="border border-black/10 px-2 py-2 text-sm" />
              <button type="button" className="text-sm" onClick={() => moveImage(index, -1)}>
                Monter
              </button>
              <button type="button" className="text-sm" onClick={() => set("images", product.images.filter((item) => item.id !== image.id))}>
                Retirer
              </button>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl">Caractéristiques</h2>
          <button type="button" className="text-sm underline" onClick={() => set("technical", [...product.technical, { label: "", value: "" }])}>
            Ajouter
          </button>
        </div>
        {product.technical.map((spec, index) => (
          <div key={`${spec.label}-${index}`} className="mt-2 grid grid-cols-2 gap-2">
            <input value={spec.label} placeholder="Libellé" onChange={(event) => updateSpec(index, "label", event.target.value)} className="border border-black/10 px-2 py-2 text-sm" />
            <input value={spec.value} placeholder="Valeur" onChange={(event) => updateSpec(index, "value", event.target.value)} className="border border-black/10 px-2 py-2 text-sm" />
          </div>
        ))}
      </section>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <div className="flex gap-3">
        <button className="rounded-md bg-ink px-4 py-3 text-[12px] uppercase tracking-[0.16em] text-white">{product.id ? "Enregistrer" : "Publier le produit"}</button>
        {product.id ? (
          <button type="button" onClick={remove} className="rounded-md border border-black/15 px-4 py-3 text-[12px] uppercase tracking-[0.16em]">
            Supprimer
          </button>
        ) : null}
      </div>
    </form>
  );

  function moveImage(index: number, direction: number) {
    const next = [...product.images];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    set("images", next);
  }

  function updateSpec(index: number, key: "label" | "value", value: string) {
    set(
      "technical",
      product.technical.map((spec, specIndex) => (specIndex === index ? { ...spec, [key]: value } : spec)),
    );
  }
}

function Text({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="text-sm">
      {label}
      <input required={required} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full border border-black/10 bg-white px-3 py-2" />
    </label>
  );
}

function Area({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="text-sm">
      {label}
      <textarea value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 h-28 w-full border border-black/10 bg-white px-3 py-2" />
    </label>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex items-center gap-2">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {label}
    </label>
  );
}
