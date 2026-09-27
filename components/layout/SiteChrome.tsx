"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";
import type { Dictionary } from "@/lib/i18n";
import type { Settings } from "@/lib/types";

export function SiteChrome({
  t,
  settings,
  children,
}: {
  t: Dictionary;
  settings: Settings;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const admin = pathname.startsWith("/admin");
  if (admin) return <>{children}</>;
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer t={t} settings={settings} />
      <FloatingActions />
    </>
  );
}
