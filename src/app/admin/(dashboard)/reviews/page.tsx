"use client";

import { useState } from "react";
import { useAdmin, type TestimonialStatus } from "@/lib/admin-store";

const statusStyles: Record<TestimonialStatus, string> = {
  pending: "bg-beige text-ink/70",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-600",
};

export default function AdminProductReviewsPage() {
  const { productReviews, products, setProductReviewStatus, deleteProductReview } = useAdmin();
  const [filter, setFilter] = useState<"all" | TestimonialStatus>("all");

  const filtered = productReviews.filter((r) => filter === "all" || r.status === filter);
  const productName = (slug: string) => products.find((p) => p.slug === slug)?.name ?? slug;

  return (
    <div>
      <h1 className="font-heading italic text-3xl text-brand mb-6">Product Reviews</h1>

      <div className="flex items-center gap-2 mb-4">
        {(["all", "pending", "approved", "rejected"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={
              "rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors " +
              (filter === f ? "bg-brand text-gold-light" : "border border-beige text-ink/60 hover:border-gold")
            }
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((r) => (
          <div key={r.id} className="rounded-xl border border-beige bg-white p-4">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-sm font-medium text-brand">{r.name}</span>
              <span className="text-gold text-xs">
                {"★".repeat(r.rating)}
                {"☆".repeat(5 - r.rating)}
              </span>
              <span className={"rounded-full px-2 py-0.5 text-xs capitalize " + statusStyles[r.status]}>
                {r.status}
              </span>
              <span className="text-xs text-ink/40">{r.createdAt}</span>
            </div>
            <p className="text-xs text-ink/50 mb-2">On: {productName(r.productSlug)}</p>
            <p className="text-sm text-ink/70 mb-3">{r.text}</p>

            <div className="flex items-center gap-3 text-xs">
              {r.status !== "approved" && (
                <button onClick={() => setProductReviewStatus(r.id, "approved")} className="text-green-600 hover:underline">
                  Approve
                </button>
              )}
              {r.status !== "rejected" && (
                <button onClick={() => setProductReviewStatus(r.id, "rejected")} className="text-red-500 hover:underline">
                  Reject
                </button>
              )}
              <button onClick={() => deleteProductReview(r.id)} className="text-ink/40 hover:text-red-500">
                Delete
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="rounded-xl border border-dashed border-beige bg-white p-8 text-center text-sm text-ink/40">
            No reviews in this filter.
          </p>
        )}
      </div>
    </div>
  );
}
