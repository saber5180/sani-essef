import { LandingHero } from "@/components/home/LandingHero";
import { Reveal } from "@/components/home/Reveal";
import { ButtonLink, SectionHeading } from "@/components/ui/Section";
import { ProductCard } from "@/components/product/ProductCard";
import { getDictionary } from "@/lib/locale";
import { publishedProducts } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { readDb } from "@/lib/store";
import { company, whatsappLink, generalWhatsappMessage } from "@/lib/company";
import Image from "next/image";
import Link from "next/link";

export default async function HomePage() {
  const { t } = await getDictionary();
  const db = await readDb();
  const products = publishedProducts(db);
  const banner = db.banners.find((item) => item.active) || db.banners[0];
  const promos = products.filter((product) => product.promotion);
  const projects = db.projects.filter((project) => project.published).slice(0, 3);
  const fromPrice = products.filter((product) => product.price != null).sort((a, b) => (a.price || 0) - (b.price || 0))[0];

  return (
    <>
      <LandingHero
        title={banner?.title || ""}
        subtitle={banner?.subtitle || ""}
        eyebrow={banner?.eyebrow || ""}
        image={banner?.image || "/images/hero.jpg"}
        fromPrice={fromPrice ? formatPrice(fromPrice) : undefined}
        ctaHref={banner?.ctaHref || "/shop"}
        quoteHref={banner?.secondaryHref || "/quote"}
        ctaLabel={t.heroCta}
        quoteLabel={t.heroQuote}
      />

      <Reveal>
        <section className="px-0 py-10 md:mx-auto md:max-w-page md:px-8 md:py-14">
          <div className="mb-6 px-5 md:mb-8 md:px-0">
            <SectionHeading kicker={t.categories} title="Univers" href="/shop" action={t.seeProducts} />
          </div>
          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 md:grid md:grid-cols-5 md:gap-px md:overflow-visible md:bg-[#1a1816]/10 md:px-0">
            {db.categories.slice(0, 5).map((category) => (
              <Link
                key={category.id}
                href={`/shop/category/${category.slug}`}
                className="img-zoom relative w-[72vw] shrink-0 snap-start overflow-hidden bg-[#ece6dc] sm:w-[46vw] md:w-auto md:aspect-[4/5]"
              >
                <span className="relative block aspect-[4/5]">
                  <Image src={category.image} alt={category.name} fill sizes="40vw" className="object-cover" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-t from-[#1a1816]/75 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-4 font-serif text-xl text-white md:text-2xl">{category.name}</span>
              </Link>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="mx-auto max-w-page px-5 pb-12 md:px-8 md:pb-14">
          <SectionHeading kicker="Catalogue" title="Pièces en showroom" href="/shop" action={t.seeProducts} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </Reveal>

      {promos[0] ? (
        <Reveal>
          <section className="bg-[#1a1816] text-white">
            <div className="mx-auto grid max-w-page md:grid-cols-2">
              <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[360px]">
                <Image src={promos[0].images[0]?.url || "/images/hero.jpg"} alt={promos[0].name} fill className="object-cover" />
              </div>
              <div className="flex flex-col justify-center px-5 py-10 md:px-12">
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#d8c4a8]">Offre</p>
                <h2 className="mt-2 font-serif text-3xl md:text-4xl">{promos[0].name}</h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">{promos[0].shortDescription}</p>
                <p className="mt-6 text-2xl">{formatPrice(promos[0])}</p>
                {promos[0].oldPrice ? <p className="mt-1 text-sm text-white/45 line-through">{promos[0].oldPrice} DT</p> : null}
                <div className="mt-6">
                  <ButtonLink href={`/product/${promos[0].slug}`} variant="sand" className="w-full sm:w-auto">
                    Voir le produit
                  </ButtonLink>
                </div>
              </div>
            </div>
          </section>
        </Reveal>
      ) : null}

      <Reveal>
        <section className="mx-auto max-w-page px-5 py-12 md:px-8 md:py-14">
          <SectionHeading kicker={t.inspire} title={t.inspireTitle} href="/projects" action="Galerie" />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-px md:bg-[#1a1816]/10">
            {projects.map((project) => (
              <Link key={project.id} href="/projects" className="img-zoom relative aspect-[16/10] bg-[#ece6dc] md:aspect-[4/3]">
                <Image src={project.image} alt={project.title} fill className="object-cover" />
                <span className="absolute inset-0 bg-gradient-to-t from-[#1a1816]/70 to-transparent" />
                <span className="absolute bottom-4 left-4 font-serif text-2xl text-white">{project.title}</span>
              </Link>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="border-y border-[#1a1816]/10 bg-white">
          <div className="mx-auto grid max-w-page sm:grid-cols-2 md:grid-cols-4">
            {[
              [t.quality, t.qualityText],
              [t.advice, t.adviceText],
              [t.design, t.designText],
              [t.near, t.nearText],
            ].map(([title, text]) => (
              <article key={title} className="border-b border-[#1a1816]/10 px-5 py-8 last:border-b-0 sm:border-b md:border-b-0 md:border-r md:last:border-r-0">
                <h3 className="font-serif text-2xl">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#6d645c]">{text}</p>
              </article>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="grid md:grid-cols-2">
          <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[380px]">
            <Image src="/images/showroom.jpg" alt="Showroom STE SANI-ESSEF" fill className="object-cover" />
          </div>
          <div className="flex flex-col justify-center bg-[#ece6dc] px-5 py-10 md:px-12">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#8A6A4A]">Showroom</p>
            <h2 className="mt-2 font-serif text-3xl leading-tight md:text-4xl">{t.showroomTitle}</h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[#5c544d]">
              {company.address}
              <br />
              {company.days} · {company.hours}
            </p>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:flex sm:flex-wrap">
              <ButtonLink href="/contact" className="w-full sm:w-auto">
                Nous rendre visite
              </ButtonLink>
              <a href={`tel:${company.phoneTel}`} className="inline-flex h-10 items-center justify-center border border-[#1a1816] px-4 text-[13px]">
                {company.phone}
              </a>
              <a href={whatsappLink(generalWhatsappMessage())} className="inline-flex h-10 items-center justify-center border border-[#1a1816] px-4 text-[13px]">
                WhatsApp
              </a>
            </div>
          </div>
        </section>
      </Reveal>
    </>
  );
}
