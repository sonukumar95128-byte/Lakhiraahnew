"use client";

import { useState, useMemo } from "react";
import { useAdmin } from "@/lib/admin-store";
import { priceToNumber } from "@/lib/dummy-images";

function formatPrice(n: number): string {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

export default function BulkPricingPage() {
  const { products, updateProduct } = useAdmin();

  const categories = useMemo(() => Array.from(new Set(products.map((p) => p.category))).sort(), [products]);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [adjustMode, setAdjustMode] = useState<"percent" | "flat">("percent");
  const [adjustValue, setAdjustValue] = useState("");
  const [adjustDir, setAdjustDir] = useState<"increase" | "decrease">("increase");
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState(false);

  const filtered = products.filter((p) => {
    const matchCat = selectedCategory === "all" || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const applyBulk = () => {
    const val = parseFloat(adjustValue);
    if (!val || val <= 0) return;

    filtered.forEach((p) => {
      const current = priceToNumber(p.price);
      let newPrice: number;
      if (adjustMode === "percent") {
        newPrice = adjustDir === "increase" ? current * (1 + val / 100) : current * (1 - val / 100);
      } else {
        newPrice = adjustDir === "increase" ? current + val : current - val;
      }
      newPrice = Math.max(1, newPrice);
      updateProduct(p.slug, { price: formatPrice(newPrice) });
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setAdjustValue("");
  };

  const handleIndividualPrice = (slug: string, raw: string) => {
    const num = Number(raw.replace(/[^0-9]/g, ""));
    if (!num) return;
    updateProduct(slug, { price: formatPrice(num) });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading italic text-3xl text-brand">Bulk Pricing</h1>
        <p className="text-sm text-ink/50 mt-0.5">Update prices for all or selected jewellery at once</p>
      </div>

      {/* Bulk update card */}
      <div className="rounded-xl border border-beige bg-white p-5 mb-6 max-w-2xl">
        <h2 className="text-sm font-semibold text-brand mb-4">Bulk Price Adjustment</h2>

        {/* Category filter */}
        <div className="mb-4">
          <label className="text-xs text-ink/60 mb-1.5 block">Apply to category</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={"rounded-full px-3 py-1 text-xs font-medium transition-colors " +
                (selectedCategory === "all" ? "bg-brand text-gold-light" : "border border-beige text-ink/60 hover:border-gold")}
            >All categories</button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={"rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors " +
                  (selectedCategory === c ? "bg-brand text-gold-light" : "border border-beige text-ink/60 hover:border-gold")}
              >{c}</button>
            ))}
          </div>
        </div>

        {/* Increase / decrease */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setAdjustDir("increase")}
            className={"flex-1 rounded-lg border py-2 text-sm font-medium transition-colors " +
              (adjustDir === "increase" ? "border-green-400 bg-green-50 text-green-700" : "border-beige text-ink/50 hover:border-gold")}
          >↑ Increase</button>
          <button
            onClick={() => setAdjustDir("decrease")}
            className={"flex-1 rounded-lg border py-2 text-sm font-medium transition-colors " +
              (adjustDir === "decrease" ? "border-red-400 bg-red-50 text-red-600" : "border-beige text-ink/50 hover:border-gold")}
          >↓ Decrease</button>
        </div>

        {/* Mode + value */}
        <div className="flex gap-3 mb-4">
          <div className="flex rounded-lg border border-beige overflow-hidden">
            <button
              onClick={() => setAdjustMode("percent")}
              className={"px-3 py-2 text-sm transition-colors " + (adjustMode === "percent" ? "bg-brand text-gold-light" : "text-ink/60 hover:bg-beige")}
            >%</button>
            <button
              onClick={() => setAdjustMode("flat")}
              className={"px-3 py-2 text-sm transition-colors " + (adjustMode === "flat" ? "bg-brand text-gold-light" : "text-ink/60 hover:bg-beige")}
            >₹</button>
          </div>
          <input
            type="number"
            min="0"
            value={adjustValue}
            onChange={(e) => setAdjustValue(e.target.value)}
            placeholder={adjustMode === "percent" ? "e.g. 10 (for 10%)" : "e.g. 500 (₹500)"}
            className="flex-1 rounded-lg border border-beige px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={applyBulk}
            disabled={!adjustValue}
            className="rounded-full bg-brand px-6 py-2 text-sm font-medium text-gold-light hover:bg-brand-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Apply to {filtered.length} product{filtered.length !== 1 ? "s" : ""}
          </button>
          {saved && <span className="text-sm text-green-600 font-medium">✓ Prices updated!</span>}
        </div>
      </div>

      {/* Individual product prices */}
      <div className="rounded-xl border border-beige bg-white overflow-hidden">
        <div className="px-4 py-3 border-b border-beige flex items-center gap-3">
          <h2 className="text-sm font-semibold text-brand flex-1">Individual Prices</h2>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search product..."
            className="rounded-lg border border-beige px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold w-48"
          />
        </div>

        <div className="divide-y divide-beige max-h-[520px] overflow-y-auto">
          {filtered.map((p) => (
            <div key={p.slug} className="flex items-center gap-3 px-4 py-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-cover shrink-0 bg-beige" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-brand truncate">{p.name}</p>
                <p className="text-xs text-ink/40 capitalize">{p.category}{p.sku ? <span className="ml-2 font-mono text-ink/30">#{p.sku}</span> : <span className="ml-2 font-mono text-ink/30">#{p.slug.slice(0, 10)}</span>}</p>
              </div>
              <input
                type="text"
                defaultValue={p.price.replace("₹", "").replace(/,/g, "")}
                onBlur={(e) => handleIndividualPrice(p.slug, e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
                className="w-28 rounded-lg border border-beige px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-1 focus:ring-gold"
              />
              <span className="text-xs text-ink/40 w-4">₹</span>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="py-8 text-center text-sm text-ink/40">No products match.</p>
          )}
        </div>
      </div>
    </div>
  );
}
