import { CategoryListing } from "@/components/CategoryListing";
import { dummyProducts, promoImage, slugToCategory } from "@/lib/dummy-images";

export default async function JewelleryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const selectedSlugs = category ? category.split(",").filter(Boolean) : [];
  const selectedCategories = selectedSlugs.map(slugToCategory).filter((c): c is NonNullable<typeof c> => !!c);

  const products = selectedCategories.length
    ? dummyProducts.filter((p) => selectedCategories.includes(p.category))
    : dummyProducts;

  const title =
    selectedCategories.length > 0 ? selectedCategories.join(" + ") : "The Full Collection";

  return (
    <CategoryListing
      title={title}
      bannerImage={promoImage}
      products={products}
      activeCategories={selectedSlugs}
    />
  );
}
