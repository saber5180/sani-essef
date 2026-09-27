import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24">
      <p className="text-[11px] uppercase tracking-[0.22em] text-wood">404</p>
      <h1 className="mt-3 font-serif text-5xl">Cette page n&apos;est pas au showroom.</h1>
      <Link href="/" className="mt-6 inline-block text-sm underline">
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
