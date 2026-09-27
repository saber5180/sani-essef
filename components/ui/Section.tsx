import Link from "next/link";

export function ButtonLink({
  href,
  children,
  variant = "solid",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "ghost" | "light" | "sand";
  className?: string;
}) {
  const styles = {
    solid: "bg-[#1a1816] text-white hover:bg-[#8A6A4A]",
    ghost: "border border-white text-white hover:bg-white hover:text-[#1a1816]",
    light: "border border-[#1a1816] text-[#1a1816] hover:bg-[#1a1816] hover:text-white",
    sand: "bg-[#8A6A4A] text-white hover:bg-[#1a1816]",
  }[variant];

  return (
    <Link href={href} className={`inline-flex h-11 items-center justify-center px-5 text-[13px] tracking-wide transition ${styles} ${className}`}>
      {children}
    </Link>
  );
}

export function SectionHeading({
  kicker,
  title,
  href,
  action,
}: {
  kicker: string;
  title: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4 border-b border-[#1a1816]/10 pb-4">
      <div>
        <p className="text-[11px] uppercase tracking-[0.22em] text-[#8A6A4A]">{kicker}</p>
        <h2 className="mt-1 font-serif text-[1.7rem] leading-none text-[#1a1816] md:text-[2.35rem]">{title}</h2>
      </div>
      {href && action ? (
        <Link href={href} className="text-[13px] text-[#8A6A4A] hover:underline">
          {action}
        </Link>
      ) : null}
    </div>
  );
}
