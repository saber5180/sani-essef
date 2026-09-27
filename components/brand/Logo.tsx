import Image from "next/image";

const src = "/images/Gemini_Generated_Image_er06i9er06i9er06-removebg-preview.png";

export function Logo({
  compact = false,
  markOnly = false,
  stacked = false,
  priority = false,
}: {
  light?: boolean;
  compact?: boolean;
  markOnly?: boolean;
  stacked?: boolean;
  priority?: boolean;
}) {
  const mark = stacked
    ? "h-[6.5rem] w-[6.5rem]"
    : compact
      ? "h-11 w-11 sm:h-12 sm:w-12"
      : "h-14 w-14 sm:h-[3.75rem] sm:w-[3.75rem]";

  const plate = (
    <span className="relative shrink-0 border border-[#1e1914]/12 bg-[#faf6ef] p-1.5 shadow-[inset_0_0_0_1px_rgba(30,25,20,0.05)]">
      <span className={`relative block ${mark}`}>
        <Image src={src} alt="ANI ESSEF" fill priority={priority} sizes="176px" className="object-contain p-[7%]" />
      </span>
    </span>
  );

  const word = (
    <span className="leading-none text-[#1e1914]">
      <span className={`block font-medium uppercase text-[#a34b2e] ${stacked ? "text-[11px] tracking-[0.38em]" : "text-[9px] tracking-[0.32em] sm:text-[10px]"}`}>
        STE
      </span>
      <span className={`mt-1 block font-serif tracking-[-0.03em] ${stacked ? "text-[2.1rem] lg:text-4xl" : compact ? "text-[1.2rem] sm:text-[1.35rem]" : "text-[1.45rem]"}`}>
        Sani-Essef
      </span>
    </span>
  );

  if (markOnly) return plate;

  if (stacked) {
    return (
      <span className="flex flex-col items-start gap-5">
        {plate}
        {word}
      </span>
    );
  }

  return (
    <span className="inline-flex min-w-0 items-center gap-2.5 sm:gap-3">
      {plate}
      <span className="min-w-0">{word}</span>
    </span>
  );
}
