import type { Metadata } from "next";
import { Fraunces, Figtree } from "next/font/google";
import { Providers } from "@/components/providers/Providers";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { getDictionary } from "@/lib/locale";
import { readDb } from "@/lib/store";
import { company } from "@/lib/company";
import "./globals.css";

const serif = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
});

const sans = Figtree({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "STE SANI-ESSEF | Carrelage, revêtements et salle de bain à Ksour Essef",
    template: "%s | STE SANI-ESSEF",
  },
  description:
    "Showroom STE SANI-ESSEF à Ksour Essef : carrelage, revêtements, sanitaires, robinetterie et équipements pour la maison. Route de Mahdia.",
  keywords: [
    "carrelage Tunisie",
    "carrelage salle de bain Tunisie",
    "carrelage 120x60 Tunisie",
    "carrelage effet bois Tunisie",
    "sanitaire Tunisie",
    "équipement salle de bain Tunisie",
    "Ksour Essef",
    "Mahdia",
    "STE SANI-ESSEF",
    "ANI ESSEF",
  ],
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "STE SANI-ESSEF",
    description: "Ça donne envie de rénover. Carrelage et rénovation à Ksour Essef.",
    locale: "fr_TN",
    type: "website",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { locale, t } = await getDictionary();
  const db = await readDb();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: company.name,
    slogan: company.slogan,
    telephone: company.phoneTel,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Route de Mahdia",
      addressLocality: "Ksour Essef",
      addressCountry: "TN",
    },
    openingHours: "Mo-Su 08:00-18:30",
  };

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body className={`${serif.variable} ${sans.variable} font-sans antialiased`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Providers locale={locale}>
          <SiteChrome t={t} settings={db.settings}>
            {children}
          </SiteChrome>
        </Providers>
      </body>
    </html>
  );
}
