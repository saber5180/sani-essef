import Image from "next/image";
import { ButtonLink } from "@/components/ui/Section";
import { Logo } from "@/components/brand/Logo";
import { company } from "@/lib/company";

export function LandingHero({
  title,
  subtitle,
  eyebrow,
  image,
  fromPrice,
  ctaHref,
  quoteHref,
  ctaLabel,
  quoteLabel,
}: {
  title: string;
  subtitle: string;
  eyebrow: string;
  image: string;
  fromPrice?: string;
  ctaHref: string;
  quoteHref: string;
  ctaLabel: string;
  quoteLabel: string;
}) {
  const label = eyebrow || "Showroom · Ksour Essef";

  return (
    <section className="atelier overflow-x-hidden">
      <div className="mx-auto max-w-page px-4 pb-8 pt-4 lg:px-8 lg:pb-12 lg:pt-6">
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-stretch">
          <div className="relative aspect-[4/3] overflow-hidden bg-[#d8cbb8] sm:aspect-[16/10] lg:aspect-auto lg:min-h-[560px]">
            <div className="hero-pan absolute inset-0">
              <Image src={image} alt="Matières STE SANI-ESSEF" fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
            <p className="absolute left-3 top-3 max-w-[70%] truncate border border-[#1e1914]/10 bg-[#faf6ef]/92 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[#1e1914] sm:left-4 sm:top-4">
              {label}
            </p>
            <p className="absolute bottom-3 right-3 border border-[#1e1914]/10 bg-[#faf6ef] px-2.5 py-1 font-serif text-sm italic text-[#1e1914] sm:bottom-4 sm:right-4">
              Échantillon matière
            </p>
          </div>

          <div className="flex min-w-0 flex-col justify-between border border-[#1e1914]/10 bg-[#faf6ef] px-5 py-5 sm:px-8 sm:py-7">
            <div className="logo-enter">
              <Logo priority />
            </div>

            <div className="copy-enter mt-5 min-w-0">
              <p className="font-serif text-lg italic leading-snug text-[#a34b2e] sm:text-[1.45rem]">{company.slogan}</p>
              <h1 className="mt-2 max-w-lg break-words font-serif text-[1.5rem] leading-[1.15] text-[#1e1914] sm:text-[2.1rem] lg:text-[2.35rem]">
                {title}
              </h1>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-[#5c534a] sm:text-[15px]">{subtitle}</p>
              {fromPrice ? (
                <p className="mt-4 text-sm text-[#5c534a]">
                  Pièces en salle à partir de <span className="font-medium text-[#1e1914]">{fromPrice}</span>
                </p>
              ) : null}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <ButtonLink href={ctaHref} className="w-full sm:w-auto">
                  {ctaLabel}
                </ButtonLink>
                <ButtonLink href={quoteHref} variant="light" className="w-full sm:w-auto">
                  {quoteLabel}
                </ButtonLink>
              </div>
            </div>

            <dl className="mt-7 grid grid-cols-1 gap-4 border-t border-[#1e1914]/10 pt-5 text-sm text-[#1e1914] sm:grid-cols-2">
              <div className="min-w-0">
                <dt className="text-[10px] uppercase tracking-[0.2em] text-[#a34b2e]">Showroom</dt>
                <dd className="mt-1.5 break-words leading-relaxed">{company.address}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.2em] text-[#a34b2e]">Horaires</dt>
                <dd className="mt-1.5 leading-relaxed">
                  {company.days}
                  <br />
                  {company.hours}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
