"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  const goTo = (i: number) => setActive((i + images.length) % images.length);

  useEffect(() => {
    if (!zoomOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomOpen(false);
      if (e.key === "ArrowLeft") goTo(active - 1);
      if (e.key === "ArrowRight") goTo(active + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoomOpen, active]);

  return (
    <div>
      <div className="relative aspect-square rounded-xl overflow-hidden bg-beige border border-beige">
        <button
          onClick={() => setZoomOpen(true)}
          aria-label="Zoom image"
          className="absolute inset-0 cursor-zoom-in"
        >
          <Image
            src={images[active]}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 40vw, 90vw"
            className="object-cover"
            priority
          />
        </button>

        <button
          aria-label="Previous image"
          onClick={() => goTo(active - 1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-white/85 text-brand hover:bg-white transition-colors"
        >
          ‹
        </button>
        <button
          aria-label="Next image"
          onClick={() => goTo(active + 1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-white/85 text-brand hover:bg-white transition-colors"
        >
          ›
        </button>

        <button
          aria-label="Zoom image"
          onClick={() => setZoomOpen(true)}
          className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white/85 text-brand hover:bg-white transition-colors"
        >
          🔍
        </button>

        <span className="absolute bottom-3 left-3 rounded-full bg-black/55 px-2.5 py-1 text-xs text-white">
          {active + 1} / {images.length}
        </span>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={
              "relative h-16 w-16 shrink-0 rounded-lg overflow-hidden border-2 transition-colors " +
              (i === active ? "border-gold" : "border-beige")
            }
          >
            <Image src={img} alt={`${alt} thumbnail ${i + 1}`} fill sizes="64px" className="object-cover" />
          </button>
        ))}
      </div>

      {zoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 sm:p-10"
          onClick={() => setZoomOpen(false)}
        >
          <button
            aria-label="Close zoom"
            onClick={() => setZoomOpen(false)}
            className="absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors text-xl"
          >
            ✕
          </button>

          <button
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              goTo(active - 1);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors text-xl"
          >
            ‹
          </button>

          <div
            className="relative w-full max-w-3xl aspect-square"
            onClick={(e) => e.stopPropagation()}
          >
            <Image src={images[active]} alt={alt} fill sizes="100vw" className="object-contain" />
          </div>

          <button
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              goTo(active + 1);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors text-xl"
          >
            ›
          </button>

          <span className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs text-white">
            {active + 1} / {images.length}
          </span>
        </div>
      )}
    </div>
  );
}
