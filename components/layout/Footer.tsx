import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { company } from "@/lib/company";
import type { Dictionary } from "@/lib/i18n";
import type { Settings } from "@/lib/types";

export function Footer({ t, settings }: { t: Dictionary; settings: Settings }) {
  return (
    <footer className="bg-[#1a1816] text-white">
      <div className="mx-auto grid max-w-page gap-12 px-4 py-16 md:grid-cols-4 md:px-8">
        <div>
          <Logo light />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/70">{settings.slogan}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-sand">Navigation</p>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li><Link href="/">{t.nav.home}</Link></li>
            <li><Link href="/shop">{t.nav.shop}</Link></li>
            <li><Link href="/projects">{t.nav.projects}</Link></li>
            <li><Link href="/about">{t.nav.about}</Link></li>
            <li><Link href="/contact">{t.nav.contact}</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-sand">Boutique</p>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li><Link href="/shop/category/carrelage">{t.nav.tile}</Link></li>
            <li><Link href="/shop/category/salle-de-bain">{t.nav.bath}</Link></li>
            <li><Link href="/shop/category/sanitaires">{t.nav.sanitary}</Link></li>
            <li><Link href="/shop/category/robinetterie">{t.nav.tap}</Link></li>
            <li><Link href="/promotions">{t.nav.promos}</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-sand">Contact</p>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li><a href={`tel:${settings.phoneTel}`}>{settings.phone}</a></li>
            <li><a href={`https://wa.me/${settings.whatsapp}`}>{settings.gsm}</a></li>
            <li>{settings.address}</li>
            <li>
              {settings.hours}
              <br />
              {settings.days}
            </li>
          </ul>
          <div className="mt-5 flex gap-4 text-sm">
            {settings.facebook ? <a href={settings.facebook}>Facebook</a> : <span className="text-white/40">Facebook</span>}
            {settings.instagram ? <a href={settings.instagram}>Instagram</a> : <span className="text-white/40">Instagram</span>}
            <a href={`https://wa.me/${settings.whatsapp}`}>WhatsApp</a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-page flex-col gap-2 px-4 py-5 text-xs text-white/50 md:flex-row md:justify-between md:px-8">
          <p>© {company.name}</p>
          <p>{t.footerRights}</p>
        </div>
      </div>
    </footer>
  );
}
