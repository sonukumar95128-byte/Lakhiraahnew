"use client";

import { ProductCard } from "@/components/ProductCard";
import { categoryToSlug, dummyProducts } from "@/lib/dummy-images";
import { useRecentlyViewed } from "@/lib/recently-viewed-store";
import { useAdmin } from "@/lib/admin-store";

export function RecentlyViewed({ excludeSlug }: { excludeSlug?: string }) {
  const slugs = useRecentlyViewed(excludeSlug);
  const { products } = useAdmin();

  const items = slugs
    .map((slug) => products.find((p) => p.slug === slug) ?? dummyProducts.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => !!p)
    .slice(0, 4);

  if (items.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="font-heading italic text-2xl text-brand mb-5">Recently Viewed</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-10">
        {items.map((p) => (
          <ProductCard
            key={p.slug}
            slug={p.slug}
            image={p.image}
            hoverImage={p.gallery && p.gallery.length > 1 ? p.gallery[p.gallery.length - 1] : undefined}
            name={p.name}
            price={p.price}
            href={`/jewellery/${categoryToSlug(p.category)}/${p.slug}`}
          />
        ))}
      </div>
    </div>
  );
}
