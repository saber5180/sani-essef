"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Section";
import { Logo } from "@/components/brand/Logo";
import { company } from "@/lib/company";

export type HeroSlide = {
  image: string;
  title: string;
  subtitle: string;
  eyebrow: string;
  price?: string;
  href: string;
};

export function LandingHero({
  slides,
  quoteHref,
  ctaLabel,
  quoteLabel,
}: {
  slides: HeroSlide[];
  quoteHref: string;
  ctaLabel: string;
  quoteLabel: string;
}) {
  const [index, setIndex] = useState(0);
  const slide = slides[index] || slides[0];

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => {
        let next = Math.floor(Math.random() * slides.length);
        if (next === current) next = (current + 1) % slides.length;
        return next;
      });
    }, 6500);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (!slide) return null;

  return (
    <section className="atelier overflow-x-hidden">
      <div className="mx-auto max-w-page px-4 pb-8 pt-4 lg:px-8 lg:pb-12 lg:pt-6">
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-stretch">
          <div className="relative aspect-[4/3] overflow-hidden bg-[#e8dccb] sm:aspect-[5/4] lg:aspect-auto lg:min-h-[520px]">
            {slides.map((item, slideIndex) => (
              <div key={item.href} className={`hero-slide ${slideIndex === index ? "is-active" : ""}`}>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  priority={slideIndex === 0}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-contain p-5 sm:p-8"
                />
              </div>
            ))}
            <p
              key={`${slide.href}-tag`}
              className="hero-copy-line absolute left-3 top-3 z-[3] max-w-[70%] truncate border border-[#1e1914]/10 bg-[#faf6ef]/92 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[#1e1914] sm:left-4 sm:top-4"
            >
              {slide.eyebrow}
            </p>
            <p
              key={`${slide.href}-count`}
              className="hero-copy-line absolute bottom-5 right-3 z-[3] border border-[#1e1914]/10 bg-[#faf6ef] px-2.5 py-1 font-serif text-sm italic text-[#1e1914] sm:bottom-6 sm:right-4"
            >
              {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </p>
            <span key={slide.href} className="hero-progress absolute inset-x-0 bottom-0 z-[4] h-[3px] bg-[#a34b2e]" />
          </div>

          <div className="flex min-w-0 flex-col justify-between border border-[#1e1914]/10 bg-[#faf6ef] px-5 py-5 sm:px-8 sm:py-7">
            <div>
              <Logo priority />
            </div>

            <div key={slide.href} className="mt-5 min-w-0">
              <p className="hero-copy-line font-serif text-lg italic leading-snug text-[#a34b2e] sm:text-[1.45rem]">{company.slogan}</p>
              <h1 className="hero-copy-line mt-2 max-w-lg break-words font-serif text-[1.5rem] leading-[1.15] text-[#1e1914] sm:text-[2.1rem] lg:text-[2.35rem]">
                {slide.title}
              </h1>
              <p className="hero-copy-line mt-3 max-w-md text-sm leading-relaxed text-[#5c534a] sm:text-[15px]">{slide.subtitle}</p>
              {slide.price ? <p className="hero-copy-line mt-4 text-sm text-[#1e1914]">{slide.price}</p> : null}
              <div className="hero-copy-line mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <ButtonLink href={slide.href} className="w-full sm:w-auto">
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
