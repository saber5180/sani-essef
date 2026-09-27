"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale, Dictionary } from "@/lib/i18n";
import { dictionaries } from "@/lib/i18n";

export type CartLine = {
  key: string;
  productId: string;
  slug: string;
  name: string;
  reference: string | null;
  image: string;
  price: number | null;
  unit: string | null;
  quantity: number;
  finish: string | null;
};

type CartContextValue = {
  lines: CartLine[];
  add: (line: Omit<CartLine, "key" | "quantity">, quantity?: number) => void;
  setQty: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  count: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const WhatsappContext = createContext<{ productName: string | null; setProductName: (name: string | null) => void } | null>(null);
const LocaleContext = createContext<{
  locale: Locale;
  t: Dictionary;
  setLocale: (locale: Locale) => void;
} | null>(null);

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("Cart missing");
  return value;
}

export function useI18n() {
  const value = useContext(LocaleContext);
  if (!value) throw new Error("Locale missing");
  return value;
}

export function useWhatsappProduct() {
  const value = useContext(WhatsappContext);
  if (!value) throw new Error("WhatsApp missing");
  return value;
}

export function Providers({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const router = useRouter();
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [productName, setProductName] = useState<string | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem("sani-cart");
    if (saved) {
      try {
        setLines(JSON.parse(saved) as CartLine[]);
      } catch {
        setLines([]);
      }
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem("sani-cart", JSON.stringify(lines));
  }, [lines, ready]);

  const cart = useMemo<CartContextValue>(
    () => ({
      lines,
      count: lines.reduce((sum, line) => sum + line.quantity, 0),
      add: (line, quantity = 1) => {
        setLines((current) => {
          const key = `${line.productId}:${line.finish || ""}`;
          const existing = current.find((item) => item.key === key);
          if (existing) {
            return current.map((item) => (item.key === key ? { ...item, quantity: item.quantity + quantity } : item));
          }
          return [...current, { ...line, key, quantity }];
        });
      },
      setQty: (key, quantity) => {
        setLines((current) =>
          current
            .map((item) => (item.key === key ? { ...item, quantity } : item))
            .filter((item) => item.quantity > 0),
        );
      },
      remove: (key) => setLines((current) => current.filter((item) => item.key !== key)),
      clear: () => setLines([]),
    }),
    [lines],
  );

  const i18n = useMemo(
    () => ({
      locale,
      t: dictionaries[locale],
      setLocale: (next: Locale) => {
        document.cookie = `sani_locale=${next};path=/;max-age=31536000`;
        router.refresh();
      },
    }),
    [locale, router],
  );

  return (
    <LocaleContext.Provider value={i18n}>
      <WhatsappContext.Provider value={{ productName, setProductName }}>
        <CartContext.Provider value={cart}>{children}</CartContext.Provider>
      </WhatsappContext.Provider>
    </LocaleContext.Provider>
  );
}
