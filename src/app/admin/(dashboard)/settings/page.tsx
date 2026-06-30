"use client";

import { useState } from "react";
import { useAdmin } from "@/lib/admin-store";
import { formatRupee } from "@/lib/dummy-images";

export default function AdminSettingsPage() {
  const { settings, updateSettings } = useAdmin();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading italic text-3xl text-brand">Settings</h1>
        <button
          onClick={handleSave}
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-gold-light hover:bg-brand-secondary transition-colors"
        >
          {saved ? "Saved ✓" : "Save settings"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
        {/* Gold rate */}
        <div className="rounded-xl border border-beige bg-white p-5">
          <h2 className="text-sm font-medium text-brand mb-4">Gold rate</h2>
          <div className="flex items-center gap-2 mb-4">
            {(["auto", "manual"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => updateSettings({ goldRateMode: mode })}
                className={
                  "rounded-full px-4 py-1.5 text-sm capitalize transition-colors " +
                  (settings.goldRateMode === mode
                    ? "bg-gold text-brand"
                    : "border border-beige text-ink/60 hover:border-gold")
                }
              >
                {mode === "auto" ? "Auto (live)" : "Manual"}
              </button>
            ))}
          </div>
          <label className="block text-xs text-ink/50 mb-1">Rate per gram (22kt)</label>
          <div className="flex items-center gap-2">
            <span className="text-ink/50">₹</span>
            <input
              type="number"
              value={settings.goldRatePerGram}
              disabled={settings.goldRateMode === "auto"}
              onChange={(e) => updateSettings({ goldRatePerGram: Number(e.target.value) })}
              className="w-32 rounded-lg border border-beige px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold disabled:opacity-50"
            />
            <span className="text-ink/50 text-sm">/ g</span>
          </div>
          <p className="mt-2 text-xs text-ink/40">
            Currently shown on site: {formatRupee(settings.goldRatePerGram)}/g
          </p>
        </div>

        {/* Announcement bar */}
        <div className="rounded-xl border border-beige bg-white p-5">
          <h2 className="text-sm font-medium text-brand mb-4">Announcement bar</h2>
          <textarea
            value={settings.announcementText}
            onChange={(e) => updateSettings({ announcementText: e.target.value })}
            rows={3}
            className="w-full rounded-lg border border-beige px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
          />
          <p className="mt-2 text-xs text-ink/40">Shown in the dark strip at the very top of every page.</p>
        </div>

        {/* Shipping */}
        <div className="rounded-xl border border-beige bg-white p-5">
          <h2 className="text-sm font-medium text-brand mb-4">Shipping</h2>
          <label className="block text-xs text-ink/50 mb-1">Free shipping threshold</label>
          <div className="flex items-center gap-2">
            <span className="text-ink/50">₹</span>
            <input
              type="number"
              value={settings.freeShippingThresholdInPaise / 100}
              onChange={(e) => updateSettings({ freeShippingThresholdInPaise: Number(e.target.value) * 100 })}
              className="w-32 rounded-lg border border-beige px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>
          <p className="mt-2 text-xs text-ink/40">Orders above this amount ship free; below it, a flat fee applies.</p>
        </div>

        {/* Payments & tax */}
        <div className="rounded-xl border border-beige bg-white p-5">
          <h2 className="text-sm font-medium text-brand mb-4">Payments &amp; tax</h2>
          <div className="space-y-2 mb-4">
            {(
              [
                ["upi", "UPI"],
                ["card", "Credit / Debit card"],
                ["netbanking", "Net banking"],
                ["cod", "Cash on delivery"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-ink/70">{label}</span>
                <button
                  onClick={() =>
                    updateSettings({
                      paymentMethods: { ...settings.paymentMethods, [key]: !settings.paymentMethods[key] },
                    })
                  }
                  className={
                    "relative h-5 w-9 rounded-full transition-colors " +
                    (settings.paymentMethods[key] ? "bg-gold" : "bg-beige")
                  }
                >
                  <span
                    className={
                      "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform " +
                      (settings.paymentMethods[key] ? "translate-x-4" : "translate-x-0.5")
                    }
                  />
                </button>
              </div>
            ))}
          </div>
          <label className="block text-xs text-ink/50 mb-1">GST on gold</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={settings.gstPercent}
              onChange={(e) => updateSettings({ gstPercent: Number(e.target.value) })}
              className="w-20 rounded-lg border border-beige px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
            />
            <span className="text-ink/50 text-sm">%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
