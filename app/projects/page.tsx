import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { readDb } from "@/lib/store";

export const metadata: Metadata = {
  title: "Réalisations",
  description: "Ambiances et réalisations : salle de bain, salon, sol effet bois et effet marbre. STE SANI-ESSEF, Ksour Essef.",
};

export default async function ProjectsPage() {
  const db = await readDb();
  const projects = db.projects.filter((project) => project.published);
  return (
    <div className="mx-auto max-w-page px-4 py-12 md:px-8 md:py-16">
      <p className="text-[11px] uppercase tracking-[0.28em] text-wood">Galerie</p>
      <h1 className="mt-3 font-serif text-5xl md:text-7xl">Réalisations</h1>
      <p className="mt-4 max-w-2xl text-stone">Des ambiances pour projeter un sol, un mur ou une salle de bain. Les produits cités sont ceux déjà identifiés au showroom.</p>
      <div className="mt-12 grid gap-10 md:grid-cols-2">
        {projects.map((project, index) => (
          <article key={project.id} className={index % 3 === 0 ? "md:col-span-2" : ""}>
            <div className={`img-zoom relative overflow-hidden bg-mist ${index % 3 === 0 ? "aspect-[16/8]" : "aspect-[4/5]"}`}>
              <Image src={project.image} alt={project.title} fill className="object-cover" />
            </div>
            <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-wood">{project.room}</p>
            <h2 className="mt-1 font-serif text-4xl">{project.title}</h2>
            <p className="mt-2 max-w-xl text-stone">{project.description}</p>
            <p className="mt-3 text-sm">
              Produits utilisés :{" "}
              {project.productIds.length
                ? project.productIds.map((id, itemIndex) => {
                    const product = db.products.find((item) => item.id === id);
                    if (!product) return null;
                    return (
                      <span key={id}>
                        {itemIndex > 0 ? ", " : ""}
                        <Link href={`/product/${product.slug}`} className="underline">
                          {product.name}
                        </Link>
                      </span>
                    );
                  })
                : "Sélection showroom — détails sur demande."}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
