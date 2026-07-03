"use client";

import { ProductCard } from "@/components/ProductCard";
import { useAdmin } from "@/lib/admin-store";
import { categoryToSlug } from "@/lib/dummy-images";

type CuratedProductGridProps = {
  slugs: string[];
  badge?: "Bestseller" | "-20%";
};

export function CuratedProductGrid({ slugs, badge }: CuratedProductGridProps) {
  const { products } = useAdmin();

  const items = slugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => !!p);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-stagger">
      {items.map((p) => (
        <ProductCard
          key={p.slug}
          slug={p.slug}
          image={p.image}
          hoverImage={p.gallery?.[1]}
          name={p.name}
          price={p.price}
          badge={badge}
          href={`/jewellery/${categoryToSlug(p.category)}/${p.slug}`}
        />
      ))}
    </div>
  );
}
