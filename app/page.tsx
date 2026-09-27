import { LandingHero } from "@/components/home/LandingHero";
import { Reveal } from "@/components/home/Reveal";
import { ButtonLink } from "@/components/ui/Section";
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
  const projects = db.projects.filter((project) => project.published).slice(0, 4);
  const fromPrice = products.filter((product) => product.price != null).sort((a, b) => (a.price || 0) - (b.price || 0))[0];
  const rooms = db.categories;
  const highlightIds = ["tekalu-crema", "miroir-135099", "cabine-91700", "lavabo-bidet-stand", "black-portoro", "sidi-bousaid"];
  const highlights = highlightIds.map((id) => products.find((product) => product.id === id)).filter((product): product is NonNullable<typeof product> => Boolean(product));

  return (
    <>
      <LandingHero
        title={banner?.title || ""}
        subtitle={banner?.subtitle || ""}
        eyebrow={banner?.eyebrow || ""}
        image={banner?.image || products[0]?.images[0]?.url || "/images/hero.jpg"}
        fromPrice={fromPrice ? formatPrice(fromPrice) : undefined}
        ctaHref={banner?.ctaHref || "/shop"}
        quoteHref={banner?.secondaryHref || "/quote"}
        ctaLabel={t.heroCta}
        quoteLabel={t.heroQuote}
      />

      <Reveal>
        <section className="mx-auto max-w-page overflow-hidden px-5 py-12 md:px-8 md:py-20">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#a34b2e]">{t.categories}</p>
              <h2 className="mt-2 break-words font-serif text-[1.85rem] tracking-[-0.03em] sm:text-4xl md:text-5xl">Les matières du showroom</h2>
            </div>
            <Link href="/shop" className="shrink-0 text-sm text-[#a34b2e] underline-offset-4 hover:underline">
              {t.seeProducts}
            </Link>
          </div>
          <ul className="mt-8 divide-y divide-[#1e1914]/10 border-y border-[#1e1914]/10 md:mt-10">
            {rooms.map((category, index) => (
              <li key={category.id}>
                <Link
                  href={`/shop/category/${category.slug}`}
                  className="group grid grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-3 py-5 sm:grid-cols-[4rem_minmax(0,1fr)_auto] sm:gap-8"
                >
                  <span className="font-serif text-xl text-[#a34b2e] sm:text-2xl">0{index + 1}</span>
                  <span className="min-w-0">
                    <span className="block break-words font-serif text-[1.35rem] leading-tight tracking-[-0.02em] transition group-hover:text-[#a34b2e] sm:text-3xl">
                      {category.name}
                    </span>
                    <span className="mt-2 block max-w-xl text-sm leading-relaxed text-[#5c534a]">{category.description}</span>
                  </span>
                  <span className="relative hidden h-[4.5rem] w-28 overflow-hidden bg-[#e8dccb] sm:block">
                    <Image src={category.image} alt="" fill sizes="112px" className="object-cover transition duration-700 group-hover:scale-105" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      <Reveal>
        <section className="atelier border-y border-[#1e1914]/10">
          <div className="mx-auto max-w-page px-5 py-12 md:px-8 md:py-20">
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#a34b2e]">Catalogue</p>
                <h2 className="mt-2 font-serif text-[1.85rem] tracking-[-0.03em] sm:text-4xl md:text-5xl">Pièces en salle</h2>
              </div>
              <Link href="/shop" className="shrink-0 text-sm text-[#a34b2e] underline-offset-4 hover:underline">
                {t.seeProducts}
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {highlights.length ? (
        <Reveal>
          <section className="mx-auto max-w-page px-5 py-12 md:px-8 md:py-20">
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#a34b2e]">Sélection</p>
                <h2 className="mt-2 font-serif text-[1.85rem] tracking-[-0.03em] sm:text-4xl md:text-5xl">Carrelage, miroirs, cabines</h2>
              </div>
              <Link href="/shop" className="shrink-0 text-sm text-[#a34b2e] underline-offset-4 hover:underline">
                {t.seeProducts}
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {highlights.map((product) => (
                <Link key={product.id} href={`/product/${product.slug}`} className="group grid overflow-hidden border border-[#1e1914]/10 bg-[#faf6ef] sm:grid-cols-2">
                  <span className="relative block aspect-[4/3] bg-[#e8dccb] sm:aspect-auto sm:min-h-[220px]">
                    {product.images[0] ? (
                      <Image src={product.images[0].url} alt={product.name} fill className="object-cover transition duration-700 group-hover:scale-[1.03]" />
                    ) : null}
                    {product.promotion ? (
                      <span className="absolute left-3 top-3 bg-[#a34b2e] px-2 py-1 text-[11px] uppercase tracking-[0.14em] text-white">Offre</span>
                    ) : null}
                  </span>
                  <span className="flex flex-col justify-center px-5 py-5">
                    <span className="text-[11px] uppercase tracking-[0.16em] text-[#a34b2e]">{product.format || product.style}</span>
                    <span className="mt-2 font-serif text-2xl leading-tight tracking-[-0.02em]">{product.name}</span>
                    <span className="mt-3 text-sm text-[#5c534a]">{formatPrice(product)}</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </Reveal>
      ) : null}

      <Reveal>
        <section className="mx-auto max-w-page px-5 pb-12 md:px-8 md:pb-20">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#a34b2e]">{t.inspire}</p>
              <h2 className="mt-2 font-serif text-[1.85rem] tracking-[-0.03em] sm:text-4xl md:text-5xl">{t.inspireTitle}</h2>
            </div>
            <Link href="/projects" className="shrink-0 text-sm text-[#a34b2e] underline-offset-4 hover:underline">
              Galerie
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
            {projects.map((project, index) => (
              <Link
                key={project.id}
                href="/projects"
                className={`img-zoom group relative overflow-hidden bg-[#e8dccb] ${index === 0 ? "md:col-span-2 aspect-[16/8]" : "aspect-[16/10]"}`}
              >
                <Image src={project.image} alt={project.title} fill className="object-cover" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1e1914]/70 to-transparent p-5">
                  <span className="block text-[11px] uppercase tracking-[0.18em] text-white/70">{project.room}</span>
                  <span className="mt-1 block font-serif text-2xl text-white sm:text-3xl">{project.title}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="border-y border-[#1e1914]/10 bg-[#faf6ef]">
          <div className="mx-auto grid max-w-page sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", t.quality, t.qualityText],
              ["02", t.advice, t.adviceText],
              ["03", t.design, t.designText],
              ["04", t.near, t.nearText],
            ].map(([num, title, text]) => (
              <article key={title} className="border-b border-[#1e1914]/10 px-5 py-8 last:border-b-0 sm:border-r sm:odd:border-r lg:border-b-0 lg:px-8 lg:last:border-r-0">
                <p className="font-serif text-xl text-[#a34b2e]">{num}</p>
                <h3 className="mt-3 font-serif text-2xl tracking-[-0.02em]">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#5c534a]">{text}</p>
              </article>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="atelier">
          <div className="mx-auto grid max-w-page gap-6 px-5 py-12 lg:grid-cols-2 lg:px-8 lg:py-20">
            <div className="flex flex-col justify-between border border-[#1e1914]/10 bg-[#faf6ef] px-5 py-8 sm:px-10">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#a34b2e]">Carte de visite</p>
                <h2 className="mt-3 font-serif text-[1.85rem] leading-tight tracking-[-0.03em] sm:text-4xl md:text-5xl">{t.showroomTitle}</h2>
                <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#5c534a]">
                  {company.address}
                  <br />
                  {company.days} · {company.hours}
                </p>
              </div>
              <div className="mt-8 grid grid-cols-1 gap-3 sm:flex sm:flex-wrap">
                <ButtonLink href="/contact" className="w-full sm:w-auto">
                  Nous rendre visite
                </ButtonLink>
                <a
                  href={`tel:${company.phoneTel}`}
                  className="inline-flex h-11 items-center justify-center border border-[#1e1914] px-5 text-[13px]"
                >
                  {company.phone}
                </a>
                <a
                  href={whatsappLink(generalWhatsappMessage())}
                  className="inline-flex h-11 items-center justify-center border border-[#1e1914] px-5 text-[13px]"
                >
                  WhatsApp
                </a>
              </div>
            </div>
            <div className="relative min-h-[320px] overflow-hidden bg-[#e8dccb] md:min-h-[460px]">
              <Image src="/images/showroom.jpg" alt="Showroom STE SANI-ESSEF" fill className="object-cover" />
            </div>
          </div>
        </section>
      </Reveal>
    </>
  );
}
