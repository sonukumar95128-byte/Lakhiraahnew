import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryListing } from "@/components/CategoryListing";
import {
  categories,
  categoryBannerImages,
  categoryToSlug,
  dummyProducts,
  slugToCategory,
} from "@/lib/dummy-images";

export function generateStaticParams() {
  return categories.map((c) => ({ category: categoryToSlug(c) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = slugToCategory(slug);
  if (!category) return { title: "Not found — Lakshiraah" };

  return {
    title: `${category} | Lakshiraah`,
    description: `Shop fine ${category.toLowerCase()} — hallmarked gold and certified diamonds, handcrafted by Lakshiraah.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = slugToCategory(slug);

  if (!category) notFound();

  const products = dummyProducts.filter((p) => p.category === category);

  return (
    <CategoryListing
      title={category}
      bannerImage={categoryBannerImages[category]}
      products={products}
      activeCategories={[slug]}
    />
  );
}
