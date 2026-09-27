import { ReviewModeration } from "@/components/admin/ReviewModeration";
import { readDb } from "@/lib/store";

export default async function ReviewsAdmin() {
  const db = await readDb();
  return (
    <div>
      <h1 className="mb-8 font-serif text-5xl">Avis</h1>
      <ReviewModeration reviews={db.reviews} />
    </div>
  );
}
