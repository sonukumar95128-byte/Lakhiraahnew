"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type WishlistContextValue = {
  slugs: string[];
  isWishlisted: (slug: string) => boolean;
  toggleWishlist: (slug: string) => void;
  removeFromWishlist: (slug: string) => void;
  count: number;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

const STORAGE_KEY = "lakshiraah-wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSlugs(JSON.parse(raw));
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  }, [slugs, hydrated]);

  const isWishlisted = (slug: string) => slugs.includes(slug);

  const toggleWishlist = (slug: string) => {
    setSlugs((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  };

  const removeFromWishlist = (slug: string) => {
    setSlugs((prev) => prev.filter((s) => s !== slug));
  };

  return (
    <WishlistContext.Provider
      value={{ slugs, isWishlisted, toggleWishlist, removeFromWishlist, count: slugs.length }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}
