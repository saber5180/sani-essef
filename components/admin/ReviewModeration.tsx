"use client";

import { useRouter } from "next/navigation";
import type { Review } from "@/lib/types";

export function ReviewModeration({ reviews }: { reviews: Review[] }) {
  const router = useRouter();
  async function update(id: string, approved: boolean) {
    await fetch("/api/reviews", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, approved }) });
    router.refresh();
  }
  async function remove(id: string) {
    await fetch("/api/reviews", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    router.refresh();
  }
  if (!reviews.length) return <p className="text-stone">Aucun avis.</p>;
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <article key={review.id} className="bg-white p-4">
          <p className="text-wood">{"★".repeat(review.rating)}</p>
          <p className="mt-2">{review.comment}</p>
          <p className="mt-1 text-sm text-stone">{review.authorName} · {review.approved ? "Publié" : "En attente"}</p>
          <div className="mt-3 flex gap-3 text-sm">
            <button type="button" onClick={() => update(review.id, !review.approved)}>{review.approved ? "Masquer" : "Approuver"}</button>
            <button type="button" onClick={() => remove(review.id)}>Supprimer</button>
          </div>
        </article>
      ))}
    </div>
  );
}
