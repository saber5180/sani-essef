import Link from "next/link";
import { readDb } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import { PublishButton } from "@/components/admin/PublishButton";

export default async function ProductsAdmin() {
  const db = await readDb();
  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <h1 className="font-serif text-5xl">Produits</h1>
        <Link href="/admin/produits/nouveau" className="rounded-md bg-ink px-4 py-3 text-[12px] uppercase tracking-[0.14em] text-white">
          Ajouter
        </Link>
      </div>
      <div className="mt-8 overflow-x-auto bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-black/10 text-[11px] uppercase tracking-[0.14em] text-stone">
            <tr>
              <th className="px-4 py-3">Produit</th>
              <th className="px-4 py-3">Référence</th>
              <th className="px-4 py-3">Prix</th>
              <th className="px-4 py-3">État</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {db.products.map((product) => (
              <tr key={product.id} className="border-b border-black/5">
                <td className="px-4 py-3">
                  <Link href={`/admin/produits/${product.id}`} className="font-medium">
                    {product.name}
                  </Link>
                  <p className="text-stone">{product.format}</p>
                </td>
                <td className="px-4 py-3">{product.reference || "—"}</td>
                <td className="px-4 py-3">{formatPrice(product)}</td>
                <td className="px-4 py-3">{product.published ? "Publié" : "Masqué"}</td>
                <td className="px-4 py-3 text-right">
                  <PublishButton id={product.id} published={product.published} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
