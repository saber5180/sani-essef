import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { readDb, updateDb } from "@/lib/store";
import { denied, requireAdmin } from "@/lib/guard";

type CartLine = {
  productId: string;
  name: string;
  reference: string | null;
  image: string;
  price: number | null;
  unit: string | null;
  quantity: number;
};

export async function GET() {
  if (!(await requireAdmin())) return denied();
  const db = await readDb();
  return NextResponse.json(db.orders);
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    governorate?: string;
    comment?: string;
    mode?: "delivery" | "pickup" | "quote";
    contactWhatsapp?: boolean;
    items?: CartLine[];
  };
  if (!body.firstName || !body.lastName || !body.phone || !body.items?.length) {
    return NextResponse.json({ error: "Informations incomplètes." }, { status: 400 });
  }
  const session = await getSession();
  const order = await updateDb((db) => {
    const customer = {
      id: crypto.randomUUID(),
      userId: session?.id || null,
      firstName: body.firstName || "",
      lastName: body.lastName || "",
      phone: body.phone || "",
      email: body.email || "",
      address: body.address || "",
      city: body.city || "",
      governorate: body.governorate || "",
      createdAt: new Date().toISOString(),
    };
    db.customers.unshift(customer);
    const items = body.items!.map((line) => {
      const product = db.products.find((item) => item.id === line.productId);
      if (product) product.ordersCount += 1;
      const unitPrice = line.price;
      return {
        id: crypto.randomUUID(),
        productId: line.productId,
        name: line.name,
        reference: line.reference,
        unit: line.unit,
        quantity: line.quantity,
        unitPrice,
        lineTotal: unitPrice == null ? null : unitPrice * line.quantity,
        image: line.image,
      };
    });
    const priced = items.every((item) => item.lineTotal != null);
    const created = {
      id: crypto.randomUUID().slice(0, 8).toUpperCase(),
      customerId: customer.id,
      userId: session?.id || null,
      mode: body.mode || "delivery",
      contactWhatsapp: Boolean(body.contactWhatsapp),
      comment: body.comment || "",
      status: "new" as const,
      total: priced ? items.reduce((sum, item) => sum + (item.lineTotal || 0), 0) : null,
      currency: "TND" as const,
      items,
      createdAt: new Date().toISOString(),
    };
    db.orders.unshift(created);
    return created;
  });
  return NextResponse.json({ id: order.id });
}
