import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { discountPercent, formatPrice } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0];
  const discount = discountPercent(product.price, product.oldPrice);
  return (
    <article className="group">
      <Link href={`/product/${product.slug}`} className="img-zoom relative block aspect-[4/3] overflow-hidden bg-[#e8dccb]">
        {image ? (
          <Image src={image.url} alt={image.alt || product.name} fill sizes="(min-width: 1024px) 33vw, 50vw" className="object-cover" />
        ) : null}
        {discount ? (
          <span className="absolute left-3 top-3 bg-[#a34b2e] px-2 py-1 text-[11px] text-white">−{discount}%</span>
        ) : null}
        {product.format ? (
          <span className="absolute bottom-3 right-3 border border-[#1e1914]/10 bg-[#faf6ef] px-2 py-1 text-[11px] tracking-wide">
            {product.format}
          </span>
        ) : null}
      </Link>
      <div className="pt-4">
        <p className="text-[11px] uppercase tracking-[0.16em] text-[#a34b2e]">{product.style || product.originCountry || "Showroom"}</p>
        <h3 className="mt-1 font-serif text-[1.55rem] leading-tight tracking-[-0.02em]">
          <Link href={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <div className="mt-2 flex items-baseline gap-3">
          <p className="text-[15px]">{formatPrice(product)}</p>
          {product.oldPrice && product.price ? <p className="text-sm text-[#7a726b] line-through">{product.oldPrice} DT</p> : null}
        </div>
      </div>
    </article>
  );
}
