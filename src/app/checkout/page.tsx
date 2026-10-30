"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import { CheckoutStepper } from "@/components/CheckoutStepper";
import { dummyProducts, formatRupee, priceToNumber } from "@/lib/dummy-images";
import { useCart } from "@/lib/cart-store";
import { useAdmin } from "@/lib/admin-store";

const countryCodes = ["+91", "+1", "+44", "+971", "+65"];
const countries = ["India", "United States", "United Kingdom", "United Arab Emirates", "Singapore"];

type Address = {
  fullName: string;
  countryCode: string;
  phone: string;
  line1: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
};

// `upi://` links only resolve on a phone, so the deep-link button is for
// touch devices and desktop is pointed at the QR instead.
const TOUCH_QUERY = "(hover: none) and (pointer: coarse)";

function subscribeToPointer(onChange: () => void) {
  const mq = window.matchMedia(TOUCH_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

const isTouchNow = () => window.matchMedia(TOUCH_QUERY).matches;

const emptyAddress: Address = {
  fullName: "",
  countryCode: "+91",
  phone: "",
  line1: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
};

export default function CheckoutPage() {
  const { items: cart, clearCart } = useCart();
  const { settings } = useAdmin();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState<Address>(emptyAddress);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [utrInput, setUtrInput] = useState("");
  const [qr, setQr] = useState({ link: "", dataUrl: "" });
  const [confirmError, setConfirmError] = useState("");
  const [copied, setCopied] = useState(false);
  const isTouchDevice = useSyncExternalStore(subscribeToPointer, isTouchNow, () => false);
  const orderSavedRef = useRef(false);

  const cartItems = cart
    .map((line) => {
      const product = dummyProducts.find((p) => p.slug === line.slug);
      return product ? { product, quantity: line.quantity } : null;
    })
    .filter((i): i is NonNullable<typeof i> => !!i);

  const subtotal = useMemo(
    () => cartItems.reduce((sum, i) => sum + priceToNumber(i.product.price) * i.quantity, 0),
    [cartItems]
  );
  // Never discount below the cart value — a negative amount makes the UPI
  // request invalid and every app rejects it.
  const discount = cartItems.length > 0 ? Math.min(1200, subtotal) : 0;
  const total = Math.max(subtotal - discount, 0);

  // UPI wants a plain two-decimal amount, and handles look like name@bank.
  const upiAmount = total.toFixed(2);
  const upiId = (settings.upiId ?? "").trim();
  const upiIdValid = /^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(upiId);
  const upiPayable = upiIdValid && total > 0;
  const upiLink = upiPayable
    ? `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent("Lakshiraah")}&am=${upiAmount}&cu=INR&tn=${encodeURIComponent(orderId ?? "Jewellery Order")}`
    : "";

  const addressValid =
    address.fullName && address.phone && address.line1 && address.city && address.state && address.pincode;

  // Save order to DB once when moving to step 2
  const saveOrder = async () => {
    if (orderSavedRef.current) return;
    orderSavedRef.current = true;
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: address.fullName,
          phone: `${address.countryCode} ${address.phone}`,
          address: `${address.line1}${address.landmark ? `, near ${address.landmark}` : ""}, ${address.city}, ${address.state} - ${address.pincode}, ${address.country}`,
          items: cartItems.map((i) => ({
            name: i.product.name,
            quantity: i.quantity,
            price: priceToNumber(i.product.price),
          })),
          total,
        }),
      });
      const data = await res.json();
      if (data.orderId) setOrderId(data.orderId);
    } catch {
      // silently ignore — order capture optional
    }
  };

  // Generate the UPI QR when reaching payment. Keyed by the link it encodes,
  // so a stale QR is never shown against a changed amount or UPI ID.
  useEffect(() => {
    if (step !== 2 || !upiLink) return;
    let cancelled = false;
    QRCode.toDataURL(upiLink, { width: 220, margin: 2 })
      .then((dataUrl) => {
        if (!cancelled) setQr({ link: upiLink, dataUrl });
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [step, upiLink]);

  const handleConfirmPayment = async () => {
    setPlacing(true);
    setConfirmError("");
    try {
      if (orderId) {
        // Records the claim against the order; an admin still verifies it.
        const res = await fetch("/api/orders/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, utrNumber: utrInput }),
        });
        if (!res.ok) throw new Error("confirm failed");
      }
      clearCart();
      setPlaced(true);
    } catch {
      setConfirmError(
        "We couldn't record your payment just now. Please try again, or message us on WhatsApp with your payment reference.",
      );
    }
    setPlacing(false);
  };

  if (placed) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-20 text-center">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-gold-light/30 text-3xl text-gold">✓</div>
        <h1 className="font-heading italic text-3xl text-brand mb-2">Order placed!</h1>
        <p className="text-ink/60 text-sm mb-1">Thank you, {address.fullName}!</p>
        <p className="text-ink/60 text-sm">Our team will confirm your order and delivery within 24 hours.</p>
        {orderId && <p className="mt-3 text-xs text-ink/40">Order ID: {orderId}</p>}
        <Link href="/jewellery" className="mt-6 inline-block rounded-full bg-brand px-6 py-3 text-sm font-medium text-gold-light hover:bg-brand-secondary transition-colors">
          Continue shopping
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-20 text-center">
        <p className="text-ink/60 mb-4">Your bag is empty — add something before checking out.</p>
        <Link href="/jewellery" className="rounded-full bg-brand px-6 py-3 text-sm font-medium text-gold-light hover:bg-brand-secondary transition-colors">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading italic text-3xl text-brand">Checkout</h1>
        <span className="flex items-center gap-1.5 text-xs text-ink/50">🔒 Secure checkout</span>
      </div>

      <div className="mb-8">
        <CheckoutStepper current={step} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1 — Address */}
          {step === 1 && (
            <div>
              <h2 className="text-sm font-medium text-brand mb-3">Shipping address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  placeholder="Full name"
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  className="rounded-lg border border-beige px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                />
                <div className="flex gap-2">
                  <select
                    value={address.countryCode}
                    onChange={(e) => setAddress({ ...address, countryCode: e.target.value })}
                    className="rounded-lg border border-beige px-2 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                  >
                    {countryCodes.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input
                    placeholder="Mobile number"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="flex-1 rounded-lg border border-beige px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>
                <input
                  placeholder="Address line (house no., street, area)"
                  value={address.line1}
                  onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                  className="sm:col-span-2 rounded-lg border border-beige px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                />
                <input
                  placeholder="Nearby landmark (optional)"
                  value={address.landmark}
                  onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                  className="sm:col-span-2 rounded-lg border border-beige px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                />
                <input
                  placeholder="City"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="rounded-lg border border-beige px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                />
                <input
                  placeholder="State"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className="rounded-lg border border-beige px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                />
                <input
                  placeholder="Pincode"
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  className="rounded-lg border border-beige px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                />
                <select
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                  className="rounded-lg border border-beige px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                >
                  {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <button
                disabled={!addressValid}
                onClick={async () => { await saveOrder(); setStep(2); }}
                className="mt-5 rounded-full bg-brand px-6 py-3 text-sm font-medium text-gold-light hover:bg-brand-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Continue to payment →
              </button>
            </div>
          )}

          {/* Step 2 — UPI Payment */}
          {step === 2 && (
            <div>
              <h2 className="text-sm font-medium text-brand mb-1">Pay via UPI</h2>
              <p className="text-xs text-ink/50 mb-5">Scan the QR code or click the button to open your UPI app</p>

              <div className="rounded-xl border border-beige bg-white p-6 flex flex-col items-center gap-4 max-w-sm">
                {/* QR Code */}
                {qr.dataUrl && qr.link === upiLink ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={qr.dataUrl} alt="UPI QR Code" className="w-52 h-52 rounded-lg" />
                ) : upiPayable ? (
                  <div className="w-52 h-52 rounded-lg bg-beige animate-pulse" />
                ) : (
                  <div className="w-52 h-52 rounded-lg bg-beige flex items-center justify-center text-xs text-ink/50 text-center p-4">
                    {upiId && !upiIdValid
                      ? "This store's UPI ID looks incorrect, so payment can't be collected right now. Please contact us to complete your order."
                      : "UPI payment isn't set up yet. Please contact us to complete your order."}
                  </div>
                )}

                <div className="text-center">
                  <p className="text-2xl font-semibold text-brand">{formatRupee(total)}</p>
                  {upiIdValid && (
                    <button
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(upiId);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        } catch {
                          // clipboard unavailable — the ID is on screen anyway
                        }
                      }}
                      className="mt-1 text-xs text-ink/60 hover:text-gold transition-colors"
                    >
                      {upiId} {copied ? "· copied ✓" : "· tap to copy"}
                    </button>
                  )}
                </div>

                {/* `upi://` only opens an app on a phone; desktop gets the QR. */}
                {upiPayable && isTouchDevice && (
                  <a
                    href={upiLink}
                    className="w-full rounded-full bg-[#5f259f] text-white text-sm font-medium py-3 text-center hover:bg-[#4a1a80] transition-colors"
                  >
                    📱 Open UPI App to Pay
                  </a>
                )}
                {upiPayable && !isTouchDevice && (
                  <p className="text-center text-xs text-ink/50 leading-relaxed">
                    Scan this QR with any UPI app — GPay, PhonePe, Paytm or your bank app —
                    or copy the UPI ID above and pay {formatRupee(total)} from your phone.
                  </p>
                )}
              </div>

              {/* UTR / reference input */}
              <div className="mt-6 max-w-sm">
                <label className="block text-xs text-ink/60 mb-1">Enter payment reference / UTR number <span className="text-ink/30">(optional)</span></label>
                <input
                  value={utrInput}
                  onChange={(e) => setUtrInput(e.target.value)}
                  placeholder="e.g. 123456789012"
                  className="w-full rounded-lg border border-beige px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                />
                <p className="text-xs text-ink/40 mt-1">Found in your UPI app after payment</p>
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="rounded-full border border-beige px-6 py-3 text-sm text-ink/70 hover:border-gold transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={handleConfirmPayment}
                  disabled={placing}
                  className="rounded-full bg-brand px-6 py-3 text-sm font-medium text-gold-light hover:bg-brand-secondary disabled:opacity-60 transition-colors"
                >
                  {placing ? "Confirming…" : "I've paid — Confirm order ✓"}
                </button>
              </div>
              {confirmError ? (
                <p className="mt-3 text-xs text-red-600 max-w-sm leading-relaxed">{confirmError}</p>
              ) : (
                <p className="mt-3 text-xs text-ink/40">
                  Your order will be verified by our team within 24 hours after payment confirmation.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="rounded-xl border border-beige p-5 h-fit">
          <p className="text-sm font-medium text-brand mb-3">{cartItems.length} item{cartItems.length > 1 ? "s" : ""}</p>
          <div className="space-y-3 mb-4">
            {cartItems.map((item) => (
              <div key={item.product.slug} className="flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden bg-beige border border-beige">
                  <Image src={item.product.image} alt={item.product.name} fill sizes="48px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-ink line-clamp-1">{item.product.name}</p>
                  <p className="text-xs text-ink/50">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-medium text-brand shrink-0">
                  {formatRupee(priceToNumber(item.product.price) * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <dl className="space-y-2 text-sm border-t border-beige pt-3">
            <div className="flex justify-between">
              <dt className="text-ink/60">Subtotal</dt>
              <dd className="text-ink/80">{formatRupee(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-gold">
              <dt>Discount</dt>
              <dd>− {formatRupee(discount)}</dd>
            </div>
            <div className="flex justify-between font-semibold text-brand border-t border-beige pt-2 mt-2">
              <dt>Total</dt>
              <dd className="text-lg">{formatRupee(total)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
