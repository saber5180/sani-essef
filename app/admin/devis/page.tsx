import { StatusSelect } from "@/components/admin/StatusSelect";
import { readDb } from "@/lib/store";

export default async function QuotesAdmin() {
  const db = await readDb();
  return (
    <div>
      <h1 className="font-serif text-5xl">Demandes de devis</h1>
      <div className="mt-8 space-y-4">
        {db.quotes.length === 0 ? <p className="text-stone">Aucune demande.</p> : null}
        {db.quotes.map((quote) => (
          <article key={quote.id} className="bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-serif text-2xl">{quote.name}</p>
                <p className="text-sm text-stone">
                  {quote.phone} {quote.email ? `· ${quote.email}` : ""}
                </p>
              </div>
              <StatusSelect id={quote.id} status={quote.status} endpoint={`/api/quotes/${quote.id}`} options={["new", "in_progress", "done"]} />
            </div>
            <p className="mt-3 text-sm">
              {quote.productName || "Produit non précisé"} · Qté {quote.quantity || "—"} · Surface {quote.surface || "—"}
            </p>
            {quote.message ? <p className="mt-2 text-sm text-stone">{quote.message}</p> : null}
            {quote.imageUrl ? (
              <a href={quote.imageUrl} className="mt-2 inline-block text-sm underline">
                Image jointe
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
