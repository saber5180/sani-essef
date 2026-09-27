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
    solid: "bg-[#1e1914] text-[#faf6ef] hover:bg-[#a34b2e]",
    ghost: "border border-[#faf6ef] text-[#faf6ef] hover:bg-[#faf6ef] hover:text-[#1e1914]",
    light: "border border-[#1e1914] text-[#1e1914] hover:bg-[#1e1914] hover:text-[#faf6ef]",
    sand: "bg-[#a34b2e] text-white hover:bg-[#1e1914]",
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
    <div className="mb-8 flex items-end justify-between gap-4 border-b border-[#1e1914]/10 pb-4">
      <div>
        <p className="text-[11px] uppercase tracking-[0.22em] text-[#a34b2e]">{kicker}</p>
        <h2 className="mt-1 font-serif text-[1.8rem] leading-none tracking-[-0.03em] text-[#1e1914] md:text-[2.5rem]">{title}</h2>
      </div>
      {href && action ? (
        <Link href={href} className="text-[13px] text-[#a34b2e] underline-offset-4 hover:underline">
          {action}
        </Link>
      ) : null}
    </div>
  );
}
