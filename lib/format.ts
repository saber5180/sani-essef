import type { Product, Unit } from "./types";

export const ON_REQUEST = "Disponible sur demande";

export function known(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return ON_REQUEST;
  const text = String(value).trim();
  return text.length ? text : ON_REQUEST;
}

export function unitLabel(unit: Unit | string | null | undefined): string {
  if (unit === "m2") return "m²";
  if (unit === "piece") return "pièce";
  if (unit === "carton") return "carton";
  if (unit === "request") return "sur demande";
  return "";
}

export function formatPrice(product: Pick<Product, "price" | "currency" | "unit">): string {
  if (product.price === null || product.price === undefined) return "Prix sur demande";
  const unit = unitLabel(product.unit);
  const amount = new Intl.NumberFormat("fr-TN", {
    minimumFractionDigits: Number.isInteger(product.price) ? 0 : 3,
    maximumFractionDigits: 3,
  }).format(product.price);
  return unit ? `${amount} DT / ${unit}` : `${amount} DT`;
}

export function money(value: number | null | undefined): string {
  if (value === null || value === undefined) return "Sur devis";
  return `${new Intl.NumberFormat("fr-TN", { maximumFractionDigits: 3 }).format(value)} DT`;
}

export function discountPercent(price: number | null, oldPrice: number | null): number | null {
  if (!price || !oldPrice || oldPrice <= price) return null;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

export function stockLabel(status: Product["stockStatus"]): string {
  if (status === "available") return "En stock";
  if (status === "limited") return "Stock limité";
  if (status === "out") return "Rupture";
  return ON_REQUEST;
}

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/×/g, "x")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function normalizeSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/×/g, "x")
    .replace(/[\/]/g, "x")
    .replace(/\s+/g, " ")
    .trim();
}

export function compactSize(value: string): string {
  return normalizeSearch(value).replace(/[^a-z0-9]/g, "");
}

export const GOVERNORATES = [
  "Ariana",
  "Béja",
  "Ben Arous",
  "Bizerte",
  "Gabès",
  "Gafsa",
  "Jendouba",
  "Kairouan",
  "Kasserine",
  "Kébili",
  "Le Kef",
  "Mahdia",
  "La Manouba",
  "Médenine",
  "Monastir",
  "Nabeul",
  "Sfax",
  "Sidi Bouzid",
  "Siliana",
  "Sousse",
  "Tataouine",
  "Tozeur",
  "Tunis",
  "Zaghouan",
];
