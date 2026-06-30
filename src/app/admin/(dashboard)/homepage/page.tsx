"use client";

import Link from "next/link";
import { useState } from "react";
import { useAdmin, type HomepageSection } from "@/lib/admin-store";

export default function HomepageBuilderPage() {
  const { homepageSections, toggleHomepageSection, reorderHomepageSections, newArrivalsSlugs, bestSellersSlugs } =
    useAdmin();
  const [dragId, setDragId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const metaFor = (section: HomepageSection) => {
    if (section.id === "new-arrivals") return `${newArrivalsSlugs.length} products shown`;
    if (section.id === "best-sellers") return `${bestSellersSlugs.length} products shown`;
    return section.meta;
  };

  const handleDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    const sections = [...homepageSections];
    const fromIndex = sections.findIndex((s) => s.id === dragId);
    const toIndex = sections.findIndex((s) => s.id === targetId);
    const [moved] = sections.splice(fromIndex, 1);
    sections.splice(toIndex, 0, moved as HomepageSection);
    reorderHomepageSections(sections);
    setDragId(null);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-1">
        <h1 className="font-heading italic text-3xl text-brand">Homepage builder</h1>
        <div className="flex items-center gap-2">
          <button className="rounded-full border border-beige px-5 py-2 text-sm text-ink/70 hover:border-gold transition-colors">
            Preview
          </button>
          <button
            onClick={handleSave}
            className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-gold-light hover:bg-brand-secondary transition-colors"
          >
            {saved ? "Saved ✓" : "Save & publish"}
          </button>
        </div>
      </div>
      <p className="text-sm text-ink/50 mb-6">Drag to reorder · toggle to show/hide · set each section&apos;s data source</p>

      <div className="rounded-xl border border-beige bg-white overflow-hidden divide-y divide-beige">
        {homepageSections.map((section) => (
          <div
            key={section.id}
            draggable
            onDragStart={() => setDragId(section.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(section.id)}
            className={
              "flex items-center gap-4 px-4 py-3 cursor-move transition-colors " +
              (dragId === section.id ? "opacity-50" : "hover:bg-beige/30")
            }
          >
            <span className="text-ink/30 select-none">⠿</span>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-brand">{section.label}</p>
              <p className="text-xs text-ink/50">{metaFor(section)}</p>
            </div>

            {section.manageHref ? (
              <Link
                href={section.manageHref}
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

            <button aria-label="Edit section" className="text-ink/40 hover:text-gold shrink-0">
              ✎
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
