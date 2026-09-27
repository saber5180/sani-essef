import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { company } from "@/lib/company";
import type { Dictionary } from "@/lib/i18n";
import type { Settings } from "@/lib/types";

export function Footer({ t, settings }: { t: Dictionary; settings: Settings }) {
  return (
    <footer className="bg-[#1e1914] text-[#faf6ef]">
      <div className="mx-auto grid max-w-page gap-12 px-5 py-16 md:grid-cols-[1.2fr_0.8fr_0.8fr] md:px-8">
        <div>
          <Logo />
          <p className="mt-6 max-w-xs font-serif text-xl italic leading-snug text-[#e4c4b0]">{settings.slogan}</p>
          <p className="mt-4 text-sm leading-relaxed text-white/55">
            {settings.address}
            <br />
            {settings.days} · {settings.hours}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#e4c4b0]">Maison</p>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            <li><Link href="/">{t.nav.home}</Link></li>
            <li><Link href="/shop">{t.nav.shop}</Link></li>
            <li><Link href="/projects">{t.nav.projects}</Link></li>
            <li><Link href="/about">{t.nav.about}</Link></li>
            <li><Link href="/contact">{t.nav.contact}</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#e4c4b0]">Contact</p>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            <li><a href={`tel:${settings.phoneTel}`}>{settings.phone}</a></li>
            <li><a href={`https://wa.me/${settings.whatsapp}`}>{settings.gsm}</a></li>
            <li><a href={`https://wa.me/${settings.whatsapp}`}>WhatsApp</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-page flex-col gap-2 px-5 py-5 text-xs text-white/40 md:flex-row md:justify-between md:px-8">
          <p>© {company.name}</p>
          <p>{t.footerRights}</p>
        </div>
      </div>
    </footer>
  );
}
