"use client";

import { useEffect, useState } from "react";

const KEY = "lk_recently_viewed";
const MAX = 8;

export function trackRecentlyViewed(slug: string) {
  try {
    const stored = JSON.parse(localStorage.getItem(KEY) ?? "[]") as string[];
    const filtered = stored.filter((s) => s !== slug);
    const updated = [slug, ...filtered].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(updated));
  } catch {}
}

export function useRecentlyViewed(excludeSlug?: string): string[] {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(KEY) ?? "[]") as string[];
      setSlugs(excludeSlug ? stored.filter((s) => s !== excludeSlug) : stored);
    } catch {
      setSlugs([]);
    }
  }, [excludeSlug]);

  return slugs;
}
