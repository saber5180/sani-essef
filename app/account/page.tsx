import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { readDb } from "@/lib/store";
import { money } from "@/lib/format";

export const metadata: Metadata = { title: "Compte" };

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/account");
  const db = await readDb();
  const orders = db.orders.filter((order) => order.userId === session.id || db.customers.find((customer) => customer.id === order.customerId)?.email === session.email);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <p className="text-[11px] uppercase tracking-[0.22em] text-wood">{session.email}</p>
      <h1 className="mt-3 font-serif text-5xl">Bonjour {session.firstName}</h1>
      <form action="/api/auth/logout" method="post" className="mt-4">
        <button className="text-sm text-stone underline">Se déconnecter</button>
      </form>
      {session.role === "admin" ? (
        <Link href="/admin" className="mt-6 inline-block rounded-md bg-ink px-4 py-3 text-[12px] uppercase tracking-[0.16em] text-white">
          Ouvrir l&apos;administration
        </Link>
      ) : null}
      <h2 className="mt-12 font-serif text-3xl">Commandes</h2>
      <div className="mt-4 space-y-4">
        {orders.length ? (
          orders.map((order) => (
            <article key={order.id} className="border border-black/10 p-4">
              <p className="text-sm text-stone">{new Date(order.createdAt).toLocaleDateString("fr-TN")} · {order.status}</p>
              <ul className="mt-2 text-sm">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.name} × {item.quantity}
                  </li>
                ))}
              </ul>
              <p className="mt-2">{money(order.total)}</p>
            </article>
          ))
        ) : (
          <p className="text-stone">Aucune commande pour le moment.</p>
        )}
      </div>
    </div>
  );
}
