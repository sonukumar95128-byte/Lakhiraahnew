"use client";

import { useAdmin } from "@/lib/admin-store";
import { orderStatuses, type OrderStatus } from "@/lib/dummy-orders";
import { formatRupee } from "@/lib/dummy-images";

const statusColors: Record<OrderStatus, string> = {
  Pending: "bg-beige text-ink/70",
  Paid: "bg-gold-light/40 text-brand",
  Packed: "bg-gold-light/40 text-brand",
  Shipped: "bg-brand text-gold-light",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-600",
};

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useAdmin();

  return (
    <div>
      <h1 className="font-heading italic text-3xl text-brand mb-6">Orders</h1>

      <div className="rounded-xl border border-beige bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-beige/50 text-left text-xs text-ink/50">
            <tr>
              <th className="px-4 py-2">Order</th>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2">Items</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2 text-right">Total</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-beige align-top">
                <td className="px-4 py-3 font-medium text-brand">#{o.id}</td>
                <td className="px-4 py-3">
                  <p className="text-ink">{o.customerName}</p>
                  <p className="text-xs text-ink/40">{o.customerPhone}</p>
                </td>
                <td className="px-4 py-3 text-ink/70">
                  {o.items.map((i) => (
                    <p key={i.slug}>
                      {i.name} × {i.quantity}
                    </p>
                  ))}
                </td>
                <td className="px-4 py-3 text-ink/60">{o.createdAt}</td>
                <td className="px-4 py-3 text-right font-medium text-brand">
                  {formatRupee(Math.round(o.totalInPaise / 100))}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={o.status}
                    onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                    className={
                      "rounded-full px-2.5 py-1 text-xs font-medium border-0 focus:outline-none focus:ring-1 focus:ring-gold " +
                      statusColors[o.status]
                    }
                  >
                    {orderStatuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink/40">
                  No orders yet — they&apos;ll appear here once customers start checking out.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
