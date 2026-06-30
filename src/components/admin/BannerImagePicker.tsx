"use client";

import Image from "next/image";
import { useState } from "react";
import { useAdmin } from "@/lib/admin-store";

type BannerImagePickerProps = {
  value: string;
  onChange: (image: string) => void;
};

export function BannerImagePicker({ value, onChange }: BannerImagePickerProps) {
  const { products } = useAdmin();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())).slice(0, 60);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="text-xs text-gold underline hover:text-brand"
      >
        Change image
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-80 rounded-xl border border-beige bg-white p-3 shadow-lg">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="mb-2 w-full rounded-lg border border-beige px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
          />
          <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
            {filtered.map((p) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => {
                  onChange(p.image);
                  setOpen(false);
                }}
                className={
                  "relative aspect-square rounded-lg overflow-hidden border-2 " +
                  (value === p.image ? "border-gold" : "border-transparent")
                }
                title={p.name}
              >
                <Image src={p.image} alt={p.name} fill sizes="64px" className="object-cover" />
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="col-span-4 py-4 text-center text-xs text-ink/40">No products match.</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-2 w-full rounded-full border border-beige px-3 py-1.5 text-xs text-ink/60 hover:border-gold transition-colors"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
