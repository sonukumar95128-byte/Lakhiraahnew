"use client";

import Image from "next/image";
import { BannerImagePicker } from "@/components/admin/BannerImagePicker";
import { useAdmin } from "@/lib/admin-store";
import { categories } from "@/lib/dummy-images";

const PAGE_BANNER_LABELS: { id: string; label: string }[] = [
  { id: "shop", label: "Shop / All Jewellery page" },
  { id: "rings", label: "Rings page" },
  { id: "earrings", label: "Earrings page" },
  { id: "necklaces", label: "Necklaces page" },
  { id: "bracelets", label: "Bracelets page" },
  { id: "pendants", label: "Pendants page" },
  { id: "nose-pins", label: "Nose Pins page" },
];

export default function AdminBannersPage() {
  const { heroSlidesAdmin, addHeroSlide, updateHeroSlide, toggleHeroSlide, deleteHeroSlide, promoStrips, updatePromoStrip, categoryImages, updateCategoryImage, pageBanners, updatePageBanner } =
    useAdmin();

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-heading italic text-3xl text-brand">Homepage banners &amp; hero</h1>
        <button
          onClick={addHeroSlide}
          className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-gold-light hover:bg-brand-secondary transition-colors"
        >
          + Add banner
        </button>
      </div>
      <p className="text-sm text-ink/50 mb-6">Hero slides shown on the homepage slider</p>

      <div className="rounded-xl border border-beige bg-white overflow-hidden divide-y divide-beige mb-10">
        {heroSlidesAdmin.map((slide, i) => (
          <div key={slide.id} className="flex items-center gap-4 px-4 py-3">
            <div className="shrink-0">
              <div className="relative h-14 w-20 rounded-lg overflow-hidden bg-beige border border-beige mb-1">
                <Image src={slide.image} alt={slide.title} fill sizes="80px" className="object-cover" />
              </div>
              <BannerImagePicker value={slide.image} onChange={(image) => updateHeroSlide(slide.id, { image })} />
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                value={slide.title}
                onChange={(e) => updateHeroSlide(slide.id, { title: e.target.value })}
                placeholder={`Slide ${i + 1} title`}
                className="rounded-lg border border-beige px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
              />
              <input
                value={slide.link}
                onChange={(e) => updateHeroSlide(slide.id, { link: e.target.value })}
                placeholder="Link (e.g. /jewellery/rings)"
                className="rounded-lg border border-beige px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>

            <button
              onClick={() => toggleHeroSlide(slide.id)}
              aria-label={slide.enabled ? "Hide slide" : "Show slide"}
              className={"relative h-5 w-9 rounded-full transition-colors shrink-0 " + (slide.enabled ? "bg-gold" : "bg-beige")}
            >
              <span
                className={
                  "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform " +
                  (slide.enabled ? "translate-x-4" : "translate-x-0.5")
                }
              />
            </button>

            <button
              onClick={() => deleteHeroSlide(slide.id)}
              aria-label="Delete slide"
              className="text-ink/40 hover:text-red-500 shrink-0"
            >
              ✕
            </button>
          </div>
        ))}
        {heroSlidesAdmin.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-ink/40">No slides yet — add one above.</p>
        )}
      </div>

      {/* Category circle images */}
      <h2 className="text-sm font-medium text-brand mb-3">Category circle images</h2>
      <p className="text-xs text-ink/50 mb-4">These appear on the homepage as the 6 category circles (Rings, Earrings, etc.)</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
        {categories.map((cat) => (
          <div key={cat} className="rounded-xl border border-beige bg-white p-4">
            <div className="relative h-20 w-20 mx-auto rounded-full overflow-hidden bg-beige border border-beige mb-3">
              <img
                src={categoryImages[cat]}
                alt={cat}
                className="h-full w-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>
            <p className="text-sm font-medium text-brand text-center mb-2">{cat}</p>
            <BannerImagePicker
              value={categoryImages[cat]}
              onChange={(url) => updateCategoryImage(cat, url)}
            />
          </div>
        ))}
      </div>

      {/* Page banners */}
      <h2 className="text-sm font-medium text-brand mb-1">Page banners</h2>
      <p className="text-xs text-ink/50 mb-4">Top banner shown on Shop and each category page</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {PAGE_BANNER_LABELS.map(({ id, label }) => (
          <div key={id} className="rounded-xl border border-beige bg-white p-4">
            <div className="relative aspect-[4/1] rounded-lg overflow-hidden bg-beige border border-beige mb-2">
              {pageBanners[id] && (
                <img src={pageBanners[id]} alt={label} className="h-full w-full object-cover" />
              )}
            </div>
            <p className="text-xs font-medium text-brand mb-2">{label}</p>
            <BannerImagePicker value={pageBanners[id] ?? ""} onChange={(url) => updatePageBanner(id, url)} />
          </div>
        ))}
      </div>

      <h2 className="text-sm font-medium text-brand mb-3">Promo strips</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {promoStrips.map((strip) => (
          <div key={strip.id} className="rounded-xl border border-beige bg-white p-4">
            <div className="relative aspect-[16/6] rounded-lg overflow-hidden bg-beige border border-beige mb-2">
              <Image src={strip.image} alt={strip.title} fill sizes="400px" className="object-cover" />
            </div>
            <div className="mb-2">
              <BannerImagePicker value={strip.image} onChange={(image) => updatePromoStrip(strip.id, { image })} />
            </div>
            <p className="text-xs text-ink/40 mb-2">{strip.position}</p>
            <input
              value={strip.title}
              onChange={(e) => updatePromoStrip(strip.id, { title: e.target.value })}
              className="w-full mb-2 rounded-lg border border-beige px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
            />
            <input
              value={strip.link}
              onChange={(e) => updatePromoStrip(strip.id, { link: e.target.value })}
              placeholder="Link"
              className="w-full rounded-lg border border-beige px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
