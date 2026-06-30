"use client";

import Image from "next/image";
import Link from "next/link";
import { CuratedProductGrid } from "@/components/CuratedProductGrid";
import { HeroSlider } from "@/components/HeroSlider";
import { SectionHeading } from "@/components/SectionHeading";
import { StylingStories } from "@/components/StylingStories";
import { useAdmin } from "@/lib/admin-store";
import { categories, categoryImages, categoryToSlug, productImages, promoImage } from "@/lib/dummy-images";

const trustBadges = [
  { icon: "✓", label: "Hallmarked", sub: "BIS certified" },
  { icon: "🚚", label: "Free shipping", sub: "Over ₹999" },
  { icon: "↺", label: "15-day returns", sub: "Easy & free" },
  { icon: "♾", label: "Lifetime exchange", sub: "Buyback support" },
];
export default function Home() {
  const {
    newArrivalsSlugs,
    bestSellersSlugs,
    heroSlidesAdmin,
    promoStrips,
    homepageSections,
    collections,
    testimonials,
  } = useAdmin();

  const isOn = (id: string) => homepageSections.find((s) => s.id === id)?.enabled ?? true;

  const liveHeroSlides = heroSlidesAdmin
    .filter((s) => s.enabled)
    .map((s) => ({ image: s.image, href: s.link, alt: s.title }));

  const midPromo = promoStrips.find((p) => p.id === "mid-home") ?? promoStrips[0];

  const liveCollections = collections.filter((c) => c.enabled);

  const liveTestimonials = testimonials
    .filter((t) => t.status === "approved")
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .slice(0, 3);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero — full bleed slider */}
      {isOn("hero") && <HeroSlider slides={liveHeroSlides} />}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-16">
        {/* Category circles */}
        {isOn("categories") && (
          <section className="flex flex-wrap justify-center gap-8 sm:gap-12">
            {categories.map((c) => (
              <Link
                key={c}
                href={`/jewellery/${categoryToSlug(c)}`}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden ring-1 ring-beige group-hover:ring-2 group-hover:ring-gold transition-all">
                  <Image src={categoryImages[c]} alt={c} fill sizes="96px" className="object-cover" />
                </div>
                <span className="text-sm text-ink/80">{c}</span>
              </Link>
            ))}
          </section>
        )}

        {/* New Arrivals */}
        {isOn("new-arrivals") && (
          <section>
            <SectionHeading
              title="New Arrivals"
              subtitle="Freshly crafted pieces, added every week"
              viewAllHref="/jewellery?sort=newest"
            />
            <CuratedProductGrid slugs={newArrivalsSlugs} />
          </section>
        )}
      </div>

      {/* Promo banner — full bleed */}
      {isOn("offer-banner") && (
        <section className="relative aspect-[16/5] w-full overflow-hidden flex items-center justify-end p-8">
          <Image
            src={midPromo?.image ?? promoImage}
            alt={midPromo?.title ?? "Festive offer"}
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand/10 via-transparent to-brand/60" />
          <Link
            href={midPromo?.link ?? "/jewellery?offer=true"}
            className="relative z-10 rounded-full bg-gold px-7 py-3 text-sm font-medium text-brand shadow hover:bg-gold-light transition-colors"
          >
            Shop offers
          </Link>
        </section>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-16">
        {/* Best Sellers */}
        {isOn("best-sellers") && (
          <section>
            <SectionHeading
              title="Best Sellers"
              subtitle="Loved and worn by thousands of customers"
              viewAllHref="/jewellery?sort=bestselling"
            />
            <CuratedProductGrid slugs={bestSellersSlugs} badge="Bestseller" />
          </section>
        )}

        {/* Styling stories */}
        {isOn("reels") && (
          <section>
            <SectionHeading
              title="Styling stories"
              subtitle={`Showing 4 of ${productImages.length} reels — slide for more`}
            />
            <StylingStories images={[...productImages, ...productImages]} />
          </section>
        )}

        {/* Shop by collection */}
        {isOn("collections") && (
          <section>
            <SectionHeading
              title="Shop by collection"
              subtitle="Curated edits for every occasion"
              viewAllHref="/collections"
              viewAllLabel="All collections"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {liveCollections.map((c) => (
                <Link
                  key={c.id}
                  href={`/collections/${c.slug}`}
                  className="relative aspect-[4/3] rounded-lg overflow-hidden flex items-end p-4"
                >
                  <Image src={c.image} alt={c.title} fill sizes="33vw" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand/70 to-transparent" />
                  <span className="relative z-10 font-heading italic text-xl text-white">{c.title}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Trust badges */}
        {isOn("trust-badges") && (
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-6 rounded-xl bg-brand py-10 px-4">
            {trustBadges.map((b) => (
              <div key={b.label} className="flex flex-col items-center text-center gap-2">
                <span className="grid h-12 w-12 place-items-center rounded-full border border-gold/40 text-xl text-gold-light">
                  {b.icon}
                </span>
                <span className="text-sm font-medium text-gold-light">{b.label}</span>
                <span className="text-xs text-gold-light/50">{b.sub}</span>
              </div>
            ))}
          </section>
        )}

        {/* Testimonials */}
        {isOn("testimonials") && (
          <section>
            <SectionHeading
              title="What our customers say"
              subtitle="★ 4.8 average · 12,400+ verified reviews"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {liveTestimonials.map((t) => (
                <div key={t.id} className="rounded-lg border border-beige p-4">
                  <div className="text-gold text-sm mb-2">
                    {"★".repeat(t.rating)}
                    {"☆".repeat(5 - t.rating)}
                  </div>
                  <p className="text-sm text-ink/80 leading-relaxed mb-3">{t.text}</p>
                  <div className="flex items-center gap-2">
                    <div className="relative h-8 w-8 rounded-full overflow-hidden shrink-0">
                      <Image src={t.avatar} alt={t.name} fill sizes="32px" className="object-cover" />
                    </div>
                    <span className="text-sm font-medium text-brand">{t.name}</span>
                    <span className="text-xs text-gold ml-auto">✓ verified</span>
                  </div>
                </div>
              ))}
              {liveTestimonials.length === 0 && (
                <p className="col-span-full text-center text-sm text-ink/40 py-8">No approved testimonials yet.</p>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
