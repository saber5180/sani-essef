"use client";

import { useRouter } from "next/navigation";

export function PublishButton({ id, published }: { id: string; published: boolean }) {
  const router = useRouter();
  async function toggle() {
    await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !published }),
    });
    router.refresh();
  }
  return (
    <button type="button" onClick={toggle} className="text-[12px] uppercase tracking-[0.14em]">
      {published ? "Désactiver" : "Publier"}
    </button>
  );
}
