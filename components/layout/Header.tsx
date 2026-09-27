"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { useCart, useI18n } from "@/components/providers/Providers";
import { company } from "@/lib/company";

type Hit = {
  products: { slug: string; name: string; format: string | null; image: string | null }[];
  categories: { slug: string; name: string }[];
};

const links = [
  { href: "/", key: "home" },
  { href: "/shop", key: "shop" },
  { href: "/shop/category/carrelage", key: "tile" },
  { href: "/shop/category/salle-de-bain", key: "bath" },
  { href: "/shop/category/sanitaires", key: "sanitary" },
  { href: "/shop/category/robinetterie", key: "tap" },
  { href: "/shop/category/meubles", key: "furniture" },
  { href: "/shop/category/revetements-muraux", key: "covering" },
  { href: "/promotions", key: "promos" },
  { href: "/projects", key: "projects" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

export function Header() {
  const { t, locale, setLocale } = useI18n();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<Hit | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!searchOpen) return;
    const value = query.trim();
    if (value.length < 1) {
      setHits(null);
      return;
    }
    const handle = setTimeout(async () => {
      const response = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
      setHits((await response.json()) as Hit);
    }, 120);
    return () => clearTimeout(handle);
  }, [query, searchOpen]);

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;
    setSearchOpen(false);
    router.push(`/shop?q=${encodeURIComponent(value)}`);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[#1e1914]/10 bg-[#faf6ef]/95 backdrop-blur">
      <div className="mx-auto flex max-w-page items-center gap-3 px-4 py-2.5 md:px-8">
        <Link href="/" aria-label="STE SANI-ESSEF" className="min-w-0 max-w-[68%] shrink">
          <Logo compact priority />
        </Link>
        <p className="hidden max-w-[14rem] truncate font-serif text-sm italic text-[#a34b2e] xl:block">{company.slogan}</p>
        <nav className="hidden flex-1 items-center justify-center gap-4 2xl:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap text-[13px] transition hover:text-[#a34b2e] ${pathname === link.href ? "text-[#a34b2e]" : "text-[#1e1914]/75"}`}
            >
              {t.nav[link.key]}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center">
          <span className="mr-1 hidden gap-2 text-[11px] tracking-[0.14em] lg:flex">
            {(["fr", "en", "ar"] as const).map((item) => (
              <button key={item} type="button" onClick={() => setLocale(item)} className={locale === item ? "text-[#a34b2e]" : "text-[#1e1914]/40"}>
                {item.toUpperCase()}
              </button>
            ))}
          </span>
          <button type="button" aria-label="Recherche" className="p-2.5 hover:text-[#a34b2e]" onClick={() => setSearchOpen(true)}>
            <Search size={20} />
          </button>
          <Link href="/cart" aria-label="Panier" className="relative p-2.5 hover:text-[#a34b2e]">
            <ShoppingBag size={20} />
            {count > 0 ? (
              <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center bg-[#a34b2e] px-1 text-[10px] text-white">
                {Math.round(count)}
              </span>
            ) : null}
          </Link>
          <button type="button" aria-label="Menu" className="p-2.5 2xl:hidden" onClick={() => setOpen(true)}>
            <Menu size={22} />
          </button>
        </div>
      </div>

      {searchOpen ? (
        <div className="absolute inset-x-0 top-full border-b border-black/5 bg-white shadow-soft">
          <form onSubmit={submitSearch} className="mx-auto max-w-page px-4 py-5 md:px-8">
            <div className="flex items-center gap-3 border-b border-ink pb-3">
              <Search size={18} />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t.search}
                className="w-full bg-transparent text-lg placeholder:text-stone/70"
              />
              <button type="button" aria-label="Fermer" onClick={() => setSearchOpen(false)}>
                <X size={18} />
              </button>
            </div>
            {hits ? (
              <div className="grid gap-6 py-5 md:grid-cols-2">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-wood">Produits</p>
                  <ul className="mt-3 space-y-2">
                    {hits.products.map((product) => (
                      <li key={product.slug}>
                        <Link href={`/product/${product.slug}`} className="flex items-baseline justify-between gap-4 py-1 hover:text-wood">
                          <span>{product.name}</span>
                          <span className="text-sm text-stone">{product.format}</span>
                        </Link>
                      </li>
                    ))}
                    {hits.products.length === 0 ? <li className="text-stone">Aucun produit pour cette recherche.</li> : null}
                  </ul>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-wood">Catégories</p>
                  <ul className="mt-3 space-y-2">
                    {hits.categories.map((category) => (
                      <li key={category.slug}>
                        <Link href={`/shop/category/${category.slug}`} className="block py-1 hover:text-wood">
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
          </form>
        </div>
      ) : null}

      {open ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#f3ebe0] text-[#1e1914]">
          <div className="flex items-center justify-between px-4 py-3">
            <Logo compact />
            <button type="button" aria-label="Fermer" onClick={() => setOpen(false)} className="p-2">
              <X />
            </button>
          </div>
          <nav className="flex flex-col px-5 pt-4">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="border-b border-[#1e1914]/10 py-3.5 font-serif text-3xl tracking-[-0.03em]">
                {t.nav[link.key]}
              </Link>
            ))}
            <Link href="/account" className="border-b border-[#1e1914]/10 py-3.5 font-serif text-3xl tracking-[-0.03em]">
              {t.account}
            </Link>
          </nav>
          <div className="flex gap-4 px-5 py-6 text-sm">
            {(["fr", "en", "ar"] as const).map((item) => (
              <button key={item} type="button" onClick={() => setLocale(item)} className={locale === item ? "text-[#a34b2e]" : "text-[#1e1914]/40"}>
                {item.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
