import Link from "next/link";
import { readDb } from "@/lib/store";
import { money } from "@/lib/format";

export default async function AdminHome() {
  const db = await readDb();
  const revenue = db.orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const viewed = [...db.products].sort((a, b) => b.views - a.views).slice(0, 5);
  const ordered = [...db.products].sort((a, b) => b.ordersCount - a.ordersCount).slice(0, 5);
  const cards = [
    ["Produits", String(db.products.length)],
    ["Commandes", String(db.orders.length)],
    ["Chiffre d'affaires", money(revenue)],
    ["Demandes de devis", String(db.quotes.length)],
  ];

  return (
    <div>
      <h1 className="font-serif text-5xl">Tableau de bord</h1>
      <p className="mt-2 text-stone">STE SANI-ESSEF · showroom et catalogue</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value]) => (
          <article key={label} className="bg-white p-5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-stone">{label}</p>
            <p className="mt-3 font-serif text-4xl">{value}</p>
          </article>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <List title="Les plus consultés" rows={viewed.map((product) => [product.name, `${product.views} vues`, `/admin/produits/${product.id}`])} />
        <List title="Les plus commandés" rows={ordered.map((product) => [product.name, `${product.ordersCount} commande(s)`, `/admin/produits/${product.id}`])} />
      </div>
      <Link href="/admin/produits/nouveau" className="mt-8 inline-block rounded-md bg-ink px-4 py-3 text-[12px] uppercase tracking-[0.16em] text-white">
        Ajouter un produit
      </Link>
    </div>
  );
}

function List({ title, rows }: { title: string; rows: string[][] }) {
  return (
    <section className="bg-white p-5">
      <h2 className="font-serif text-3xl">{title}</h2>
      <ul className="mt-4 divide-y divide-black/5">
        {rows.map(([name, meta, href]) => (
          <li key={name} className="flex items-center justify-between py-3 text-sm">
            <Link href={href}>{name}</Link>
            <span className="text-stone">{meta}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
