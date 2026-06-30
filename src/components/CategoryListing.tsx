import Image from "next/image";
import { Dropdown } from "@/components/Dropdown";
import { FilterSidebar } from "@/components/FilterSidebar";
import { InfiniteProductGrid } from "@/components/InfiniteProductGrid";
import { getPriceRange, type DummyProduct } from "@/lib/dummy-images";

type CategoryListingProps = {
  title: string;
  bannerImage: string;
  products: DummyProduct[];
  activeCategories?: string[];
};

export function CategoryListing({ title, bannerImage, products, activeCategories }: CategoryListingProps) {
  const { min, max } = getPriceRange(products);

  return (
    <div>
      {/* Banner — full bleed */}
      <section className="relative aspect-[16/4] w-full overflow-hidden flex items-center justify-center">
        <Image src={bannerImage} alt={title} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-brand/45" />
        <h1 className="relative z-10 font-heading italic text-3xl sm:text-4xl text-white">{title}</h1>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="flex items-center justify-end mb-6">
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
          <FilterSidebar priceMin={min} priceMax={max} activeCategories={activeCategories} />

          <div className="flex-1">
            <InfiniteProductGrid products={products} />
          </div>
        </div>
      </div>
    </div>
  );
}
