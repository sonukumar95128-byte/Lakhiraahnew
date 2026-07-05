"use client";

import Image from "next/image";
import Link from "next/link";
import { BannerImagePicker } from "@/components/admin/BannerImagePicker";
import { useAdmin } from "@/lib/admin-store";
import { slugify } from "@/lib/dummy-images";

export default function AdminCollectionsPage() {
  const { collections, addCollection, updateCollection, toggleCollection, deleteCollection } = useAdmin();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={addCollection}
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-gold-light hover:bg-brand-secondary transition-colors"
        >
          + Add collection
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {collections.map((c) => (
          <div key={c.id} className="rounded-xl border border-beige bg-white p-4">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-beige border border-beige mb-2">
              <Image src={c.image} alt={c.title} fill sizes="300px" className="object-cover" />
              {!c.enabled && (
                <div className="absolute inset-0 bg-black/40 grid place-items-center text-xs text-white font-medium">
                  Hidden
                </div>
              )}
            </div>

            <div className="mb-2">
              <BannerImagePicker
                value={c.image}
                onChange={(image) => updateCollection(c.id, { image })}
              />
            </div>

            <input
              value={c.title}
              onChange={(e) => updateCollection(c.id, { title: e.target.value, slug: slugify(e.target.value) })}
              className="w-full mb-2 rounded-lg border border-beige px-3 py-1.5 text-sm font-medium text-brand focus:outline-none focus:ring-1 focus:ring-gold"
            />

            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-ink/50">{c.productSlugs.length} products</span>
              <Link
                href={`/admin/collections/${c.id}/products`}
                className="text-xs text-gold hover:text-brand underline"
              >
                Choose products →
              </Link>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => toggleCollection(c.id)}
                className={
                  "relative h-5 w-9 rounded-full transition-colors " + (c.enabled ? "bg-gold" : "bg-beige")
                }
                aria-label={c.enabled ? "Hide collection" : "Show collection"}
              >
                <span
                  className={
                    "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform " +
                    (c.enabled ? "translate-x-4" : "translate-x-0.5")
                  }
                />
              </button>
              <button onClick={() => deleteCollection(c.id)} className="text-xs text-ink/50 hover:text-red-500">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
