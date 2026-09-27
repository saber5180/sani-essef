"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import type { Product, Review } from "@/lib/types";
import { formatPrice, known, stockLabel, unitLabel } from "@/lib/format";
import { productWhatsappMessage, whatsappLink } from "@/lib/company";
import { useCart, useI18n, useWhatsappProduct } from "@/components/providers/Providers";

export function ProductPurchase({ product, reviews }: { product: Product; reviews: Review[] }) {
  const { t } = useI18n();
  const cart = useCart();
  const { setProductName } = useWhatsappProduct();
  useEffect(() => {
    setProductName(product.name);
    return () => setProductName(null);
  }, [product.name, setProductName]);
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [finish, setFinish] = useState(product.variants[0]?.finish || product.finish || "");
  const [quantity, setQuantity] = useState(1);
  const [surface, setSurface] = useState(35);
  const [loss, setLoss] = useState(product.lossPercent || 10);
  const [added, setAdded] = useState(false);
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewState, setReviewState] = useState("");
  const image = product.images[index] || product.images[0];
  const recommended = useMemo(() => Math.round(surface * (1 + loss / 100) * 10) / 10, [surface, loss]);

  function add(goCheckout = false) {
    cart.add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        reference: product.reference,
        image: product.images[0]?.url || "",
        price: product.price,
        unit: product.unit,
        finish: finish || null,
      },
      quantity,
    );
    setAdded(true);
    if (goCheckout) router.push("/checkout");
  }

  async function sendReview(event: FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id, authorName: author, rating, comment }),
    });
    setReviewState(response.ok ? "Merci. Votre avis sera publié après validation." : "Envoi impossible pour le moment.");
    if (response.ok) {
      setAuthor("");
      setComment("");
    }
  }

  const rows = [
    ["Référence", known(product.reference)],
    ["Prix", formatPrice(product)],
    ["Disponibilité", stockLabel(product.stockStatus)],
    ["Format", known(product.format)],
    ["Matière", known(product.material)],
    ["Finition", known(finish || product.finish)],
    ["Couleur", known(product.color)],
    ["Origine", known(product.originCountry)],
    ["Fabrication", known(product.madeIn)],
    ["Marque", known(product.brand)],
    ["Style", known(product.style)],
  ];

  return (
    <div className="mx-auto grid max-w-page gap-10 px-4 py-12 md:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:py-16">
      <div>
        <div className="img-zoom relative aspect-[4/3] overflow-hidden bg-[#ece6dc]">
          {image ? <Image src={image.url} alt={image.alt || product.name} fill priority className="object-cover" /> : null}
        </div>
        {product.images.length > 1 ? (
          <div className="mt-3 grid grid-cols-4 gap-3">
            {product.images.map((item, imageIndex) => (
              <button key={item.id} type="button" onClick={() => setIndex(imageIndex)} className={`relative aspect-square overflow-hidden bg-mist ${imageIndex === index ? "ring-1 ring-ink" : ""}`}>
                <Image src={item.url} alt={item.alt || product.name} fill className="object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-[0.22em] text-wood">{product.format || "Showroom"}</p>
        <h1 className="mt-2 font-serif text-4xl leading-tight">{product.name}</h1>
        <div className="mt-4 flex items-baseline gap-3 border-y border-[#1a1816]/10 py-4">
          <p className="text-2xl">{formatPrice(product)}</p>
          {product.oldPrice && product.price ? <p className="text-base text-stone line-through">{product.oldPrice} DT</p> : null}
        </div>
        <dl className="mt-8 divide-y divide-black/10 border-y border-black/10">
          {rows.map(([label, value]) => (
            <div key={label} className="grid grid-cols-[140px_1fr] gap-3 py-3 text-sm">
              <dt className="text-stone">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        {product.variants.length ? (
          <div className="mt-6">
            <p className="text-[11px] uppercase tracking-[0.16em] text-stone">Finition</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setFinish(variant.finish || variant.name)}
                  className={`rounded-md border px-3 py-2 text-sm ${finish === variant.finish ? "border-ink bg-ink text-white" : "border-black/15"}`}
                >
                  {variant.name}
                </button>
              ))}
            </div>
          </div>
        ) : null}
        <div className="mt-6 flex items-center gap-3">
          <button type="button" className="grid h-10 w-10 place-items-center rounded-md border border-black/15" onClick={() => setQuantity((value) => Math.max(0.5, Math.round((value - 0.5) * 10) / 10))} aria-label="Diminuer">
            <Minus size={16} />
          </button>
          <span className="min-w-16 text-center">{quantity} {unitLabel(product.unit)}</span>
          <button type="button" className="grid h-10 w-10 place-items-center rounded-md border border-black/15" onClick={() => setQuantity((value) => Math.round((value + 0.5) * 10) / 10)} aria-label="Augmenter">
            <Plus size={16} />
          </button>
        </div>
        {product.calculatorEnabled ? (
          <div className="mt-6 bg-mist p-5">
            <p className="font-serif text-2xl">Surface nécessaire</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <label className="text-sm">
                Surface (m²)
                <input type="number" min={0} value={surface} onChange={(event) => setSurface(Number(event.target.value))} className="mt-1 w-full border border-black/10 bg-white px-3 py-2" />
              </label>
              <label className="text-sm">
                Perte (%)
                <input type="number" min={0} value={loss} onChange={(event) => setLoss(Number(event.target.value))} className="mt-1 w-full border border-black/10 bg-white px-3 py-2" />
              </label>
            </div>
            <p className="mt-4 text-sm">
              {surface} m² + {loss}% de marge = <strong>{recommended} m²</strong>
            </p>
            <p className="mt-1 text-sm text-stone">Nous recommandons d&apos;ajouter {loss}% pour les découpes et pertes.</p>
            <button type="button" className="mt-4 text-[12px] uppercase tracking-[0.16em] underline" onClick={() => setQuantity(recommended)}>
              Utiliser {recommended} m²
            </button>
          </div>
        ) : null}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={() => add(false)} className="rounded-md bg-ink px-4 py-3 text-[12px] uppercase tracking-[0.16em] text-white">
            {t.addToCart}
          </button>
          <button type="button" onClick={() => add(true)} className="rounded-md border border-ink px-4 py-3 text-[12px] uppercase tracking-[0.16em]">
            {t.buyNow}
          </button>
          <a href={`/quote?produit=${encodeURIComponent(product.name)}`} className="rounded-md bg-sand px-4 py-3 text-center text-[12px] uppercase tracking-[0.16em]">
            {t.quote}
          </a>
          <a href={whatsappLink(productWhatsappMessage(product.name))} className="rounded-md border border-black/15 px-4 py-3 text-center text-[12px] uppercase tracking-[0.16em]">
            {t.whatsapp}
          </a>
        </div>
        {added ? <p className="mt-3 text-sm text-wood">Ajouté au panier.</p> : null}
      </div>
      <article className="lg:col-span-2">
        <h2 className="font-serif text-4xl">{t.description}</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-ink/80">{product.description}</p>
        <p className="mt-3 max-w-3xl text-sm text-stone">{product.extraInfo}</p>
        <h2 className="mt-12 font-serif text-4xl">{t.specs}</h2>
        {product.technical.length ? (
          <dl className="mt-4 max-w-3xl divide-y divide-black/10">
            {product.technical.map((spec) => (
              <div key={spec.label} className="grid grid-cols-[200px_1fr] py-3 text-sm">
                <dt className="text-stone">{spec.label}</dt>
                <dd>{spec.value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="mt-4 text-stone">Information disponible sur demande.</p>
        )}
        <h2 className="mt-12 font-serif text-4xl">{t.extra}</h2>
        <p className="mt-4 max-w-3xl text-ink/80">{product.usage || "Information disponible sur demande."}</p>
      </article>
      <section className="lg:col-span-2">
        <h2 className="font-serif text-4xl">Avis</h2>
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            {reviews.length ? (
              reviews.map((review) => (
                <article key={review.id} className="border border-black/10 p-4">
                  <p className="text-wood">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p>
                  <p className="mt-2">{review.comment}</p>
                  <p className="mt-2 text-sm text-stone">
                    {review.authorName} · {new Date(review.createdAt).toLocaleDateString("fr-TN")}
                  </p>
                </article>
              ))
            ) : (
              <p className="text-stone">Soyez le premier à donner votre avis.</p>
            )}
          </div>
          <form onSubmit={sendReview} className="space-y-3 bg-mist p-5">
            <input required value={author} onChange={(event) => setAuthor(event.target.value)} placeholder="Nom" className="w-full border border-black/10 bg-white px-3 py-2" />
            <select value={rating} onChange={(event) => setRating(Number(event.target.value))} className="w-full border border-black/10 bg-white px-3 py-2">
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {"★".repeat(value)}
                </option>
              ))}
            </select>
            <textarea required value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Commentaire" className="h-28 w-full border border-black/10 bg-white px-3 py-2" />
            <button className="rounded-md bg-ink px-4 py-3 text-[12px] uppercase tracking-[0.16em] text-white">Publier un avis</button>
            {reviewState ? <p className="text-sm">{reviewState}</p> : null}
          </form>
        </div>
      </section>
    </div>
  );
}
