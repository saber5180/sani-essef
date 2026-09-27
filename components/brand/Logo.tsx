import Image from "next/image";

const src = "/images/Gemini_Generated_Image_er06i9er06i9er06-removebg-preview.png";

export function Logo({
  light = false,
  compact = false,
  markOnly = false,
}: {
  light?: boolean;
  compact?: boolean;
  markOnly?: boolean;
}) {
  const size = markOnly ? (compact ? "h-20 w-20" : "h-28 w-28") : compact ? "h-14 w-14 sm:h-16 sm:w-16" : "h-20 w-20";
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className={`relative shrink-0 ${size}`}>
        <Image
          src={src}
          alt="ANI ESSEF"
          fill
          priority
          sizes="112px"
          className={`object-contain ${light ? "brightness-0 invert" : ""}`}
        />
      </span>
      {markOnly ? null : (
        <span className={`leading-none ${light ? "text-white" : "text-[#1a1816]"}`}>
          <span className="block text-[10px] font-medium uppercase tracking-[0.28em] opacity-70 sm:text-[11px]">STE</span>
          <span className="mt-0.5 block font-serif text-lg tracking-[0.08em] sm:text-xl">SANI-ESSEF</span>
        </span>
      )}
    </span>
  );
}
