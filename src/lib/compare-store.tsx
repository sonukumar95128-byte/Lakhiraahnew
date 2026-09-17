"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export const COMPARE_LIMIT = 4;

type CompareContextValue = {
  slugs: string[];
  isComparing: (slug: string) => boolean;
  /** Returns false when the list is already full. */
  toggleCompare: (slug: string) => boolean;
  removeFromCompare: (slug: string) => void;
  clearCompare: () => void;
  isFull: boolean;
  count: number;
};

const CompareContext = createContext<CompareContextValue | null>(null);

const STORAGE_KEY = "lakshiraah-compare";

export function CompareProvider({ children }: { children: ReactNode }) {
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
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
    } catch {
      // storage can be unavailable (private mode) — the list just won't persist
    }
  }, [slugs, hydrated]);

  const isComparing = (slug: string) => slugs.includes(slug);

  const toggleCompare = (slug: string) => {
    if (slugs.includes(slug)) {
      setSlugs((prev) => prev.filter((s) => s !== slug));
      return true;
    }
    if (slugs.length >= COMPARE_LIMIT) return false;
    setSlugs((prev) => [...prev, slug]);
    return true;
  };

  const removeFromCompare = (slug: string) => setSlugs((prev) => prev.filter((s) => s !== slug));
  const clearCompare = () => setSlugs([]);

  return (
    <CompareContext.Provider
      value={{
        slugs,
        isComparing,
        toggleCompare,
        removeFromCompare,
        clearCompare,
        isFull: slugs.length >= COMPARE_LIMIT,
        count: slugs.length,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare(): CompareContextValue {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within a CompareProvider");
  return ctx;
}
