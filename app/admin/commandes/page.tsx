import { readDb } from "@/lib/store";
import { money } from "@/lib/format";
import { StatusSelect } from "@/components/admin/StatusSelect";

const labels: Record<string, string> = { delivery: "Livraison", pickup: "Retrait", quote: "Devis" };

export default async function OrdersAdmin() {
  const db = await readDb();
  return (
    <div>
      <h1 className="font-serif text-5xl">Commandes</h1>
      <div className="mt-8 space-y-4">
        {db.orders.length === 0 ? <p className="text-stone">Aucune commande pour le moment.</p> : null}
        {db.orders.map((order) => {
          const customer = db.customers.find((item) => item.id === order.customerId);
          return (
            <article key={order.id} className="bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-serif text-2xl">{order.id}</p>
                  <p className="text-sm text-stone">
                    {customer?.firstName} {customer?.lastName} · {customer?.phone} · {labels[order.mode]}
                    {order.contactWhatsapp ? " · WhatsApp" : ""}
                  </p>
                </div>
                <StatusSelect id={order.id} status={order.status} endpoint={`/api/orders/${order.id}`} options={["new", "confirmed", "done", "cancelled"]} />
              </div>
              <ul className="mt-3 text-sm">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.name} × {item.quantity} {item.reference ? `· ${item.reference}` : ""}
                  </li>
                ))}
              </ul>
              <p className="mt-2">{money(order.total)}</p>
              {order.comment ? <p className="mt-2 text-sm text-stone">{order.comment}</p> : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
