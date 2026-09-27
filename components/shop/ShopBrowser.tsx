"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import type { Category, Subcategory } from "@/lib/types";
import type { CatalogProduct } from "@/lib/catalog-view";
import { compactSize, normalizeSearch } from "@/lib/format";

const knownFormats = ["120 × 60 cm", "20 × 80 cm"];
const knownFinishes = ["Extra-poli", "Mat satiné", "Semi-grès"];

export function ShopBrowser({
  products,
  categories,
  subcategories,
  categoryId,
  initialQuery = "",
  title,
  intro,
}: {
  products: CatalogProduct[];
  categories: Category[];
  subcategories: Subcategory[];
  categoryId?: string;
  initialQuery?: string;
  title: string;
  intro: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const [subcategory, setSubcategory] = useState("");
  const [formats, setFormats] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [finishes, setFinishes] = useState<string[]>([]);
  const [materials, setMaterials] = useState<string[]>([]);
  const [origins, setOrigins] = useState<string[]>([]);
  const [styles, setStyles] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const pool = categoryId ? products.filter((product) => product.categoryId === categoryId) : products;
  const subs = subcategories.filter((item) => !categoryId || item.categoryId === categoryId);

  const result = useMemo(() => {
    const q = normalizeSearch(query);
    const compact = compactSize(query);
    return pool.filter((product) => {
      if (q) {
        const hay = normalizeSearch(product.searchText);
        const hit = hay.includes(q) || (compact.length > 2 && compactSize(product.searchText).includes(compact));
        if (!hit) return false;
      }
      if (subcategory && product.subcategoryId !== subcategory) return false;
      if (!matchValue(product.format, formats, knownFormats)) return false;
      if (!matchValue(product.color, colors, unique(pool.map((item) => item.color)))) return false;
      if (finishes.length) {
        const values = [product.finish, ...product.variants.map((variant) => variant.finish)].filter(Boolean) as string[];
        const ok = values.some((value) => finishes.includes(value)) || (finishes.includes("Autre") && values.every((value) => !knownFinishes.includes(value)));
        if (!ok) return false;
      }
      if (!matchValue(product.material, materials, unique(pool.map((item) => item.material)))) return false;
      if (!matchValue(product.originCountry, origins, unique(pool.map((item) => item.originCountry)))) return false;
      if (!matchValue(product.style, styles, unique(pool.map((item) => item.style)))) return false;
      if (availability.length && !availability.includes(product.stockStatus)) return false;
      const min = minPrice ? Number(minPrice) : null;
      const max = maxPrice ? Number(maxPrice) : null;
      if (min != null && (product.price == null || product.price < min)) return false;
      if (max != null && (product.price == null || product.price > max)) return false;
      return true;
    });
  }, [pool, query, subcategory, formats, colors, finishes, materials, origins, styles, availability, minPrice, maxPrice]);

  const filters = (
    <div className="space-y-6 text-sm">
      <label className="block">
        <span className="text-[11px] uppercase tracking-[0.16em] text-stone">Recherche</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} className="mt-2 w-full border border-black/10 bg-white px-3 py-2" />
      </label>
      <label className="block">
        <span className="text-[11px] uppercase tracking-[0.16em] text-stone">Catégorie</span>
        <select
          value={categoryId || ""}
          onChange={(event) => router.push(event.target.value ? `/shop/category/${event.target.value}` : "/shop")}
          className="mt-2 w-full border border-black/10 bg-white px-3 py-2"
        >
          <option value="">Toutes</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-[11px] uppercase tracking-[0.16em] text-stone">Sous-catégorie</span>
        <select value={subcategory} onChange={(event) => setSubcategory(event.target.value)} className="mt-2 w-full border border-black/10 bg-white px-3 py-2">
          <option value="">Toutes</option>
          {subs.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
      <CheckGroup title="Format" options={[...knownFormats, "Autre"]} selected={formats} onChange={setFormats} />
      <CheckGroup title="Couleur" options={withOther(unique(pool.map((item) => item.color)))} selected={colors} onChange={setColors} />
      <CheckGroup title="Finition" options={[...knownFinishes, "Autre"]} selected={finishes} onChange={setFinishes} />
      <CheckGroup title="Matière" options={withOther(unique(pool.map((item) => item.material)))} selected={materials} onChange={setMaterials} />
      <CheckGroup title="Origine" options={withOther(unique(pool.map((item) => item.originCountry)))} selected={origins} onChange={setOrigins} />
      <CheckGroup title="Style" options={withOther(unique(pool.map((item) => item.style)))} selected={styles} onChange={setStyles} />
      <CheckGroup
        title="Disponibilité"
        options={["on_request", "available", "limited", "out"]}
        labels={{ on_request: "Sur demande", available: "En stock", limited: "Stock limité", out: "Rupture" }}
        selected={availability}
        onChange={setAvailability}
      />
      <div>
        <p className="text-[11px] uppercase tracking-[0.16em] text-stone">Prix (DT)</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <input value={minPrice} onChange={(event) => setMinPrice(event.target.value)} placeholder="Min" className="border border-black/10 px-3 py-2" />
          <input value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} placeholder="Max" className="border border-black/10 px-3 py-2" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-page px-4 py-12 md:px-8 md:py-16">
      <p className="text-[11px] uppercase tracking-[0.28em] text-wood">Boutique</p>
      <h1 className="mt-3 font-serif text-5xl md:text-6xl">{title}</h1>
      <p className="mt-4 max-w-2xl text-stone">{intro}</p>
      <div className="mt-10 grid gap-10 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">{filters}</aside>
        <div>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-stone">{result.length} produit{result.length > 1 ? "s" : ""}</p>
            <button type="button" className="inline-flex items-center gap-2 rounded-md border border-black/10 px-3 py-2 text-sm lg:hidden" onClick={() => setOpen((value) => !value)}>
              <SlidersHorizontal size={16} /> Filtres
            </button>
          </div>
          {open ? <div className="mb-8 border border-black/10 bg-mist p-4 lg:hidden">{filters}</div> : null}
          {result.length ? (
            <div className="grid grid-cols-2 items-stretch gap-4 md:grid-cols-3 xl:grid-cols-4">
              {result.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="border border-black/10 bg-mist px-6 py-16 text-center">
              <p className="font-serif text-3xl">Aucun produit pour ces critères.</p>
              <p className="mt-3 text-stone">Le catalogue s&apos;enrichira depuis l&apos;administration. Les informations manquantes restent sur demande.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function unique(values: (string | null)[]) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value))));
}

function withOther(values: string[]) {
  return values.includes("Autre") ? values : [...values, "Autre"];
}

function matchValue(value: string | null, selected: string[], known: string[]) {
  if (!selected.length) return true;
  if (value && selected.includes(value)) return true;
  if (selected.includes("Autre") && (!value || !known.includes(value))) return true;
  return false;
}

function CheckGroup({
  title,
  options,
  selected,
  onChange,
  labels,
}: {
  title: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
  labels?: Record<string, string>;
}) {
  if (!options.length) return null;
  return (
    <fieldset>
      <legend className="text-[11px] uppercase tracking-[0.16em] text-stone">{title}</legend>
      <div className="mt-2 space-y-1.5">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => onChange(selected.includes(option) ? selected.filter((item) => item !== option) : [...selected, option])}
            />
            <span>{labels?.[option] || option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
