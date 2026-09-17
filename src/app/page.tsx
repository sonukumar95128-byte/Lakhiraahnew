export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { getPrisma } from "@/lib/prisma";
import { CuratedProductGrid } from "@/components/CuratedProductGrid";
import { HeroSlider } from "@/components/HeroSlider";
import { PromoSlider } from "@/components/PromoSlider";
import { SectionHeading } from "@/components/SectionHeading";
import { ShowcaseSlider } from "@/components/ShowcaseSlider";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";
import {
  categories,
  categoryImages as defaultCategoryImages,
  categoryToSlug,
  dummyProducts,
  dummyTestimonials,
  heroSlides,
  productImages,
  collectionImages,
} from "@/lib/dummy-images";
import type {
  AdminCollection,
  AdminTestimonial,
  HomepageSection,
  HeroSlideAdmin,
  PromoStrip,
  TrustBadge,
} from "@/lib/admin-store";

// Seed defaults (used when DB has no value yet)
const defaultSections: HomepageSection[] = [
  { id: "hero", label: "Hero slider", meta: "", manageLabel: "", enabled: true },
  { id: "categories", label: "Category circles", meta: "", manageLabel: "", enabled: true },
  { id: "best-sellers", label: "Best Sellers", meta: "", manageLabel: "", enabled: true },
  { id: "offer-banner", label: "Offer banner", meta: "", manageLabel: "", enabled: true },
  { id: "new-arrivals", label: "New Arrivals", meta: "", manageLabel: "", enabled: true },
  { id: "reels", label: "Video Reels", meta: "", manageLabel: "", enabled: true },
  { id: "collections", label: "Collections", meta: "", manageLabel: "", enabled: true },
  { id: "testimonials", label: "Testimonials", meta: "", manageLabel: "", enabled: true },
  { id: "trust-badges", label: "Trust badges", meta: "", manageLabel: "", enabled: true },
];

const defaultHeroSlides: HeroSlideAdmin[] = heroSlides.map((s, i) => ({
  id: `slide-${i + 1}`,
  title: s.alt,
  link: s.href,
  image: s.image,
  enabled: true,
}));

const defaultPromoStrips: PromoStrip[] = [
  { id: "promo-slide-1", position: "Homepage slider", title: "New Collection", link: "/jewellery", image: productImages[6], enabled: true },
  { id: "promo-slide-2", position: "Homepage slider", title: "Festive Sale", link: "/jewellery", image: productImages[2], enabled: true },
];

const defaultCollections: AdminCollection[] = [
  { id: "bridal", title: "Bridal", slug: "bridal", image: collectionImages.Bridal, productSlugs: [], enabled: true },
  { id: "everyday-light", title: "Everyday Light", slug: "everyday-light", image: collectionImages["Everyday Light"], productSlugs: [], enabled: true },
  { id: "gifting", title: "Gifting", slug: "gifting", image: collectionImages.Gifting, productSlugs: [], enabled: true },
];

const defaultTestimonials: AdminTestimonial[] = dummyTestimonials.map((t, i) => ({
  id: `testimonial-${i + 1}`,
  name: t.name,
  rating: t.rating,
  text: t.text,
  avatar: t.avatar,
  status: "approved" as const,
  featured: i === 0,
}));

const defaultTrustBadges: TrustBadge[] = [
  { id: "badge-1", icon: "✓", label: "Hallmarked", sub: "BIS certified", enabled: true },
  { id: "badge-2", icon: "🚚", label: "Free shipping", sub: "Over ₹999", enabled: true },
  { id: "badge-3", icon: "↺", label: "7-day returns", sub: "Easy & free", enabled: true },
  { id: "badge-4", icon: "♾", label: "Lifetime exchange", sub: "Buyback support", enabled: true },
];

function CollectionCard({ collection, featured = false }: { collection: AdminCollection; featured?: boolean }) {
  return (
    <Link
      href={`/collections/${collection.slug}`}
      className={
        "group relative overflow-hidden rounded-2xl ring-1 ring-beige " +
        (featured
          ? "sm:col-span-2 aspect-[16/10] sm:aspect-[16/11]"
          : "aspect-[16/9] sm:aspect-auto sm:flex-1")
      }
    >
      <Image
        src={collection.image}
        alt={collection.title}
        fill
        sizes={featured ? "(min-width:640px) 66vw, 100vw" : "(min-width:640px) 33vw, 100vw"}
        className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand/85 via-brand/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <span className="block h-px w-10 bg-gold/70 mb-3" />
        <span className={"block font-heading italic text-white " + (featured ? "text-2xl sm:text-3xl" : "text-xl")}>
          {collection.title}
        </span>
        <span className="mt-1.5 inline-block text-[11px] uppercase tracking-[0.2em] text-gold-light/80">
          Explore →
        </span>
      </div>
    </Link>
  );
}

async function getSiteConfig() {
  try {
    const prisma = getPrisma();
    const rows = await prisma.siteConfig.findMany({
      where: {
        key: { in: ["banners", "homepage", "testimonials", "collections", "newArrivals", "bestSellers", "categoryImages", "trustBadges"] },
      },
    });
    const db: Record<string, unknown> = {};
    for (const row of rows) db[row.key] = row.value;
    return db;
  } catch {
    return {};
  }
}

export default async function Home() {
  const db = await getSiteConfig();

  // Banners
  const banners = db.banners as { heroSlidesAdmin?: HeroSlideAdmin[]; promoStrips?: PromoStrip[] } | undefined;
  const heroSlidesAdmin: HeroSlideAdmin[] = banners?.heroSlidesAdmin ?? defaultHeroSlides;
  const promoStrips: PromoStrip[] = banners?.promoStrips ?? defaultPromoStrips;

  // Sections
  const homepageSections: HomepageSection[] = (db.homepage as HomepageSection[]) ?? defaultSections;
  const isOn = (id: string) => homepageSections.find((s) => s.id === id)?.enabled ?? true;

  // Content
  const collections: AdminCollection[] = (db.collections as AdminCollection[]) ?? defaultCollections;
  const testimonials: AdminTestimonial[] = (db.testimonials as AdminTestimonial[]) ?? defaultTestimonials;
  const trustBadges: TrustBadge[] = (db.trustBadges as TrustBadge[]) ?? defaultTrustBadges;
  const catImages: Record<string, string> = (db.categoryImages as Record<string, string>) ?? {};
  const newArrivalsSlugs: string[] = (db.newArrivals as string[]) ?? dummyProducts.slice(0, 8).map((p) => p.slug);
  const bestSellersSlugs: string[] = (db.bestSellers as string[]) ?? dummyProducts.slice(8, 16).map((p) => p.slug);

  // Derived
  const liveHeroSlides = heroSlidesAdmin
    .filter((s) => s.enabled)
    .map((s) => ({ image: s.image, href: s.link, alt: s.title }));

  // Spotlight picks — one per category, skipping whatever the two grids above
  // already show, so the slider never repeats them.
  const showcaseSlugs = (() => {
    const used = new Set([...newArrivalsSlugs, ...bestSellersSlugs]);
    const seen = new Set<string>();
    const picks: string[] = [];
    for (const p of dummyProducts) {
      if (used.has(p.slug) || seen.has(p.category)) continue;
      seen.add(p.category);
      picks.push(p.slug);
    }
    for (const p of dummyProducts) {
      if (picks.length >= 8) break;
      if (used.has(p.slug) || picks.includes(p.slug)) continue;
      picks.push(p.slug);
    }
    return picks;
  })();

  const homeSlides = promoStrips.filter((p) => p.position === "Homepage slider" && p.enabled !== false);
  const liveCollections = collections.filter((c) => c.enabled);
  const liveTestimonials = testimonials
    .filter((t) => t.status === "approved")
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .slice(0, 9);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero — full bleed slider */}
      {isOn("hero") && <HeroSlider slides={liveHeroSlides} />}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-16">
        {/* Category circles */}
        {isOn("categories") && (
          <section className="overflow-x-auto [&::-webkit-scrollbar]:hidden scroll-smooth snap-x snap-mandatory pb-2">
            <div className="flex gap-6 sm:gap-10 mx-auto w-fit px-2">
              {categories.map((c) => (
                <Link key={c} href={`/jewellery/${categoryToSlug(c)}`} className="flex flex-col items-center gap-3 group shrink-0 snap-center">
                  <div className="relative h-24 w-24 sm:h-32 sm:w-32 lg:h-36 lg:w-36 rounded-full overflow-hidden ring-1 ring-beige group-hover:ring-2 group-hover:ring-gold transition-all">
                    <Image
                      src={catImages[c] || defaultCategoryImages[c] || ""}
                      alt={c}
                      fill
                      sizes="(min-width:1024px) 144px, (min-width:640px) 128px, 96px"
                      className="object-cover"
                    />
                  </div>
                  <span className="text-sm sm:text-base text-ink/80">{c}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* New Arrivals */}
        {isOn("new-arrivals") && (
          <section>
            <SectionHeading title="New Arrivals" subtitle="Freshly crafted pieces, added every week" viewAllHref="/jewellery?sort=newest" />
            <CuratedProductGrid slugs={newArrivalsSlugs} />
          </section>
        )}
      </div>

      {/* Promo slider — full bleed */}
      {isOn("offer-banner") && <PromoSlider slides={homeSlides} />}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-16">
        {/* Best Sellers */}
        {isOn("best-sellers") && (
          <section>
            <SectionHeading title="Best Sellers" subtitle="Loved and worn by thousands of customers" viewAllHref="/jewellery?sort=bestselling" />
            <CuratedProductGrid slugs={bestSellersSlugs} badge="Bestseller" />
          </section>
        )}

        {/* Showcase slider — jewellery you can tap straight through to */}
        {isOn("reels") && showcaseSlugs.length > 0 && (
          <section>
            <SectionHeading title="In the Spotlight" subtitle="Tap a piece to see it up close" />
            <ShowcaseSlider slugs={showcaseSlugs} />
          </section>
        )}

        {/* Shop by collection */}
        {isOn("collections") && (
          <section>
            <SectionHeading title="Shop by collection" subtitle="Curated edits for every occasion" viewAllHref="/collections" viewAllLabel="All collections" />
            {/* Editorial layout: one tall feature, the rest stacked beside it */}
            <div className="grid gap-4 sm:grid-cols-3">
              {liveCollections.slice(0, 1).map((c) => (
                <CollectionCard key={c.id} collection={c} featured />
              ))}
              {liveCollections.length > 1 && (
                <div className="flex flex-col gap-4">
                  {liveCollections.slice(1, 3).map((c) => (
                    <CollectionCard key={c.id} collection={c} />
                  ))}
                </div>
              )}
              {liveCollections.length > 3 && (
                <div className="sm:col-span-3 grid gap-4 sm:grid-cols-3">
                  {liveCollections.slice(3).map((c) => (
                    <CollectionCard key={c.id} collection={c} />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </div>

      {/* Trust badges — full-bleed band */}
      {isOn("trust-badges") && (
        <section className="w-full bg-brand border-y border-gold/25">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-4 divide-y divide-gold/15 sm:divide-y-0 sm:divide-x">
            {trustBadges.filter((b) => b.enabled).map((b) => (
              <div key={b.id} className="flex flex-col items-center text-center gap-2.5 px-4 py-9">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-gold/10 ring-1 ring-gold/40 text-xl text-gold-light">{b.icon}</span>
                <span className="text-[11px] uppercase tracking-[0.22em] text-gold-light">{b.label}</span>
                <span className="text-xs text-gold-light/50">{b.sub}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-16">
        {/* Testimonials */}
        {isOn("testimonials") && (
          <section>
            <SectionHeading title="What our customers say" subtitle="★ 4.8 average · 12,400+ verified reviews" />
            <TestimonialsCarousel testimonials={liveTestimonials} />
          </section>
        )}
      </div>
    </div>
  );
}
