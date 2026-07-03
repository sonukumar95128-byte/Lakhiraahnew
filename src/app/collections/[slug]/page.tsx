"use client";

import { useParams } from "next/navigation";
import { CategoryListing } from "@/components/CategoryListing";
import { useAdmin } from "@/lib/admin-store";
import { dummyProducts } from "@/lib/dummy-images";

export default function CollectionDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { collections } = useAdmin();
  const collection = collections.find((c) => c.slug === slug);

  if (!collection) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-20 text-center">
        <p className="text-ink/60">Collection not found.</p>
      </div>
    );
  }

  const products = dummyProducts.filter((p) => collection.productSlugs.includes(p.slug));

  return <CategoryListing title={collection.title} pageId={`collection-${slug}`} fallbackBanner={collection.image} products={products} />;
}
