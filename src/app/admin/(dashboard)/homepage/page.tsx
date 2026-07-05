"use client";

import Link from "next/link";
import { useState } from "react";
import { useAdmin, type HomepageSection } from "@/lib/admin-store";

// Always use these hrefs regardless of what's stored in localStorage
const SECTION_HREFS: Record<string, string> = {
  "hero": "/admin/banners",
  "best-sellers": "/admin/homepage/best-sellers",
  "offer-banner": "/admin/banners",
  "new-arrivals": "/admin/homepage/new-arrivals",
  "reels": "/admin/reels",
  "collections": "/admin/collections",
  "testimonials": "/admin/testimonials",
  "trust-badges": "/admin/trust-badges",
};

export default function HomepageBuilderPage() {
  const { homepageSections, toggleHomepageSection, reorderHomepageSections, newArrivalsSlugs, bestSellersSlugs } =
    useAdmin();
  const [saved, setSaved] = useState(false);

  const metaFor = (section: HomepageSection) => {
    if (section.id === "new-arrivals") return `${newArrivalsSlugs.length} products shown`;
    if (section.id === "best-sellers") return `${bestSellersSlugs.length} products shown`;
    return section.meta;
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const sections = [...homepageSections];
    const swapWith = direction === "up" ? index - 1 : index + 1;
    if (swapWith < 0 || swapWith >= sections.length) return;
    [sections[index], sections[swapWith]] = [sections[swapWith], sections[index]];
    reorderHomepageSections(sections as HomepageSection[]);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-gold-light hover:bg-brand-secondary transition-colors"
          >
            {saved ? "Saved ✓" : "Save & publish"}
          </button>
        </div>
      </div>
      <p className="text-sm text-ink/50 mb-6">Use ↑↓ arrows to reorder · toggle to show/hide</p>

      <div className="rounded-xl border border-beige bg-white overflow-hidden divide-y divide-beige">
        {homepageSections.map((section, index) => (
          <div
            key={section.id}
            className="flex items-center gap-3 px-4 py-3 hover:bg-beige/30 transition-colors"
          >
            {/* Up / Down buttons */}
            <div className="flex flex-col gap-0.5 shrink-0">
              <button
                onClick={() => moveSection(index, "up")}
                disabled={index === 0}
                className="text-ink/30 hover:text-brand disabled:opacity-20 leading-none text-xs px-1"
                aria-label="Move up"
              >
                ▲
              </button>
              <button
                onClick={() => moveSection(index, "down")}
                disabled={index === homepageSections.length - 1}
                className="text-ink/30 hover:text-brand disabled:opacity-20 leading-none text-xs px-1"
                aria-label="Move down"
              >
                ▼
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-brand">{section.label}</p>
              <p className="text-xs text-ink/50">{metaFor(section)}</p>
            </div>

            {SECTION_HREFS[section.id] ? (
              <Link
                href={SECTION_HREFS[section.id]}
                className="rounded-full border border-gold px-3 py-1 text-xs text-brand hover:bg-gold-light/20 whitespace-nowrap transition-colors"
              >
                {section.manageLabel}
              </Link>
            ) : (
              <span className="rounded-full border border-beige px-3 py-1 text-xs text-ink/40 whitespace-nowrap cursor-not-allowed">
                {section.manageLabel}
              </span>
            )}

            <button
              onClick={() => toggleHomepageSection(section.id)}
              aria-label={section.enabled ? "Hide section" : "Show section"}
              className={
                "relative h-5 w-9 rounded-full transition-colors shrink-0 " +
                (section.enabled ? "bg-gold" : "bg-beige")
              }
            >
              <span
                className={
                  "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform " +
                  (section.enabled ? "translate-x-4" : "translate-x-0.5")
                }
              />
            </button>
          </div>
        ))}
      </div>

      <button className="mt-4 text-sm text-gold hover:text-brand">
        + Add section (rich text, image strip, countdown, Instagram feed…)
      </button>
    </div>
  );
}
