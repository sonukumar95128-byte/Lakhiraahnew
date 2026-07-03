"use client";

import Image from "next/image";
import { useState } from "react";
import { Dropdown } from "@/components/Dropdown";
import { FilterSidebar } from "@/components/FilterSidebar";
import { InfiniteProductGrid } from "@/components/InfiniteProductGrid";
import { getPriceRange, type DummyProduct } from "@/lib/dummy-images";
import { useAdmin } from "@/lib/admin-store";

type CategoryListingProps = {
  title: string;
  pageId: string;
  fallbackBanner: string;
  products: DummyProduct[];
  activeCategories?: string[];
};

export function CategoryListing({ title, pageId, fallbackBanner, products, activeCategories }: CategoryListingProps) {
  const { pageBanners } = useAdmin();
  const bannerImage = pageBanners[pageId] ?? fallbackBanner;
  const { min, max } = getPriceRange(products);
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div>
      {/* Banner — full bleed */}
      <section className="relative aspect-[16/4] w-full overflow-hidden flex items-center justify-center">
        <Image src={bannerImage} alt={title} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-brand/45" />
        <h1 className="relative z-10 font-heading italic text-3xl sm:text-4xl text-white">{title}</h1>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        {/* Top bar — Filter button (mobile) + Sort */}
        <div className="flex items-center justify-between mb-6">
          {/* Filter button — mobile only */}
          <button
            onClick={() => setFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 rounded-full border border-gold bg-white px-4 py-2 text-sm text-brand hover:bg-gold/10 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4h18M7 12h10M11 20h2" />
            </svg>
            Filters
          </button>
          <span className="hidden lg:block" /> {/* spacer on desktop */}
          <Dropdown
            defaultValue="newest"
            options={[
              { value: "newest", label: "Sort: Newest" },
              { value: "price-asc", label: "Price: Low to High" },
              { value: "price-desc", label: "Price: High to Low" },
              { value: "bestselling", label: "Bestselling" },
            ]}
          />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start gap-10">
          {/* Desktop sidebar — always visible */}
          <div className="hidden lg:block">
            <FilterSidebar priceMin={min} priceMax={max} activeCategories={activeCategories} />
          </div>

          {/* Products */}
          <div className="flex-1">
            <InfiniteProductGrid products={products} />
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filterOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setFilterOpen(false)}
          />
          {/* Drawer — slides up from bottom */}
          <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl bg-white max-h-[85vh] flex flex-col lg:hidden">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-beige shrink-0">
              <h2 className="font-heading text-xl text-brand">Filters</h2>
              <button
                onClick={() => setFilterOpen(false)}
                className="text-ink/40 hover:text-brand text-2xl leading-none"
              >
                ✕
              </button>
            </div>
            {/* Scrollable filter content */}
            <div className="overflow-y-auto flex-1 px-5 pb-6">
              <FilterSidebar priceMin={min} priceMax={max} activeCategories={activeCategories} mobileMode />
            </div>
            {/* Apply button */}
            <div className="px-5 py-4 border-t border-beige shrink-0">
              <button
                onClick={() => setFilterOpen(false)}
                className="w-full rounded-full bg-brand py-3 text-sm font-medium text-gold-light hover:bg-brand-secondary transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
