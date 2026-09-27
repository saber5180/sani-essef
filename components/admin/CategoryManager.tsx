"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Category, Subcategory } from "@/lib/types";

export function CategoryManager({ categories, subcategories }: { categories: Category[]; subcategories: Subcategory[] }) {
  const router = useRouter();
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");

  async function addCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    await fetch("/api/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    form.reset();
    router.refresh();
  }

  async function addSub(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const name = String(new FormData(form).get("name") || "");
    await fetch("/api/subcategories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryId, name }),
    });
    form.reset();
    router.refresh();
  }

  return (
    <div className="grid gap-8">
      {categories.map((category) => (
        <section key={category.id} className="bg-white p-5">
          <h2 className="font-serif text-3xl">{category.name}</h2>
          <p className="mt-1 text-sm text-stone">{category.description}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {subcategories
              .filter((item) => item.categoryId === category.id)
              .map((item) => (
                <li key={item.id} className="border border-black/10 px-3 py-1 text-sm">
                  {item.name}
                </li>
              ))}
          </ul>
        </section>
      ))}
      <form onSubmit={addCategory} className="grid gap-3 bg-white p-5 md:grid-cols-3">
        <input name="name" required placeholder="Nouvelle catégorie" className="border border-black/10 px-3 py-2" />
        <input name="description" placeholder="Description" className="border border-black/10 px-3 py-2" />
        <button className="rounded-md bg-ink px-4 py-2 text-sm text-white">Ajouter</button>
      </form>
      <form onSubmit={addSub} className="grid gap-3 bg-white p-5 md:grid-cols-3">
        <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)} className="border border-black/10 bg-white px-3 py-2">
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <input name="name" required placeholder="Sous-catégorie" className="border border-black/10 px-3 py-2" />
        <button className="rounded-md bg-ink px-4 py-2 text-sm text-white">Ajouter</button>
      </form>
    </div>
  );
}
