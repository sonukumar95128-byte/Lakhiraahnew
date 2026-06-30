"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAdmin } from "@/lib/admin-store";

type ProductPickerProps = {
  title: string;
  description: string;
  initialSelected: string[];
  onSave: (slugs: string[]) => void;
  backHref: string;
};

export function ProductPicker({ title, description, initialSelected, onSave, backHref }: ProductPickerProps) {
  const { products } = useAdmin();
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>(initialSelected);
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState(false);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (slug: string) => {
    setSelected((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  };

  const moveUp = (slug: string) => {
    setSelected((prev) => {
      const i = prev.indexOf(slug);
      if (i <= 0) return prev;
      const next = [...prev];
      [next[i - 1], next[i]] = [next[i], next[i - 1]];
      return next;
    });
  };

  const moveDown = (slug: string) => {
    setSelected((prev) => {
      const i = prev.indexOf(slug);
      if (i === -1 || i === prev.length - 1) return prev;
      const next = [...prev];
      [next[i], next[i + 1]] = [next[i + 1], next[i]];
      return next;
    });
  };

  const handleSave = () => {
    onSave(selected);
    setSaved(true);
    setTimeout(() => {
      router.push(backHref);
    }, 600);
  };

  const selectedProducts = selected
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => !!p);

  return (
    <div>
      <div className="flex items-start justify-between mb-1">
        <h1 className="font-heading italic text-3xl text-brand">{title}</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push(backHref)}
            className="rounded-full border border-beige px-5 py-2 text-sm text-ink/70 hover:border-gold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-gold-light hover:bg-brand-secondary transition-colors"
          >
            {saved ? "Saved ✓" : "Save"}
          </button>
        </div>
      </div>
      <p className="text-sm text-ink/50 mb-6">{description}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* All products — search & select */}
        <div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, category, or SKU..."
            className="mb-3 w-full rounded-lg border border-beige px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
          />
          <div className="rounded-xl border border-beige bg-white max-h-[28rem] overflow-y-auto divide-y divide-beige">
            {filtered.map((p) => {
              const isSelected = selected.includes(p.slug);
              return (
                <label
                  key={p.slug}
                  className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-beige/30 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggle(p.slug)}
                    className="h-4 w-4 rounded border-beige accent-gold shrink-0"
                  />
                  <div className="relative h-10 w-10 shrink-0 rounded-lg overflow-hidden bg-beige border border-beige">
                    <Image src={p.image} alt={p.name} fill sizes="40px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ink line-clamp-1">{p.name}</p>
                    <p className="text-xs text-ink/40">
                      {p.category} · {p.price}
                    </p>
                  </div>
                </label>
              );
            })}
            {filtered.length === 0 && (
              <p className="px-3 py-8 text-center text-sm text-ink/40">No products match your search.</p>
            )}
          </div>
        </div>

        {/* Selected — ordered preview */}
        <div>
          <p className="mb-3 text-sm font-medium text-brand">{selected.length} selected (this order shows on the homepage)</p>
          <div className="rounded-xl border border-beige bg-white max-h-[28rem] overflow-y-auto divide-y divide-beige">
            {selectedProducts.map((p) => (
              <div key={p.slug} className="flex items-center gap-3 px-3 py-2">
                <div className="relative h-10 w-10 shrink-0 rounded-lg overflow-hidden bg-beige border border-beige">
                  <Image src={p.image} alt={p.name} fill sizes="40px" className="object-cover" />
                </div>
                <p className="flex-1 min-w-0 text-sm text-ink line-clamp-1">{p.name}</p>
                <button
                  onClick={() => moveUp(p.slug)}
                  aria-label="Move up"
                  className="text-ink/40 hover:text-gold px-1"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveDown(p.slug)}
                  aria-label="Move down"
                  className="text-ink/40 hover:text-gold px-1"
                >
                  ↓
                </button>
                <button
                  onClick={() => toggle(p.slug)}
                  aria-label="Remove"
                  className="text-ink/40 hover:text-red-500 px-1"
                >
                  ✕
                </button>
              </div>
            ))}
            {selectedProducts.length === 0 && (
              <p className="px-3 py-8 text-center text-sm text-ink/40">
                Nothing selected yet — check products on the left.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
