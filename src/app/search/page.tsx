"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { categoryToSlug, dummyProducts } from "@/lib/dummy-images";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);

  const q = initialQuery.trim().toLowerCase();
  const results = q
    ? dummyProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q)
      )
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <form onSubmit={handleSubmit} className="max-w-md mb-8">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for rings, earrings, necklaces..."
          autoFocus
          className="w-full rounded-full border border-beige px-5 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
        />
      </form>

      {q && (
        <p className="text-sm text-ink/50 mb-6">
          {results.length} result{results.length === 1 ? "" : "s"} for &ldquo;{initialQuery}&rdquo;
        </p>
      )}

      {q && results.length === 0 && (
        <div className="text-center py-16">
          <p className="text-ink/60">No products found. Try a different search term.</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-10">
        {results.map((p) => (
          <ProductCard
            key={p.slug}
            slug={p.slug}
            image={p.image}
            name={p.name}
            price={p.price}
            href={`/jewellery/${categoryToSlug(p.category)}/${p.slug}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 sm:px-6 py-8" />}>
      <SearchContent />
    </Suspense>
  );
}
