"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-store";
import { COMPARE_LIMIT, useCompare } from "@/lib/compare-store";
import { useWishlist } from "@/lib/wishlist-store";
import { useAdmin } from "@/lib/admin-store";
import { categoryToSlug } from "@/lib/dummy-images";

const ATTRIBUTE_ROWS = [
  "Gold Karat",
  "Gold Colour",
  "Gold Weight",
  "Diamond Colour",
  "Diamond Clarity",
  "Lab Certificate",
];

export default function ComparePage() {
  const { slugs, removeFromCompare, clearCompare } = useCompare();
  const { products } = useAdmin();
  const { items: bagItems, addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const picks = slugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => !!p);

  if (picks.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <h1 className="font-heading italic text-3xl text-brand mb-6">Compare</h1>
        <div className="text-center py-20">
          <p className="text-ink/60 mb-2">You haven&apos;t added anything to compare yet.</p>
          <p className="text-sm text-ink/40 mb-6">
            Tap the compare icon on any product photo — up to {COMPARE_LIMIT} pieces at a time.
          </p>
          <Link
            href="/jewellery"
            className="rounded-full bg-brand px-6 py-3 text-sm font-medium text-gold-light hover:bg-brand-secondary transition-colors"
          >
            Browse jewellery
          </Link>
        </div>
      </div>
    );
  }

  const cell = "px-4 py-3 text-sm align-top";
  const rowLabel = "px-4 py-3 text-xs uppercase tracking-[0.14em] text-ink/45 whitespace-nowrap";

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="flex items-baseline justify-between gap-4 mb-6">
        <h1 className="font-heading italic text-3xl text-brand">
          Compare <span className="text-base not-italic text-ink/40">({picks.length}/{COMPARE_LIMIT})</span>
        </h1>
        <button onClick={clearCompare} className="text-sm text-ink/50 hover:text-gold transition-colors">
          Clear all
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-beige bg-white">
        <table className="w-full min-w-[640px] border-collapse">
          <tbody className="divide-y divide-beige">
            {/* Photo + name */}
            <tr>
              <th className={rowLabel + " text-left w-40"} scope="row">
                Piece
              </th>
              {picks.map((p) => {
                const href = `/jewellery/${categoryToSlug(p.category)}/${p.slug}`;
                return (
                  <td key={p.slug} className={cell + " w-1/4"}>
                    <div className="relative">
                      <button
                        onClick={() => removeFromCompare(p.slug)}
                        aria-label={`Remove ${p.name} from compare`}
                        className="absolute -top-1 -right-1 z-10 grid h-7 w-7 place-items-center rounded-full border border-beige bg-white text-ink/50 hover:border-gold hover:text-gold transition-colors"
                      >
                        ×
                      </button>
                      <Link href={href} className="block">
                        <div className="relative aspect-square overflow-hidden rounded-xl bg-beige mb-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
                        </div>
                        <p className="text-xs text-ink/70 line-clamp-2 hover:text-gold transition-colors">{p.name}</p>
                      </Link>
                    </div>
                  </td>
                );
              })}
            </tr>

            <tr>
              <th className={rowLabel + " text-left"} scope="row">Price</th>
              {picks.map((p) => (
                <td key={p.slug} className={cell}>
                  <span className="font-semibold text-brand">{p.price}</span>
                  {p.originalPrice && (
                    <span className="ml-2 text-xs text-ink/40 line-through">{p.originalPrice}</span>
                  )}
                </td>
              ))}
            </tr>

            <tr>
              <th className={rowLabel + " text-left"} scope="row">Category</th>
              {picks.map((p) => (
                <td key={p.slug} className={cell}>{p.category}</td>
              ))}
            </tr>

            {ATTRIBUTE_ROWS.map((key) => {
              const values = picks.map((p) => p.attributes?.[key]);
              if (values.every((v) => !v)) return null;
              const allSame = values.every((v) => v === values[0]);
              return (
                <tr key={key}>
                  <th className={rowLabel + " text-left"} scope="row">{key}</th>
                  {picks.map((p, i) => (
                    <td key={p.slug} className={cell}>
                      <span className={allSame ? "text-ink/70" : "text-ink font-medium"}>
                        {values[i] || "—"}
                      </span>
                    </td>
                  ))}
                </tr>
              );
            })}

            <tr>
              <th className={rowLabel + " text-left"} scope="row">Rating</th>
              {picks.map((p) => (
                <td key={p.slug} className={cell}>
                  <span className="text-gold">{"★".repeat(Math.round(p.rating))}</span>
                  <span className="text-ink/40 text-xs ml-1">({p.reviewCount})</span>
                </td>
              ))}
            </tr>

            <tr>
              <th className={rowLabel + " text-left"} scope="row">Availability</th>
              {picks.map((p) => (
                <td key={p.slug} className={cell}>
                  {p.stock > 0 ? (
                    <span className="text-green-700">In stock</span>
                  ) : (
                    <span className="text-red-600">Out of stock</span>
                  )}
                </td>
              ))}
            </tr>

            <tr>
              <th className={rowLabel + " text-left"} scope="row">Details</th>
              {picks.map((p) => (
                <td key={p.slug} className={cell + " text-xs text-ink/60 leading-relaxed"}>
                  {p.description}
                </td>
              ))}
            </tr>

            <tr>
              <th className={rowLabel + " text-left"} scope="row">Buy</th>
              {picks.map((p) => {
                const inBag = bagItems.some((i) => i.slug === p.slug);
                const wishlisted = isWishlisted(p.slug);
                return (
                  <td key={p.slug} className={cell}>
                    <div className="flex items-center gap-2">
                      {inBag ? (
                        <Link
                          href="/cart"
                          className="flex-1 rounded-full bg-brand text-center text-xs font-medium text-gold-light py-2 hover:bg-brand-secondary transition-colors whitespace-nowrap"
                        >
                          Added ✓ View Bag
                        </Link>
                      ) : (
                        <button
                          onClick={() => addItem(p.slug)}
                          className="flex-1 rounded-full border border-brand text-xs font-medium text-brand py-2 hover:bg-brand hover:text-gold-light transition-colors whitespace-nowrap"
                        >
                          Add to Bag
                        </button>
                      )}
                      <button
                        onClick={() => toggleWishlist(p.slug)}
                        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                        className={
                          "shrink-0 grid h-8 w-8 place-items-center rounded-full border transition-colors " +
                          (wishlisted
                            ? "border-gold bg-gold-light/20 text-gold"
                            : "border-beige text-ink/40 hover:border-gold hover:text-gold")
                        }
                      >
                        <span className="text-sm">{wishlisted ? "♥" : "♡"}</span>
                      </button>
                    </div>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {picks.length < COMPARE_LIMIT && (
        <p className="mt-4 text-sm text-ink/50">
          You can compare {COMPARE_LIMIT - picks.length} more{" "}
          {COMPARE_LIMIT - picks.length === 1 ? "piece" : "pieces"} —{" "}
          <Link href="/jewellery" className="text-gold hover:underline">keep browsing</Link>.
        </p>
      )}
    </div>
  );
}
