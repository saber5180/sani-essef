import { PromotionEditor } from "@/components/admin/PromotionEditor";
import { readDb } from "@/lib/store";

export default async function PromotionsAdmin() {
  const db = await readDb();
  return (
    <div>
      <h1 className="font-serif text-5xl">Promotions</h1>
      <p className="mt-2 mb-8 max-w-2xl text-sm text-stone">N&apos;indiquez un prix que s&apos;il a été confirmé. Les champs vides restent « prix sur demande ».</p>
      <PromotionEditor products={db.products} />
    </div>
  );
}
