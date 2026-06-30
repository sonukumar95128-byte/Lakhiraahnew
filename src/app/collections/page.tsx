"use client";

import Image from "next/image";
import Link from "next/link";
import { useAdmin } from "@/lib/admin-store";

export default function CollectionsIndexPage() {
  const { collections } = useAdmin();
  const liveCollections = collections.filter((c) => c.enabled);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <h1 className="font-heading italic text-3xl text-brand mb-8 text-center">All collections</h1>

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
        {liveCollections.length === 0 && (
          <p className="col-span-full text-center text-sm text-ink/40 py-12">No collections yet.</p>
        )}
      </div>
    </div>
  );
}
