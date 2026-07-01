"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import Link from "next/link";
import { CheckoutStepper } from "@/components/CheckoutStepper";
import { dummyProducts, formatRupee, priceToNumber } from "@/lib/dummy-images";
import { buildWhatsAppOrderUrl } from "@/lib/whatsapp-order";
import { useCart } from "@/lib/cart-store";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: new (options: Record<string, unknown>) => { open(): void };
  }
}

const paymentMethods = [
  { id: "upi", label: "UPI / GPay / PhonePe" },
  { id: "card", label: "Credit / Debit card" },
  { id: "netbanking", label: "Net banking · EMI" },
  { id: "cod", label: "Cash on delivery" },
];

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
  const { items: cart } = useCart();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState<Address>(emptyAddress);
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0].id);
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);

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
  const discount = cartItems.length > 0 ? 1200 : 0;
  const total = subtotal - discount;

  const addressValid =
    address.fullName && address.phone && address.line1 && address.city && address.state && address.pincode;

  const handleOrderViaWhatsApp = () => {
    const url = buildWhatsAppOrderUrl({
      items: cartItems.map((i) => ({
        name: i.product.name,
        quantity: i.quantity,
        lineTotal: priceToNumber(i.product.price) * i.quantity,
      })),
      subtotal,
      discount,
      total,
      address,
    });
    window.open(url, "_blank", "noopener,noreferrer");
    setPlaced(true);
  };

  const handleRazorpayPayment = async () => {
    setPlacing(true);
    try {
      // Load Razorpay checkout script dynamically
      if (!window.Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load Razorpay"));
          document.body.appendChild(script);
        });
      }

      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountInPaise: total * 100, receipt: `order_${Date.now()}` }),
      });

      if (!res.ok) throw new Error("create-order failed");
      const { orderId, amount, currency, keyId } = await res.json();

      const rzp = new window.Razorpay({
        key: keyId,
        amount,
        currency,
        order_id: orderId,
        name: "Lakshiraah",
        description: "Jewellery order",
        image: "/logo.png",
        prefill: {
          name: address.fullName,
          contact: `${address.countryCode}${address.phone}`,
        },
        theme: { color: "#d4a24c" },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          const verify = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          if (verify.ok) {
            setPlaced(true);
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        modal: { ondismiss: () => setPlacing(false) },
      });
      rzp.open();
    } catch {
      // Razorpay not configured — fall back to WhatsApp
      handleOrderViaWhatsApp();
    }
    setPlacing(false);
  };

  if (placed) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-20 text-center">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-gold-light/30 text-3xl text-gold">
          ✓
        </div>
        <h1 className="font-heading italic text-3xl text-brand mb-2">Order placed!</h1>
        <p className="text-ink/60 text-sm">
          Thank you for your order. Our team will confirm your order and delivery within 24 hours.
        </p>
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
        <Link
          href="/jewellery"
          className="rounded-full bg-brand px-6 py-3 text-sm font-medium text-gold-light hover:bg-brand-secondary transition-colors"
        >
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
                    {countryCodes.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
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
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <button
                disabled={!addressValid}
                onClick={() => setStep(2)}
                className="mt-5 rounded-full bg-brand px-6 py-3 text-sm font-medium text-gold-light hover:bg-brand-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Continue to payment
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-sm font-medium text-brand mb-3">Payment method</h2>
              <div className="space-y-2">
                {paymentMethods.map((m) => (
                  <label
                    key={m.id}
                    className={
                      "flex items-center gap-3 rounded-lg border px-4 py-3 text-sm cursor-pointer transition-colors " +
                      (paymentMethod === m.id ? "border-gold bg-gold-light/10" : "border-beige hover:border-gold")
                    }
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === m.id}
                      onChange={() => setPaymentMethod(m.id)}
                      className="accent-gold"
                    />
                    {m.label}
                  </label>
                ))}
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="rounded-full border border-beige px-6 py-3 text-sm text-ink/70 hover:border-gold transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="rounded-full bg-brand px-6 py-3 text-sm font-medium text-gold-light hover:bg-brand-secondary transition-colors"
                >
                  Review order
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-sm font-medium text-brand mb-3">Review your order</h2>

              <div className="rounded-lg border border-beige p-4 mb-4">
                <p className="text-xs text-ink/50 mb-1">Shipping to</p>
                <p className="text-sm text-ink/80">
                  {address.fullName} · {address.countryCode} {address.phone}
                </p>
                <p className="text-sm text-ink/80">
                  {address.line1}
                  {address.landmark && `, near ${address.landmark}`}
                </p>
                <p className="text-sm text-ink/80">
                  {address.city}, {address.state} — {address.pincode}, {address.country}
                </p>
                <button onClick={() => setStep(1)} className="mt-2 text-xs text-gold underline hover:text-brand">
                  Edit address
                </button>
              </div>

              <div className="rounded-lg border border-beige p-4 mb-4">
                <p className="text-xs text-ink/50 mb-1">Payment method</p>
                <p className="text-sm text-ink/80">{paymentMethods.find((m) => m.id === paymentMethod)?.label}</p>
                <button onClick={() => setStep(2)} className="mt-2 text-xs text-gold underline hover:text-brand">
                  Change payment method
                </button>
              </div>

              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.product.slug} className="flex items-center gap-3">
                    <div className="relative h-14 w-14 shrink-0 rounded-lg overflow-hidden bg-beige border border-beige">
                      <Image src={item.product.image} alt={item.product.name} fill sizes="56px" className="object-cover" />
                    </div>
                    <p className="flex-1 text-sm text-ink line-clamp-1">{item.product.name}</p>
                    <p className="text-sm font-medium text-brand">
                      {formatRupee(priceToNumber(item.product.price) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={handleRazorpayPayment}
                disabled={placing}
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-gold-light hover:bg-brand-secondary disabled:opacity-60 transition-colors"
              >
                🔒 {placing ? "Please wait…" : `Pay · ${formatRupee(total)}`}
              </button>

              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 border-t border-beige" />
                <span className="text-xs text-ink/40">or</span>
                <div className="flex-1 border-t border-beige" />
              </div>

              <button
                onClick={handleOrderViaWhatsApp}
                disabled={placing}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-[#25D366] px-6 py-2.5 text-sm font-medium text-[#25D366] hover:bg-[#25D366]/5 disabled:opacity-60 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.5 14.4c-.3-.1-1.7-.8-2-1-.3-.1-.5-.1-.6.1-.2.3-.7 1-.9 1.1-.2.1-.3.1-.6 0-1.6-.7-2.6-1.4-3.7-3.1-.3-.4 0-.4.2-.7.1-.2.2-.3.3-.5.1-.2 0-.3 0-.4-.1-.1-.6-1.5-.9-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.4-.2.3-.9 1-.9 2.3 0 1.3 1 2.6 1.1 2.8.1.2 1.9 3 4.7 4.1 2.3.9 2.8.7 3.3.7.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.3-.1-.5-.2z" />
                  <path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.4c1.4.7 3.1 1.1 4.8 1.1 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3C4 14.9 3.6 13.5 3.6 12c0-4.6 3.8-8.4 8.4-8.4s8.4 3.8 8.4 8.4-3.8 8.2-8.4 8.2z" />
                </svg>
                Order via WhatsApp instead
              </button>
              <p className="mt-2 text-xs text-ink/40 text-center">By placing this order you agree to our terms.</p>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="rounded-xl border border-beige p-5 h-fit">
          <p className="text-sm font-medium text-brand mb-3">{cartItems.length} items</p>
          <div className="flex gap-2 mb-4">
            {cartItems.map((item) => (
              <div key={item.product.slug} className="relative h-14 w-14 rounded-lg overflow-hidden bg-beige border border-beige">
                <Image src={item.product.image} alt={item.product.name} fill sizes="56px" className="object-cover" />
              </div>
            ))}
          </div>

          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink/60">Subtotal</dt>
              <dd className="text-ink/80">{formatRupee(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-gold">
              <dt>Discount</dt>
              <dd>− {formatRupee(discount)}</dd>
            </div>
          </dl>
          <div className="border-t border-beige mt-3 pt-3 flex justify-between">
            <span className="font-medium text-brand">Total</span>
            <span className="font-semibold text-brand text-lg">{formatRupee(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
