"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { company, generalWhatsappMessage, productWhatsappMessage, whatsappLink } from "@/lib/company";
import { useCart, useWhatsappProduct } from "@/components/providers/Providers";
import Link from "next/link";

export function FloatingActions() {
  const pathname = usePathname();
  const { count } = useCart();
  const { productName: currentProduct } = useWhatsappProduct();
  if (pathname.startsWith("/admin")) return null;
  const message = pathname.startsWith("/product/") && currentProduct ? productWhatsappMessage(currentProduct) : generalWhatsappMessage();

  return (
    <>
      {count > 0 ? (
        <Link
          href="/cart"
          className="fixed inset-x-4 bottom-4 z-40 flex items-center justify-between rounded-md bg-ink px-4 py-3 text-sm text-white shadow-soft md:hidden"
        >
          <span>Panier</span>
          <span>{Math.round(count * 10) / 10}</span>
        </Link>
      ) : null}
      <a
        href={whatsappLink(message)}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        className={`fixed right-3 z-50 grid h-12 w-12 place-items-center rounded-full bg-[#1f6b45] text-white shadow-soft transition hover:scale-105 sm:right-4 sm:h-14 sm:w-14 ${count > 0 ? "bottom-20 md:bottom-5" : "bottom-4 sm:bottom-5"}`}
      >
        <MessageCircle size={24} />
      </a>
      <span className="sr-only">{company.gsm}</span>
    </>
  );
}
