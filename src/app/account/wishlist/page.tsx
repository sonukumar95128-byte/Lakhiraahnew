"use client";

import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { useWishlist } from "@/lib/wishlist-store";
import { categoryToSlug, dummyProducts } from "@/lib/dummy-images";

export default function WishlistPage() {
  const { slugs } = useWishlist();

  const items = slugs
    .map((slug) => dummyProducts.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => !!p);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <h1 className="font-heading italic text-3xl text-brand mb-6">
        Your Wishlist <span className="text-base not-italic text-ink/40">({items.length})</span>
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-ink/60 mb-4">Your wishlist is empty.</p>
          <Link
            href="/jewellery"
            className="rounded-full bg-brand px-6 py-3 text-sm font-medium text-gold-light hover:bg-brand-secondary transition-colors"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-10">
          {items.map((p) => (
            <ProductCard
              key={p.slug}
              slug={p.slug}
              image={p.image}
              hoverImage={p.gallery?.[1]}
              name={p.name}
              price={p.price}
              href={`/jewellery/${categoryToSlug(p.category)}/${p.slug}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
