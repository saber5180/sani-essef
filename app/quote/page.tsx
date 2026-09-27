import type { Metadata } from "next";
import { Suspense } from "react";
import { QuoteForm } from "@/components/quote/QuoteForm";

export const metadata: Metadata = {
  title: "Demander un devis",
  description: "Demandez un devis pour votre carrelage, revêtement ou équipement de salle de bain à Ksour Essef.",
};

export default function QuotePage() {
  return (
    <Suspense>
      <QuoteForm />
    </Suspense>
  );
}
