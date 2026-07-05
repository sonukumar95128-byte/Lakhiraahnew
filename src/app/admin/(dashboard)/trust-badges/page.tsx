"use client";

import { useAdmin } from "@/lib/admin-store";

const ICONS = ["✓", "🚚", "↺", "♾", "🎁", "🔒", "⭐", "💎", "🏆", "✨", "🌿", "📦"];

export default function TrustBadgesPage() {
  const { trustBadges, updateTrustBadge, toggleTrustBadge } = useAdmin();

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm text-ink/50 mt-0.5">Shown on homepage in the dark banner strip · toggle to show/hide</p>
      </div>

      <div className="space-y-3 max-w-xl">
        {trustBadges.map((badge) => (
          <div key={badge.id} className="rounded-xl border border-beige bg-white p-4 flex items-center gap-4">
            {/* Icon picker */}
            <div className="relative group">
              <div className="h-12 w-12 rounded-full bg-brand flex items-center justify-center text-2xl cursor-pointer select-none">
                {badge.icon}
              </div>
              <div className="absolute top-full left-0 mt-1 z-10 hidden group-hover:grid grid-cols-6 gap-1 bg-white border border-beige rounded-xl p-2 shadow-lg w-44">
                {ICONS.map((ic) => (
                  <button
                    key={ic}
                    onClick={() => updateTrustBadge(badge.id, { icon: ic })}
                    className={"h-8 w-8 rounded-lg text-lg flex items-center justify-center hover:bg-beige " + (badge.icon === ic ? "bg-gold-light/40" : "")}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>

            {/* Text fields */}
            <div className="flex-1 space-y-1.5">
              <input
                value={badge.label}
                onChange={(e) => updateTrustBadge(badge.id, { label: e.target.value })}
                placeholder="Badge title"
                className="w-full rounded-lg border border-beige px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-gold"
              />
              <input
                value={badge.sub}
                onChange={(e) => updateTrustBadge(badge.id, { sub: e.target.value })}
                placeholder="Subtitle (e.g. BIS certified)"
                className="w-full rounded-lg border border-beige px-3 py-1.5 text-xs text-ink/60 focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>

            {/* Toggle */}
            <button
              onClick={() => toggleTrustBadge(badge.id)}
              aria-label={badge.enabled ? "Hide badge" : "Show badge"}
              className={"relative h-5 w-9 rounded-full transition-colors shrink-0 " + (badge.enabled ? "bg-gold" : "bg-beige")}
            >
              <span className={"absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform " + (badge.enabled ? "translate-x-4" : "translate-x-0.5")} />
            </button>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-ink/40">Hover the icon to change it · changes save automatically</p>
    </div>
  );
}
