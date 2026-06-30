"use client";

import Link from "next/link";
import { useState } from "react";
import {
  colorOptions,
  formatRupee,
  getCoupons,
  getPriceBreakup,
  getSizeOptions,
  purityOptions,
  type Category,
} from "@/lib/dummy-images";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";

type ProductPurchasePanelProps = {
  slug: string;
  name: string;
  price: string;
  originalPrice?: string;
  rating: number;
  reviewCount: number;
  category: Category;
};

function discountPercent(price: string, originalPrice?: string): number | null {
  if (!originalPrice) return null;
  const p = Number(price.replace(/[^0-9]/g, ""));
  const o = Number(originalPrice.replace(/[^0-9]/g, ""));
  if (!o || o <= p) return null;
  return Math.round(((o - p) / o) * 100);
}

export function ProductPurchasePanel({
  slug,
  name,
  price,
  originalPrice,
  rating,
  reviewCount,
  category,
}: ProductPurchasePanelProps) {
  const { items, addItem } = useCart();
  const inBag = items.some((i) => i.slug === slug);
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(slug);
  const [color, setColor] = useState(colorOptions[2].label);
  const [purity, setPurity] = useState(purityOptions[0]);
  const sizeOptions = getSizeOptions(category);
  const [size, setSize] = useState(sizeOptions[0]);
  const [pincode, setPincode] = useState("");
  const [showBreakup, setShowBreakup] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const discount = discountPercent(price, originalPrice);
  const breakup = getPriceBreakup(price);
  const coupons = getCoupons(price);

  return (
    <div>
      <div className="flex items-center gap-1 text-sm text-gold mb-2">
        {"★".repeat(Math.round(rating))}
        {"☆".repeat(5 - Math.round(rating))}
        <span className="text-ink/50 ml-1">· {reviewCount} reviews</span>
      </div>

      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="font-sans text-3xl font-semibold text-brand">{price}</span>
        {originalPrice && <span className="text-ink/40 line-through text-lg">{originalPrice}</span>}
        {discount && (
          <span className="rounded bg-gold-light/40 px-2 py-0.5 text-xs font-medium text-brand">{discount}% off</span>
        )}
      </div>
      <p className="text-xs text-ink/50 mt-1">
        Price exclusive of taxes. See the full{" "}
        <button onClick={() => setShowBreakup((s) => !s)} className="text-gold underline hover:text-brand">
          price breakup
        </button>
      </p>

      {showBreakup && (
        <div className="mt-3 rounded-lg border border-beige overflow-hidden text-sm">
          <table className="w-full">
            <tbody>
              {[
                [purity, breakup.gold],
                ["Diamond", breakup.diamond],
                ["Other Stones", breakup.otherStones],
                ["Making Charge", breakup.making],
                ["GST", breakup.gst],
              ].map(([label, value]) => (
                <tr key={label} className="border-b border-beige">
                  <td className="px-3 py-2 text-ink/70">{label}</td>
                  <td className="px-3 py-2 text-right text-ink/70">{formatRupee(value as number)}</td>
                </tr>
              ))}
              <tr className="bg-beige/50">
                <td className="px-3 py-2 font-medium text-brand">Total</td>
                <td className="px-3 py-2 text-right font-medium text-brand">{formatRupee(breakup.total)}</td>
              </tr>
            </tbody>
          </table>
          <p className="px-3 py-2 text-xs text-ink/40">This is an estimated price, actual price may differ as per actual weights.</p>
        </div>
      )}

      {/* Coupons */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {coupons.map((c) => (
          <div key={c.code} className="rounded-lg border border-gold/40 bg-gold-light/10 p-3">
            <p className="text-xs font-medium text-brand mb-1">Special offer</p>
            <p className="text-sm text-ink/80">
              Pay <span className="font-semibold text-brand">{formatRupee(breakup.total - c.discountInPaise)}</span> at checkout
            </p>
            <p className="text-xs text-ink/50 mt-1">{c.label}</p>
            <button
              onClick={() => setAppliedCoupon(appliedCoupon === c.code ? null : c.code)}
              className={
                "mt-2 rounded-full px-3 py-1 text-xs font-medium transition-colors " +
                (appliedCoupon === c.code ? "bg-brand text-gold-light" : "bg-gold text-brand hover:bg-gold-light")
              }
            >
              {appliedCoupon === c.code ? "Applied ✓" : `Apply ${c.code}`}
            </button>
          </div>
        ))}
      </div>

      {/* Color */}
      <div className="mt-6">
        <p className="text-sm font-medium text-brand mb-2">Color</p>
        <div className="flex gap-2">
          {colorOptions.map((c) => (
            <button
              key={c.label}
              onClick={() => setColor(c.label)}
              className={
                "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors " +
                (color === c.label ? "border-gold bg-gold-light/20 text-brand" : "border-beige text-ink/70 hover:border-gold")
              }
            >
              <span className="h-3 w-3 rounded-full border border-black/10" style={{ background: c.swatch }} />
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metal purity */}
      <div className="mt-5">
        <p className="text-sm font-medium text-brand mb-2">Metal Purity</p>
        <div className="flex gap-2">
          {purityOptions.map((p) => (
            <button
              key={p}
              onClick={() => setPurity(p)}
              className={
                "rounded-full border px-4 py-1.5 text-sm transition-colors " +
                (purity === p ? "border-gold bg-gold text-brand" : "border-beige text-ink/70 hover:border-gold")
              }
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Size */}
      {sizeOptions.length > 0 && (
        <div className="mt-5">
          <p className="text-sm font-medium text-brand mb-2">Size</p>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="rounded-full border border-beige bg-white px-4 py-2 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-gold"
          >
            {sizeOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button className="ml-3 text-xs text-gold underline hover:text-brand">Size guide</button>
        </div>
      )}

      <div className="mt-6 flex items-center gap-2">
        {inBag ? (
          <Link
            href="/cart"
            className="flex-1 text-center rounded-full bg-brand px-6 py-3 text-sm font-medium text-gold-light hover:bg-brand-secondary transition-colors"
          >
            Added to Bag ✓ — View Bag
          </Link>
        ) : (
          <button
            onClick={() => addItem(slug)}
            className="flex-1 rounded-full bg-brand px-6 py-3 text-sm font-medium text-gold-light hover:bg-brand-secondary transition-colors"
          >
            Add to Bag
          </button>
        )}
        <button
          onClick={() => toggleWishlist(slug)}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={
            "grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-colors " +
            (wishlisted ? "border-gold text-gold bg-gold-light/20" : "border-beige text-ink/60 hover:border-gold hover:text-gold")
          }
        >
          {wishlisted ? "♥" : "♡"}
        </button>
      </div>

      <div className="mt-5">
        <div className="flex items-center gap-2 rounded-full border border-beige bg-white pl-4 pr-1.5 py-1.5 focus-within:border-gold transition-colors">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            className="text-ink/40 shrink-0"
          >
            <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" strokeLinejoin="round" />
            <circle cx="12" cy="9.5" r="2.3" />
          </svg>
          <input
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            placeholder="Enter pincode"
            maxLength={6}
            className="flex-1 bg-transparent text-sm placeholder:text-ink/40 focus:outline-none"
          />
          <button className="rounded-full bg-brand px-4 py-1.5 text-xs font-medium text-gold-light hover:bg-brand-secondary transition-colors whitespace-nowrap">
            Check Delivery
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: "↺", label: "15-day returns", sub: "Easy exchange" },
          { icon: "✓", label: "Hallmarked", sub: "BIS certified" },
          { icon: "♾", label: "Lifetime", sub: "Free maintenance" },
        ].map((t) => (
          <div key={t.label} className="flex items-center gap-2 rounded-lg border border-beige px-3 py-2.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold-light/30 text-gold text-sm">
              {t.icon}
            </span>
            <div>
              <p className="text-xs font-medium text-brand leading-tight">{t.label}</p>
              <p className="text-xs text-ink/50 leading-tight">{t.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="sr-only">{name}</p>
    </div>
  );
}
