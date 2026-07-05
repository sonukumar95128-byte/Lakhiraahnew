"use client";

import { useAdmin, type CouponType } from "@/lib/admin-store";
import { formatRupee } from "@/lib/dummy-images";

export default function AdminOffersPage() {
  const { coupons, addCoupon, updateCoupon, toggleCoupon, deleteCoupon } = useAdmin();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={addCoupon}
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-gold-light hover:bg-brand-secondary transition-colors"
        >
          + Add coupon
        </button>
      </div>

      <div className="rounded-xl border border-beige bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-beige/50 text-left text-xs text-ink/50">
            <tr>
              <th className="px-4 py-2">Code</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Value</th>
              <th className="px-4 py-2">Min order</th>
              <th className="px-4 py-2">Expires</th>
              <th className="px-4 py-2">Active</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} className="border-t border-beige">
                <td className="px-4 py-2">
                  <input
                    value={c.code}
                    onChange={(e) => updateCoupon(c.id, { code: e.target.value.toUpperCase() })}
                    className="w-28 rounded-lg border border-beige px-2 py-1 text-sm font-medium text-brand uppercase focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </td>
                <td className="px-4 py-2">
                  <select
                    value={c.type}
                    onChange={(e) => updateCoupon(c.id, { type: e.target.value as CouponType })}
                    className="rounded-lg border border-beige px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                  >
                    <option value="percent">% off</option>
                    <option value="flat">Flat ₹ off</option>
                  </select>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={0}
                      value={c.type === "percent" ? c.value : c.value / 100}
                      onChange={(e) =>
                        updateCoupon(c.id, {
                          value: c.type === "percent" ? Number(e.target.value) : Number(e.target.value) * 100,
                        })
                      }
                      className="w-20 rounded-lg border border-beige px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                    />
                    <span className="text-ink/50 text-xs">{c.type === "percent" ? "%" : "₹"}</span>
                  </div>
                </td>
                <td className="px-4 py-2 text-ink/70">
                  {c.minOrderInPaise === 0 ? "No minimum" : formatRupee(c.minOrderInPaise / 100)}
                </td>
                <td className="px-4 py-2">
                  <input
                    type="date"
                    value={c.expiresAt}
                    onChange={(e) => updateCoupon(c.id, { expiresAt: e.target.value })}
                    className="rounded-lg border border-beige px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => toggleCoupon(c.id)}
                    aria-label={c.active ? "Deactivate" : "Activate"}
                    className={"relative h-5 w-9 rounded-full transition-colors " + (c.active ? "bg-gold" : "bg-beige")}
                  >
                    <span
                      className={
                        "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform " +
                        (c.active ? "translate-x-4" : "translate-x-0.5")
                      }
                    />
                  </button>
                </td>
                <td className="px-4 py-2 text-right">
                  <button onClick={() => deleteCoupon(c.id)} className="text-xs text-ink/50 hover:text-red-500">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-ink/40">
                  No coupons yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
