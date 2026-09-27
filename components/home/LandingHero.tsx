"use client";

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
  return (
    <section className="relative isolate h-[100svh] min-h-[620px] overflow-hidden bg-[#1a1816] text-white">
      <Image src={image} alt="Showroom STE SANI-ESSEF" fill priority className="hero-zoom object-cover opacity-65" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1816] via-[#1a1816]/40 to-[#1a1816]/25" />
      <div className="relative mx-auto flex h-full max-w-page flex-col justify-end px-5 pb-10 pt-6 sm:px-8 sm:pb-16">
        <div className="hero-rise mb-8 flex justify-center sm:mb-10 sm:justify-start">
          <Logo light markOnly />
        </div>
        <p className="hero-rise hero-d1 text-[11px] uppercase tracking-[0.32em] text-[#d8c4a8]">{company.slogan}</p>
        <h1 className="hero-rise hero-d2 mt-3 max-w-2xl font-serif text-[2.35rem] leading-[1.05] sm:text-5xl md:text-6xl">{title}</h1>
        <p className="hero-rise hero-d3 mt-4 max-w-md text-sm leading-relaxed text-white/80 sm:text-[15px]">{subtitle}</p>
        {fromPrice ? <p className="hero-rise hero-d4 mt-4 text-sm text-[#d8c4a8] sm:text-[15px]">À partir de {fromPrice}</p> : null}
        <div className="hero-rise hero-d5 mt-6 grid w-full grid-cols-1 gap-3 sm:flex sm:w-auto">
          <ButtonLink href={ctaHref} variant="sand" className="w-full sm:w-auto">
            {ctaLabel}
          </ButtonLink>
          <ButtonLink href={quoteHref} variant="ghost" className="w-full sm:w-auto">
            {quoteLabel}
          </ButtonLink>
        </div>
        <p className="hero-rise hero-d6 mt-8 hidden text-[11px] uppercase tracking-[0.22em] text-white/50 sm:block">{eyebrow}</p>
      </div>
      <span className="hero-scroll absolute bottom-4 left-1/2 hidden h-10 w-px -translate-x-1/2 bg-white/40 sm:block" />
    </section>
  );
}
