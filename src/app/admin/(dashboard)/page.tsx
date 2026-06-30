"use client";

import Link from "next/link";
import { useAdmin } from "@/lib/admin-store";
import { formatRupee } from "@/lib/dummy-images";

export default function AdminDashboardPage() {
  const { products, orders } = useAdmin();

  const lowStock = products.filter((p) => p.stock <= 5);
  const totalRevenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.totalInPaise, 0);
  const pendingOrders = orders.filter((o) => o.status === "Pending" || o.status === "Paid").length;

  const stats = [
    { label: "Products", value: products.length, href: "/admin/products" },
    { label: "Orders", value: orders.length, href: "/admin/orders" },
    { label: "Pending fulfillment", value: pendingOrders, href: "/admin/orders" },
    { label: "Revenue (demo)", value: formatRupee(Math.round(totalRevenue / 100)), href: "/admin/orders" },
  ];

  return (
    <div>
      <h1 className="font-heading italic text-3xl text-brand mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-xl border border-beige bg-white p-4 hover:border-gold transition-colors"
          >
            <p className="text-xs text-ink/50">{s.label}</p>
            <p className="mt-1 text-2xl font-semibold text-brand">{s.value}</p>
          </Link>
        ))}
      </div>

      {lowStock.length > 0 && (
        <div className="mb-8 rounded-xl border border-gold/40 bg-gold-light/10 p-4">
          <p className="text-sm font-medium text-brand mb-2">⚠ Low stock ({lowStock.length})</p>
          <ul className="text-sm text-ink/70 space-y-1">
            {lowStock.map((p) => (
              <li key={p.slug} className="flex justify-between">
                <Link href={`/admin/products/${p.slug}/edit`} className="hover:text-gold">
                  {p.name}
                </Link>
                <span>{p.stock} left</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h2 className="text-sm font-medium text-brand mb-3">Recent orders</h2>
        <div className="rounded-xl border border-beige bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-beige/50 text-left text-xs text-ink/50">
              <tr>
                <th className="px-4 py-2">Order</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((o) => (
                <tr key={o.id} className="border-t border-beige">
                  <td className="px-4 py-2">
                    <Link href="/admin/orders" className="text-gold hover:text-brand">
                      #{o.id}
                    </Link>
                  </td>
                  <td className="px-4 py-2">{o.customerName}</td>
                  <td className="px-4 py-2">{o.status}</td>
                  <td className="px-4 py-2 text-right">{formatRupee(Math.round(o.totalInPaise / 100))}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-ink/40">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
