"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { createPortal } from "react-dom";
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

const menuGroups = [
  { label: "Visiter", items: links.slice(0, 2) },
  { label: "Collections", items: links.slice(2, 8) },
  { label: "Maison", items: links.slice(8) },
] as const;

export function Header() {
  const { t, locale, setLocale } = useI18n();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<Hit | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

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

      {mounted && open
        ? createPortal(
            <div className="fixed inset-0 z-[100]">
              <button type="button" aria-label="Fermer" className="absolute inset-0 bg-[#1e1914]/35" onClick={() => setOpen(false)} />
              <aside className="absolute inset-y-0 right-0 flex w-[min(100%,22rem)] flex-col bg-[#faf6ef] text-[#1e1914] shadow-[-18px_0_40px_rgba(30,25,20,0.12)]">
                <div className="flex items-center justify-between border-b border-[#1e1914]/10 px-5 py-3.5 pt-[max(0.85rem,env(safe-area-inset-top))]">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-[#a34b2e]">Menu</p>
                  <button type="button" aria-label="Fermer" onClick={() => setOpen(false)} className="p-1.5 text-[#1e1914]/70">
                    <X size={18} />
                  </button>
                </div>
                <nav className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">
                  {menuGroups.map((group) => (
                    <div key={group.label} className="mb-6">
                      <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-[#a34b2e]">{group.label}</p>
                      <ul className="border-t border-[#1e1914]/10">
                        {group.items.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              className={`block border-b border-[#1e1914]/10 py-2.5 text-[15px] ${pathname === link.href ? "text-[#a34b2e]" : "text-[#1e1914]"}`}
                            >
                              {t.nav[link.key]}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <Link href="/account" className="block border-b border-[#1e1914]/10 py-2.5 text-[15px]">
                    {t.account}
                  </Link>
                </nav>
                <div className="border-t border-[#1e1914]/10 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                  <p className="text-[12px] leading-relaxed text-[#5c534a]">{company.address}</p>
                  <p className="mt-1 text-[12px] text-[#5c534a]">
                    {company.days} · {company.hours}
                  </p>
                  <a href={`tel:${company.phoneTel}`} className="mt-2 block text-[13px] text-[#1e1914]">
                    {company.phone}
                  </a>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex gap-3 text-[11px] tracking-[0.16em]">
                      {(["fr", "en", "ar"] as const).map((item) => (
                        <button key={item} type="button" onClick={() => setLocale(item)} className={locale === item ? "text-[#a34b2e]" : "text-[#1e1914]/35"}>
                          {item.toUpperCase()}
                        </button>
                      ))}
                    </div>
                    <Link href="/quote" className="text-[12px] text-[#a34b2e] underline-offset-4 hover:underline">
                      {t.quote}
                    </Link>
                  </div>
                </div>
              </aside>
            </div>,
            document.body,
          )
        : null}
    </header>
  );
}
