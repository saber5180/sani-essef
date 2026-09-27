"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";

const links = [
  ["/admin", "Tableau de bord"],
  ["/admin/produits", "Produits"],
  ["/admin/categories", "Catégories"],
  ["/admin/commandes", "Commandes"],
  ["/admin/clients", "Clients"],
  ["/admin/devis", "Devis"],
  ["/admin/promotions", "Promotions"],
  ["/admin/images", "Images"],
  ["/admin/bannieres", "Bannières"],
  ["/admin/realisations", "Réalisations"],
  ["/admin/avis", "Avis"],
  ["/admin/messages", "Messages"],
  ["/admin/parametres", "Paramètres"],
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-mist md:grid md:grid-cols-[250px_1fr]">
      <aside className="flex flex-col bg-ink px-5 py-6 text-white">
        <Link href="/" aria-label="Retour au site">
          <Logo light compact />
        </Link>
        <p className="mt-8 text-[11px] uppercase tracking-[0.22em] text-sand">Administration</p>
        <nav className="mt-4 flex flex-1 flex-col gap-1">
          {links.map(([href, label]) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} className={`rounded-md px-3 py-2 text-sm ${active ? "bg-white text-ink" : "text-white/75 hover:bg-white/10"}`}>
                {label}
              </Link>
            );
          })}
        </nav>
        <form action="/api/auth/logout" method="post">
          <button className="text-sm text-white/60">Se déconnecter</button>
        </form>
      </aside>
      <div className="px-4 py-8 md:px-10">{children}</div>
    </div>
  );
}
