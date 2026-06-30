import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductPurchasePanel } from "@/components/ProductPurchasePanel";
import { ProductTabs } from "@/components/ProductTabs";
import { ProductTags } from "@/components/ProductTags";
import {
  categoryToSlug,
  dummyProducts,
  getCategoryTags,
  getProductBySlug,
  promoImage,
  slugToCategory,
  styleTags,
} from "@/lib/dummy-images";

export function generateStaticParams() {
  return dummyProducts.map((p) => ({
    category: categoryToSlug(p.category),
    product: p.slug,
  }));
}

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
            <button
              aria-label="Share"
              className="grid h-10 w-10 place-items-center rounded-full border border-beige text-ink/60 hover:border-gold hover:text-gold transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="18" cy="5" r="2.5" />
                <circle cx="6" cy="12" r="2.5" />
                <circle cx="18" cy="19" r="2.5" />
                <path d="M8.2 10.8l7.6-4.6M8.2 13.2l7.6 4.6" strokeLinecap="round" />
              </svg>
            </button>
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

      {/* Banner */}
      <div className="mt-12 relative aspect-[16/4] rounded-xl overflow-hidden flex items-center justify-end p-6">
        <Image src={promoImage} alt="Buy 2 get free gold polish" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand/10 via-transparent to-brand/60" />
        <div className="relative z-10 text-right">
          <p className="font-heading italic text-xl text-white mb-2">Buy 2, get free gold polish</p>
          <Link
            href="/jewellery"
            className="inline-block rounded-full bg-gold px-6 py-2 text-sm font-medium text-brand hover:bg-gold-light transition-colors"
          >
            Explore
          </Link>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="font-heading italic text-2xl text-brand mb-5">You may also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-10">
            {related.map((p) => (
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
      )}
    </div>
  );
}
