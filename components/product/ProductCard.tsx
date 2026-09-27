import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { discountPercent, formatPrice } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0];
  const discount = discountPercent(product.price, product.oldPrice);
  return (
    <article className="group">
      <Link href={`/product/${product.slug}`} className="img-zoom relative block aspect-[5/4] bg-[#ece6dc]">
        {image ? (
          <Image src={image.url} alt={image.alt || product.name} fill sizes="(min-width: 1024px) 33vw, 50vw" className="object-cover" />
        ) : null}
        {discount ? <span className="absolute left-0 top-0 bg-[#8A6A4A] px-2 py-1 text-[11px] text-white">−{discount}%</span> : null}
      </Link>
      <div className="border-x border-b border-[#1a1816]/10 bg-white px-3 py-3 sm:px-4 sm:py-4">
        <p className="text-[11px] uppercase tracking-[0.16em] text-[#8A6A4A]">{product.format || product.style}</p>
        <h3 className="mt-1 font-serif text-xl leading-tight sm:text-2xl">
          <Link href={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <div className="mt-3 flex items-baseline justify-between gap-3">
          <p className="text-[15px] font-medium">{formatPrice(product)}</p>
          {product.oldPrice && product.price ? <p className="text-sm text-[#7a726b] line-through">{product.oldPrice} DT</p> : null}
        </div>
      </div>
    </article>
  );
}
