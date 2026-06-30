"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { categoryToSlug, dummyProducts, formatRupee, priceToNumber } from "@/lib/dummy-images";
import { useCart } from "@/lib/cart-store";

const VALID_COUPONS: Record<string, number> = {
  JB50: 0.08,
  DAZZLING20: 0.05,
};

export default function CartPage() {
  const { items: cart, addItem, removeItem: removeFromCart, updateQuantity } = useCart();
  const [savedForLater, setSavedForLater] = useState<string[]>([]);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState("");

  const items = cart
    .map((line) => {
      const product = dummyProducts.find((p) => p.slug === line.slug);
      return product ? { ...line, product } : null;
    })
    .filter((i): i is NonNullable<typeof i> => !!i);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + priceToNumber(i.product.price) * i.quantity, 0),
    [items]
  );

  const discount = appliedCoupon ? Math.round(subtotal * VALID_COUPONS[appliedCoupon]) : 0;
  const shipping = subtotal > 0 && subtotal < 999 ? 99 : 0;
  const total = subtotal - discount + shipping;

  const removeItem = (slug: string) => {
    removeFromCart(slug);
  };

  const saveForLater = (slug: string) => {
    setSavedForLater((prev) => [...prev, slug]);
    removeItem(slug);
  };

  const moveBackToCart = (slug: string) => {
    setSavedForLater((prev) => prev.filter((s) => s !== slug));
    addItem(slug);
  };

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    if (VALID_COUPONS[code]) {
      setAppliedCoupon(code);
      setCouponError("");
    } else {
      setAppliedCoupon(null);
      setCouponError("Invalid coupon code");
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <div className="flex items-baseline justify-between mb-6">
        <h1 className="font-heading italic text-3xl text-brand">Your Bag</h1>
        <span className="text-sm text-ink/50">({items.length} items)</span>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-ink/60 mb-4">Your bag is empty.</p>
          <Link href="/jewellery" className="rounded-full bg-brand px-6 py-3 text-sm font-medium text-gold-light hover:bg-brand-secondary transition-colors">
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-5">
            {items.map((item) => (
              <div key={item.slug} className="flex gap-4 border-b border-beige pb-5">
                <Link
                  href={`/jewellery/${categoryToSlug(item.product.category)}/${item.product.slug}`}
                  className="relative h-24 w-24 shrink-0 rounded-lg overflow-hidden bg-beige border border-beige"
                >
                  <Image src={item.product.image} alt={item.product.name} fill sizes="96px" className="object-cover" />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link
                    href={`/jewellery/${categoryToSlug(item.product.category)}/${item.product.slug}`}
                    className="text-sm text-ink hover:text-gold line-clamp-1"
                  >
                    {item.product.name}
                  </Link>

                  <div className="mt-2 inline-flex items-center rounded-full border border-beige">
                    <button
                      onClick={() => updateQuantity(item.slug, -1)}
                      className="px-3 py-1 text-ink/70 hover:text-gold"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.slug, 1)}
                      className="px-3 py-1 text-ink/70 hover:text-gold"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <div className="mt-2 flex items-center gap-3 text-xs">
                    <button onClick={() => saveForLater(item.slug)} className="text-ink/50 hover:text-gold">
                      Save for later
                    </button>
                    <span className="text-ink/30">·</span>
                    <button onClick={() => removeItem(item.slug)} className="text-ink/50 hover:text-gold">
                      Remove
                    </button>
                  </div>
                </div>

                <p className="text-sm font-medium text-brand shrink-0">
                  {formatRupee(priceToNumber(item.product.price) * item.quantity)}
                </p>
              </div>
            ))}

            {/* Coupon */}
            <div className="flex items-center gap-2 rounded-full border border-dashed border-beige pl-4 pr-1.5 py-1.5">
              <input
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Coupon code"
                className="flex-1 bg-transparent text-sm placeholder:text-ink/40 focus:outline-none"
              />
              <button
                onClick={applyCoupon}
                className="rounded-full bg-gold px-4 py-1.5 text-xs font-medium text-brand hover:bg-gold-light transition-colors"
              >
                Apply
              </button>
            </div>
            {couponError && <p className="text-xs text-red-500">{couponError}</p>}
            {appliedCoupon && (
              <p className="text-xs text-gold">
                Coupon {appliedCoupon} applied — you saved {formatRupee(discount)}
              </p>
            )}

            {savedForLater.length > 0 && (
              <div className="pt-4">
                <h2 className="text-sm font-medium text-brand mb-3">Saved for later</h2>
                <div className="space-y-3">
                  {savedForLater.map((slug) => {
                    const product = dummyProducts.find((p) => p.slug === slug);
                    if (!product) return null;
                    return (
                      <div key={slug} className="flex items-center gap-4 border-b border-beige pb-3">
                        <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden bg-beige border border-beige">
                          <Image src={product.image} alt={product.name} fill sizes="64px" className="object-cover" />
                        </div>
                        <p className="flex-1 text-sm text-ink line-clamp-1">{product.name}</p>
                        <p className="text-sm font-medium text-brand">{product.price}</p>
                        <button
                          onClick={() => moveBackToCart(slug)}
                          className="text-xs text-gold hover:text-brand underline"
                        >
                          Move to bag
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Order summary */}
          <div className="rounded-xl border border-beige p-5 h-fit sticky top-24">
            <h2 className="font-heading text-xl text-brand mb-4">Order Summary</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink/60">Subtotal</dt>
                <dd className="text-ink/80">{formatRupee(subtotal)}</dd>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-gold">
                  <dt>Discount ({appliedCoupon})</dt>
                  <dd>− {formatRupee(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-ink/60">Shipping</dt>
                <dd className="text-ink/80">{shipping === 0 ? "Free" : formatRupee(shipping)}</dd>
              </div>
            </dl>
            <div className="border-t border-beige mt-3 pt-3 flex justify-between">
              <span className="font-medium text-brand">Total</span>
              <span className="font-semibold text-brand text-lg">{formatRupee(total)}</span>
            </div>

            <Link
              href="/checkout"
              className="mt-5 block text-center rounded-full bg-brand px-6 py-3 text-sm font-medium text-gold-light hover:bg-brand-secondary transition-colors"
            >
              Proceed to checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
