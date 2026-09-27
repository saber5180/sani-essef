"use client";

import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";

export function PromotionEditor({ products }: { products: Product[] }) {
  const router = useRouter();
  async function save(product: Product, form: HTMLFormElement) {
    const data = new FormData(form);
    await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        promotion: data.get("promotion") === "on",
        newProduct: data.get("newProduct") === "on",
        bestSeller: data.get("bestSeller") === "on",
        limitedStock: data.get("limitedStock") === "on",
        price: data.get("price") ? Number(data.get("price")) : null,
        oldPrice: data.get("oldPrice") ? Number(data.get("oldPrice")) : null,
      }),
    });
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <form
          key={product.id}
          className="grid items-end gap-3 bg-white p-4 md:grid-cols-6"
          onSubmit={(event) => {
            event.preventDefault();
            save(product, event.currentTarget);
          }}
        >
          <p className="font-medium md:col-span-2">{product.name}</p>
          <input name="price" defaultValue={product.price ?? ""} placeholder="Prix" className="border border-black/10 px-2 py-2" />
          <input name="oldPrice" defaultValue={product.oldPrice ?? ""} placeholder="Ancien prix" className="border border-black/10 px-2 py-2" />
          <div className="flex flex-col gap-1 text-xs">
            <label><input type="checkbox" name="promotion" defaultChecked={product.promotion} /> Promotion</label>
            <label><input type="checkbox" name="newProduct" defaultChecked={product.newProduct} /> Nouveauté</label>
            <label><input type="checkbox" name="bestSeller" defaultChecked={product.bestSeller} /> Meilleure vente</label>
            <label><input type="checkbox" name="limitedStock" defaultChecked={product.limitedStock} /> Stock limité</label>
          </div>
          <button className="rounded-md bg-ink px-3 py-2 text-sm text-white">Enregistrer</button>
        </form>
      ))}
    </div>
  );
}
