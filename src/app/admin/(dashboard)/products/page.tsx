"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useAdmin } from "@/lib/admin-store";
import { categories, priceToNumber, type Category } from "@/lib/dummy-images";
import { BulkUploadButton, BulkUploadPanel } from "@/components/admin/BulkUploadProducts";

type StockFilter = "all" | "in-stock" | "low-stock" | "out-of-stock";
type SortKey = "name" | "price" | "stock";
type SortDir = "asc" | "desc";

function skuFor(slug: string) {
  return slug.toUpperCase().replace(/-/g, "").slice(0, 10);
}

export default function AdminProductsPage() {
  const { products, deleteProduct } = useAdmin();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const filtered = useMemo(() => {
    const result = products.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
      if (stockFilter === "in-stock" && p.stock <= 5) return false;
      if (stockFilter === "low-stock" && !(p.stock > 0 && p.stock <= 5)) return false;
      if (stockFilter === "out-of-stock" && p.stock !== 0) return false;
      return true;
    });

    if (sortKey) {
      result.sort((a, b) => {
        let diff = 0;
        if (sortKey === "name") diff = a.name.localeCompare(b.name);
        if (sortKey === "price") diff = priceToNumber(a.price) - priceToNumber(b.price);
        if (sortKey === "stock") diff = a.stock - b.stock;
        return sortDir === "asc" ? diff : -diff;
      });
    }

    return result;
  }, [products, search, categoryFilter, stockFilter, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortIndicator = (key: SortKey) => {
    if (sortKey !== key) return "↕";
    return sortDir === "asc" ? "↑" : "↓";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3">
        <h1 className="font-heading italic text-3xl text-brand shrink-0">Products</h1>
        <div className="flex items-center gap-3 shrink-0">
          <BulkUploadButton open={bulkUploadOpen} onToggle={() => setBulkUploadOpen((o) => !o)} />
          <Link
            href="/admin/products/new"
            className="rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-gold-light hover:bg-brand-secondary transition-colors whitespace-nowrap"
          >
            + Add product
          </Link>
        </div>
      </div>

      <BulkUploadPanel open={bulkUploadOpen} />

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full max-w-xs rounded-lg border border-beige px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as Category | "all")}
          className="rounded-lg border border-beige px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value as StockFilter)}
          className="rounded-lg border border-beige px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
        >
          <option value="all">All stock levels</option>
          <option value="in-stock">In stock (&gt;5)</option>
          <option value="low-stock">Low stock (1–5)</option>
          <option value="out-of-stock">Out of stock</option>
        </select>

        {(search || categoryFilter !== "all" || stockFilter !== "all") && (
          <button
            onClick={() => {
              setSearch("");
              setCategoryFilter("all");
              setStockFilter("all");
            }}
            className="text-sm text-gold hover:text-brand"
          >
            Clear filters
          </button>
        )}

        <span className="ml-auto text-xs text-ink/40">
          {filtered.length} of {products.length} products
        </span>
      </div>

      <div className="rounded-xl border border-beige bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-beige/50 text-left text-xs text-ink/50">
            <tr>
              <th className="px-4 py-2">
                <button onClick={() => toggleSort("name")} className="flex items-center gap-1 hover:text-brand">
                  Product {sortIndicator("name")}
                </button>
              </th>
              <th className="px-4 py-2">SKU</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">
                <button onClick={() => toggleSort("price")} className="flex items-center gap-1 hover:text-brand">
                  Price {sortIndicator("price")}
                </button>
              </th>
              <th className="px-4 py-2">
                <button onClick={() => toggleSort("stock")} className="flex items-center gap-1 hover:text-brand">
                  Stock {sortIndicator("stock")}
                </button>
              </th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.slug} className="border-t border-beige">
                <td className="px-4 py-2">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 rounded-lg overflow-hidden bg-beige border border-beige">
                      <Image src={p.image} alt={p.name} fill sizes="40px" className="object-cover" />
                    </div>
                    <span className="text-ink line-clamp-1">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-2 text-ink/50 text-xs">{p.sku ?? skuFor(p.slug)}</td>
                <td className="px-4 py-2 text-ink/70">{p.category}</td>
                <td className="px-4 py-2 text-ink/70">{p.price}</td>
                <td className="px-4 py-2">
                  <span className={p.stock === 0 ? "text-red-500" : p.stock <= 5 ? "text-gold" : "text-ink/70"}>
                    {p.stock === 0 ? "Out of stock" : p.stock}
                  </span>
                </td>
                <td className="px-4 py-2 text-right whitespace-nowrap">
                  <Link href={`/admin/products/${p.slug}/edit`} className="text-gold hover:text-brand mr-3">
                    Edit
                  </Link>
                  {confirmDelete === p.slug ? (
                    <span className="inline-flex items-center gap-2">
                      <button onClick={() => deleteProduct(p.slug)} className="text-red-500 hover:underline">
                        Confirm
                      </button>
                      <button onClick={() => setConfirmDelete(null)} className="text-ink/40 hover:underline">
                        Cancel
                      </button>
                    </span>
                  ) : (
                    <button onClick={() => setConfirmDelete(p.slug)} className="text-ink/50 hover:text-red-500">
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink/40">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
