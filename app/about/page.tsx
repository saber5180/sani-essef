import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "À propos",
  description: "STE SANI-ESSEF, partenaire rénovation à Ksour Essef : carrelage, revêtements et équipements pour la maison.",
};

const blocks = [
  ["Qui sommes-nous ?", "STE SANI-ESSEF est une entreprise locale, installée route de Mahdia à Ksour Essef. Le showroom présente carrelages, revêtements et équipements pour accompagner une rénovation du premier croquis jusqu'au choix des matières."],
  ["Nos produits", "Carrelage sol et mural, effets marbre, bois et pierre, sanitaires, robinetterie, meubles et accessoires. Chaque fiche reste fidèle aux informations confirmées : le reste est indiqué comme disponible sur demande."],
  ["Notre showroom", "Ouvert 7 jours sur 7, de 08:00 à 18:30. Les grands formats et les finitions se comparent mieux en lumière réelle, sur les présentoirs du magasin."],
  ["Notre engagement", "Sélectionner des collections contemporaines, expliquer les formats et les poses, puis rester joignable par téléphone ou WhatsApp pendant le chantier."],
  ["Qualité", "Des produits choisis pour tenir dans le temps, avec une lecture claire de l'origine lorsque elle est connue."],
  ["Conseil", "L'équipe aide à rapprocher un format, une couleur et une finition du projet réel : salle de bain, sol, terrasse ou pièce de vie."],
  ["Accompagnement", "Devis, disponibilité et quantités se confirment avec vous. Le calculateur de surface propose une marge pour les découpes, à ajuster selon la pose."],
];

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-page px-4 py-16 md:px-8 md:py-20">
        <p className="text-[11px] uppercase tracking-[0.28em] text-wood">STE SANI-ESSEF</p>
        <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-none md:text-7xl">Votre partenaire pour vos projets de rénovation</h1>
      </section>
      <section className="relative min-h-[520px]">
        <Image src="/images/showroom.jpg" alt="Showroom STE SANI-ESSEF à Ksour Essef" fill className="object-cover" />
      </section>
      <section className="mx-auto grid max-w-page gap-12 px-4 py-16 md:grid-cols-2 md:px-8 md:py-24">
        {blocks.map(([title, text]) => (
          <article key={title}>
            <h2 className="font-serif text-3xl">{title}</h2>
            <p className="mt-3 leading-relaxed text-stone">{text}</p>
          </article>
        ))}
      </section>
      <section className="bg-sand">
        <div className="mx-auto flex max-w-page flex-col items-start justify-between gap-6 px-4 py-14 md:flex-row md:items-center md:px-8">
          <h2 className="font-serif text-4xl">Ça donne envie de rénover</h2>
          <ButtonLink href="/contact">Venir au showroom</ButtonLink>
        </div>
      </section>
    </>
  );
}
