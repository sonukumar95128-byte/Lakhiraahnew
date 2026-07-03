"use client";

import { useEffect } from "react";
import { trackRecentlyViewed } from "@/lib/recently-viewed-store";

export function TrackRecentlyViewed({ slug }: { slug: string }) {
  useEffect(() => {
    trackRecentlyViewed(slug);
  }, [slug]);

  return null;
}
