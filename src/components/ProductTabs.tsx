"use client";

import { useState } from "react";
import { useAdmin } from "@/lib/admin-store";

type ProductTabsProps = {
  productSlug: string;
  description: string;
  rating: number;
  reviewCount: number;
  attributes?: Record<string, string>;
};

const tabs = ["Description", "Specifications", "Reviews"] as const;

const fallbackSpecs: [string, string][] = [
  ["Material", "Gold-plated brass / 14k gold"],
  ["Plating", "Tarnish-resistant"],
  ["Closure", "Secure clasp"],
  ["Care", "Avoid water & perfume contact"],
];

export function ProductTabs({ productSlug, description, rating, reviewCount, attributes }: ProductTabsProps) {
  const [active, setActive] = useState<(typeof tabs)[number]>("Description");
  const { getApprovedReviews, addProductReview } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  const approvedReviews = getApprovedReviews(productSlug);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !text) return;
    addProductReview({ productSlug, name, rating: reviewRating, text });
    setName("");
    setText("");
    setReviewRating(5);
    setShowForm(false);
    setSubmitted(true);
  };

  return (
    <div>
      <div className="flex gap-6 border-b border-beige">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActive(t)}
            className={
              "pb-3 text-sm font-medium border-b-2 -mb-px transition-colors " +
              (active === t ? "border-gold text-brand" : "border-transparent text-ink/50 hover:text-brand")
            }
          >
            {t}
          </button>
        ))}
      </div>

      <div className="pt-5 text-sm text-ink/70 leading-relaxed">
        {active === "Description" && <p>{description}</p>}

        {active === "Specifications" && (
          <table className="w-full text-left">
            <tbody>
              {(attributes && Object.keys(attributes).length > 0
                ? Object.entries(attributes)
                : fallbackSpecs
              ).map(([k, v]) => (
                <tr key={k} className="border-b border-beige last:border-0">
                  <td className="py-2 pr-4 font-medium text-brand">{k}</td>
                  <td className="py-2">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {active === "Reviews" && (
          <div>
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
              <p>
                ★ {rating.toFixed(1)} average · {reviewCount} reviews
              </p>
              <button
                onClick={() => setShowForm((s) => !s)}
                className="rounded-full border border-gold px-4 py-1.5 text-xs text-brand hover:bg-gold-light/20 transition-colors"
              >
                {showForm ? "Cancel" : "Write a review"}
              </button>
            </div>

            {submitted && (
              <p className="mb-4 rounded-lg bg-gold-light/20 px-3 py-2 text-xs text-brand">
                Thanks! Your review has been submitted and will appear once approved.
              </p>
            )}

            {showForm && (
              <form onSubmit={handleSubmit} className="mb-6 rounded-lg border border-beige p-4 space-y-3 max-w-md">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="w-full rounded-lg border border-beige px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                />
                <div className="flex items-center gap-2">
                  <label className="text-xs text-ink/60">Rating</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="rounded-lg border border-beige px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>
                        {r} ★
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Share your experience with this product..."
                  rows={3}
                  required
                  className="w-full rounded-lg border border-beige px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                />
                <button
                  type="submit"
                  className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-gold-light hover:bg-brand-secondary transition-colors"
                >
                  Submit review
                </button>
              </form>
            )}

            {approvedReviews.length > 0 ? (
              <div className="space-y-4">
                {approvedReviews.map((r) => (
                  <div key={r.id} className="border-b border-beige pb-4 last:border-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-gold text-xs">
                        {"★".repeat(r.rating)}
                        {"☆".repeat(5 - r.rating)}
                      </span>
                      <span className="text-sm font-medium text-brand">{r.name}</span>
                      <span className="text-xs text-ink/40">{r.createdAt}</span>
                    </div>
                    <p className="text-sm text-ink/70">{r.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No reviews yet for this product — be the first to write one.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
