import { readDb } from "@/lib/store";

export default async function ClientsAdmin() {
  const db = await readDb();
  const clients = [
    ...db.users.filter((user) => user.role === "customer").map((user) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      phone: user.phone,
      email: user.email,
    })),
    ...db.customers.map((customer) => ({
      id: customer.id,
      name: `${customer.firstName} ${customer.lastName}`,
      phone: customer.phone,
      email: customer.email,
    })),
  ];
  return (
    <div>
      <h1 className="font-serif text-5xl">Clients</h1>
      <div className="mt-8 overflow-x-auto bg-white">
        <table className="w-full text-left text-sm">
          <thead className="text-[11px] uppercase tracking-[0.14em] text-stone">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Téléphone</th>
              <th className="px-4 py-3">Email</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-t border-black/5">
                <td className="px-4 py-3">{client.name}</td>
                <td className="px-4 py-3">{client.phone}</td>
                <td className="px-4 py-3">{client.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {clients.length === 0 ? <p className="p-5 text-stone">Aucun client enregistré.</p> : null}
      </div>
    </div>
  );
}
