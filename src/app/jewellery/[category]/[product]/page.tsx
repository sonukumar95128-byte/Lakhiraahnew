import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductPagePromo } from "@/components/ProductPagePromo";
import { ProductPurchasePanel } from "@/components/ProductPurchasePanel";
import { ProductShareButton } from "@/components/ProductShareButton";
import { ProductTabs } from "@/components/ProductTabs";
import { ProductTags } from "@/components/ProductTags";
import {
  categoryToSlug,
  dummyProducts,
  getCategoryTags,
  getProductBySlug,
  slugToCategory,
  styleTags,
} from "@/lib/dummy-images";

// Render dynamically on demand — avoids pre-building all 196 product pages during
// deployment, which uses too much memory on Hostinger's server.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; product: string }>;
}): Promise<Metadata> {
  const { product: productSlug } = await params;
  const product = getProductBySlug(productSlug);

  if (!product) return { title: "Product not found — Lakshiraah" };

  const title = `${product.name} | Lakshiraah`;
  const description = product.description.slice(0, 155);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ category: string; product: string }>;
}) {
  const { category: categorySlug, product: productSlug } = await params;

  const category = slugToCategory(categorySlug);
  const product = getProductBySlug(productSlug);

  if (!category || !product || product.category !== category) notFound();

  const gallery = product.gallery.length > 0 ? product.gallery : [product.image];

  const related = dummyProducts.filter((p) => p.category === category && p.slug !== product.slug).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <nav className="text-sm text-ink/50 mb-6">
        <Link href="/" className="hover:text-gold">
          Home
        </Link>{" "}
        / <Link href={`/jewellery/${categorySlug}`} className="hover:text-gold">
          {category}
        </Link>{" "}
        / <span className="text-ink/70">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <ProductGallery images={gallery} alt={product.name} />

        <div>
          <div className="flex items-start justify-between gap-3 mb-1">
            <p className="text-xs text-ink/40">SKU: {product.sku ?? product.slug.toUpperCase().replace(/-/g, "").slice(0, 12)}</p>
            <ProductShareButton name={product.name} />
          </div>
          <h1 className="font-heading italic text-3xl sm:text-4xl text-brand mb-2">{product.name}</h1>
          <ProductPurchasePanel
            slug={product.slug}
            name={product.name}
            price={product.price}
            originalPrice={product.originalPrice}
            rating={product.rating}
            reviewCount={product.reviewCount}
            category={category}
          />
        </div>
      </div>

      <div className="mt-12">
        <ProductTabs
          productSlug={product.slug}
          description={product.description}
          rating={product.rating}
          reviewCount={product.reviewCount}
          attributes={product.attributes}
        />
        <ProductTags categoryTags={getCategoryTags(category)} tags={styleTags} />
      </div>

      <ProductPagePromo />

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="font-heading italic text-2xl text-brand mb-5">You may also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-10">
            {related.map((p) => (
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
        </div>
      )}
    </div>
  );
}
