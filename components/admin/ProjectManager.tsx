"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product, Project } from "@/lib/types";

export function ProjectManager({ projects, products }: { projects: Project[]; products: Product[] }) {
  const router = useRouter();
  const [notice, setNotice] = useState("");

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const productIds = String(data.productIds || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, productIds }),
    });
    setNotice("Réalisation ajoutée.");
    event.currentTarget.reset();
    router.refresh();
  }

  async function remove(id: string) {
    await fetch("/api/projects", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    router.refresh();
  }

  return (
    <div className="grid gap-6">
      {projects.map((project) => (
        <article key={project.id} className="flex items-start justify-between gap-4 bg-white p-4">
          <div>
            <h2 className="font-serif text-2xl">{project.title}</h2>
            <p className="text-sm text-stone">{project.room}</p>
          </div>
          <button type="button" onClick={() => remove(project.id)} className="text-sm">
            Supprimer
          </button>
        </article>
      ))}
      <form onSubmit={create} className="grid gap-3 bg-white p-5">
        <h2 className="font-serif text-3xl">Nouvelle réalisation</h2>
        <input name="title" required placeholder="Titre" className="border border-black/10 px-3 py-2" />
        <input name="room" placeholder="Pièce" className="border border-black/10 px-3 py-2" />
        <input name="image" placeholder="Image (/images/... ou URL)" className="border border-black/10 px-3 py-2" />
        <textarea name="description" placeholder="Description" className="h-24 border border-black/10 px-3 py-2" />
        <select name="productIds" className="border border-black/10 bg-white px-3 py-2" defaultValue="">
          <option value="">Produit utilisé</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
        <button className="rounded-md bg-ink px-4 py-2 text-sm text-white">Ajouter</button>
        {notice ? <p className="text-sm">{notice}</p> : null}
      </form>
    </div>
  );
}
