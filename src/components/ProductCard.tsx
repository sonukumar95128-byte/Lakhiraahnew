"use client";

import Image from "next/image";
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

  const imageBlock = (
    <div className="relative aspect-square rounded-xl overflow-hidden bg-beige border border-beige">
      <Image
        src={image}
        alt={name ?? "Jewellery product"}
        fill
        sizes="(min-width: 1024px) 25vw, 50vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {badge && (
        <span
          className={
            "absolute top-3 left-3 z-10 rounded px-2 py-1 text-xs font-medium " +
            (badge === "Bestseller" ? "bg-brand text-gold-light" : "bg-gold text-brand")
          }
        >
          {badge}
        </span>
      )}
    </div>
  );

  return (
    <div className="group">
      {href ? <Link href={href}>{imageBlock}</Link> : imageBlock}

      {name ? (
        href ? (
          <Link href={href}>
            <p className="mt-3 text-sm text-ink line-clamp-1 hover:text-gold transition-colors">{name}</p>
          </Link>
        ) : (
          <p className="mt-3 text-sm text-ink line-clamp-1">{name}</p>
        )
      ) : (
        <div className="mt-3 h-3.5 w-3/4 rounded bg-beige" />
      )}
      {price ? (
        <p className="mt-1 text-base font-medium text-brand">{price}</p>
      ) : (
        <div className="mt-2 h-3.5 w-1/2 rounded bg-beige" />
      )}

      <div className="mt-3 flex items-center gap-2">
        {inBag ? (
          <Link
            href="/cart"
            className="flex-1 rounded-full border border-brand bg-brand px-4 py-2 text-center text-sm font-medium text-gold-light"
          >
            Added to Bag ✓
          </Link>
        ) : (
          <button
            onClick={() => addItem(slug)}
            className="flex-1 rounded-full border border-brand px-4 py-2 text-sm font-medium text-brand hover:bg-brand hover:text-gold-light transition-colors"
          >
            Add to Bag
          </button>
        )}
        <button
          onClick={() => toggleWishlist(slug)}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={
            "grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-colors " +
            (wishlisted ? "border-gold text-gold bg-gold-light/20" : "border-beige text-ink/60 hover:border-gold hover:text-gold")
          }
        >
          {wishlisted ? "♥" : "♡"}
        </button>
      </div>
    </div>
  );
}
