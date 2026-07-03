"use client";

import Link from "next/link";
import { useAdmin } from "@/lib/admin-store";

export function ProductPagePromo() {
  const { promoStrips } = useAdmin();
  const strip = promoStrips.find((s) => s.id === "product-page");
  if (!strip) return null;

  return (
    <div className="mt-12 relative aspect-[16/4] rounded-xl overflow-hidden flex items-center justify-end p-6">
      <img src={strip.image} alt={strip.title} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand/10 via-transparent to-brand/60" />
      <div className="relative z-10 text-right">
        <p className="font-heading italic text-xl text-white mb-2">{strip.title}</p>
        <Link
          href={strip.link}
          className="inline-block rounded-full bg-gold px-6 py-2 text-sm font-medium text-brand hover:bg-gold-light transition-colors"
        >
          Explore
        </Link>
      </div>
    </div>
  );
}
