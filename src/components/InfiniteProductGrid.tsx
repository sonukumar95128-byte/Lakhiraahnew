"use client";

import { useEffect, useRef, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { categoryToSlug, type DummyProduct } from "@/lib/dummy-images";

const BATCH_SIZE = 12;

export function InfiniteProductGrid({ products }: { products: DummyProduct[] }) {
  const [visibleCount, setVisibleCount] = useState(Math.min(BATCH_SIZE, products.length));
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const hasMore = visibleCount < products.length;

  useEffect(() => {
    if (!hasMore) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLoading(true);
          setTimeout(() => {
            setVisibleCount((c) => Math.min(c + BATCH_SIZE, products.length));
            setLoading(false);
          }, 400);
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, products.length]);

  const items = products.slice(0, visibleCount);

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 animate-stagger">
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

      <div ref={sentinelRef} className="h-1" />

      {loading && <p className="mt-8 text-center text-sm text-ink/50">Loading more…</p>}
      {!hasMore && products.length > 0 && (
        <p className="mt-8 text-center text-sm text-ink/40">You&apos;ve reached the end of the collection.</p>
      )}
    </div>
  );
}
