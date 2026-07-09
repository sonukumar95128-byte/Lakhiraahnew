"use client";

import { useEffect, useState } from "react";
import { formatRupee } from "@/lib/dummy-images";
import type { GuestOrder } from "@/app/api/orders/route";

const statusColors: Record<string, string> = {
  pending_payment: "bg-yellow-100 text-yellow-700",
  paid: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

const statusLabels: Record<string, string> = {
  pending_payment: "Pending payment",
  paid: "Paid ✓",
  cancelled: "Cancelled",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<GuestOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending_payment" | "paid" | "cancelled">("all");

  const fetchOrders = () => {
    setLoading(true);
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchOrders();
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {(["all", "pending_payment", "paid", "cancelled"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors " +
              (filter === f ? "bg-brand text-gold-light" : "border border-beige text-ink/60 hover:border-gold")
            }
          >
            {f === "all" ? `All (${orders.length})` : f === "pending_payment" ? `Pending (${orders.filter(o => o.status === "pending_payment").length})` : f === "paid" ? `Paid (${orders.filter(o => o.status === "paid").length})` : `Cancelled (${orders.filter(o => o.status === "cancelled").length})`}
          </button>
        ))}
        <button onClick={fetchOrders} className="ml-auto text-xs text-ink/40 hover:text-brand">↻ Refresh</button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-ink/40">Loading orders…</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-beige bg-white py-16 text-center text-sm text-ink/40">
          No orders yet.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <div key={order.id} className="rounded-xl border border-beige bg-white p-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-brand">{order.id}</span>
                    <span className={"rounded-full px-2 py-0.5 text-xs font-medium " + (statusColors[order.status] ?? "bg-beige text-ink/60")}>
                      {statusLabels[order.status] ?? order.status}
                    </span>
                  </div>
                  <p className="text-sm text-ink/80 font-medium">{order.customerName}</p>
                  <p className="text-xs text-ink/50">{order.phone}</p>
                  <p className="text-xs text-ink/50 mt-0.5">{order.address}</p>
                  {order.utrNumber && (
                    <p className="text-xs text-green-600 mt-1">UTR: {order.utrNumber}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-semibold text-brand">{formatRupee(order.total)}</p>
                  <p className="text-xs text-ink/40">{new Date(order.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                </div>
              </div>

              {/* Items */}
              <div className="mt-3 pt-3 border-t border-beige/60">
                <div className="flex flex-wrap gap-2">
                  {order.items.map((item, i) => (
                    <span key={i} className="rounded-full bg-beige px-2 py-0.5 text-xs text-ink/70">
                      {item.name} × {item.quantity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-3 flex gap-2 flex-wrap">
                {order.status === "pending_payment" && (
                  <>
                    <button
                      onClick={() => updateStatus(order.id, "paid")}
                      className="rounded-full bg-green-600 text-white px-3 py-1.5 text-xs font-medium hover:bg-green-700 transition-colors"
                    >
                      ✓ Mark as Paid
                    </button>
                    <button
                      onClick={() => updateStatus(order.id, "cancelled")}
                      className="rounded-full border border-red-200 text-red-500 px-3 py-1.5 text-xs hover:bg-red-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                )}
                {order.status === "paid" && (
                  <button
                    onClick={() => updateStatus(order.id, "cancelled")}
                    className="rounded-full border border-red-200 text-red-500 px-3 py-1.5 text-xs hover:bg-red-50 transition-colors"
                  >
                    Cancel order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
