"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";

type ProductCardProps = {
  slug: string;
  image: string;
  name?: string;
  price?: string;
  badge?: "Bestseller" | "-20%";
  href?: string;
};

export function ProductCard({ slug, image, name, price, badge, href }: ProductCardProps) {
  const { items, addItem } = useCart();
  const inBag = items.some((i) => i.slug === slug);
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(slug);

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-md border border-beige/70 overflow-hidden transition-all duration-300 hover:-translate-y-1 animate-fadeUp">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-beige">
        {href ? (
          <Link href={href} className="block h-full">
            <img
              src={image}
              alt={name ?? "Jewellery product"}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>
        ) : (
          <img
            src={image}
            alt={name ?? "Jewellery product"}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {badge && (
          <span
            className={
              "absolute top-2.5 left-2.5 z-10 rounded-full px-2.5 py-0.5 text-xs font-medium " +
              (badge === "Bestseller" ? "bg-brand text-gold-light" : "bg-gold text-brand")
            }
          >
            {badge}
          </span>
        )}
      </div>

      {/* Info + actions inside the card */}
      <div className="p-3">
        {/* Price first */}
        {price ? (
          <p className="text-sm font-semibold text-brand mb-1">{price}</p>
        ) : (
          <div className="h-3 w-1/2 rounded bg-beige mb-1" />
        )}

        {/* Then title */}
        {name ? (
          href ? (
            <Link href={href}>
              <p className="text-xs text-ink/70 line-clamp-1 hover:text-gold transition-colors leading-snug mb-4">
                {name}
              </p>
            </Link>
          ) : (
            <p className="text-xs text-ink/70 line-clamp-1 leading-snug mb-4">{name}</p>
          )
        ) : (
          <div className="h-3 w-3/4 rounded bg-beige mb-4" />
        )}

        {/* Add to Bag + Wishlist in one row */}
        <div className="flex items-center gap-2">
          {inBag ? (
            <Link
              href="/cart"
              className="flex-1 rounded-full bg-brand text-center text-xs font-medium text-gold-light py-2 transition-colors hover:bg-brand-secondary whitespace-nowrap"
            >
              Added ✓ View Bag
            </Link>
          ) : (
            <button
              onClick={() => addItem(slug)}
              className="flex-1 rounded-full border border-brand text-xs font-medium text-brand py-2 transition-colors hover:bg-brand hover:text-gold-light whitespace-nowrap"
            >
              Add to Bag
            </button>
          )}
          <button
            onClick={() => toggleWishlist(slug)}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className={
              "shrink-0 grid h-8 w-8 place-items-center rounded-full border transition-colors " +
              (wishlisted ? "border-gold bg-gold-light/20 text-gold" : "border-beige text-ink/40 hover:border-gold hover:text-gold")
            }
          >
            <span className="text-sm">{wishlisted ? "♥" : "♡"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
