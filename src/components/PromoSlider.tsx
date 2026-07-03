"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { PromoStrip } from "@/lib/admin-store";

export function PromoSlider({ slides }: { slides: PromoStrip[] }) {
  const [active, setActive] = useState(0);

  const count = slides.length;
  const goTo = (i: number) => setActive((i + count) % count);

  useEffect(() => {
    if (count <= 1) return;
    const timer = setInterval(() => setActive((prev) => (prev + 1) % count), 4500);
    return () => clearInterval(timer);
  }, [count]);

  if (count === 0) return null;

  const getIndex = (offset: number) => (active + offset + count) % count;

  return (
    <section className="w-full py-6 px-4 sm:px-6 bg-transparent">
      <div className="relative max-w-7xl mx-auto">

        {/* Three-slide visible layout */}
        <div className="flex items-stretch gap-3">

          {/* Left slide */}
          <div
            className="hidden sm:flex flex-shrink-0 w-[25%] cursor-pointer items-center"
            onClick={() => goTo(active - 1)}
          >
            <div className="relative w-full h-[75%] rounded-2xl overflow-hidden opacity-65 hover:opacity-80 transition-opacity duration-300 shadow-md">
              <img
                src={slides[getIndex(-1)].image}
                alt={slides[getIndex(-1)].title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/15 rounded-2xl" />
            </div>
          </div>

          {/* Center slide (main) */}
          <div className="flex-1 relative">
            <div className="relative aspect-[8/3] rounded-3xl overflow-hidden shadow-xl transition-all duration-500">
              {slides.map((s, i) => (
                <div
                  key={s.id}
                  className={
                    "absolute inset-0 transition-opacity duration-500 " +
                    (i === active ? "opacity-100 z-10" : "opacity-0 z-0")
                  }
                >
                  <img
                    src={s.image}
                    alt={s.title}
                    className="h-full w-full object-cover"
                  />
                  {(s.title || s.link) && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
                      <div className="absolute inset-0 flex items-end p-6 sm:p-8 z-10">
                        <div>
                          {s.title && (
                            <p className="font-heading italic text-xl sm:text-2xl text-white drop-shadow mb-3">
                              {s.title}
                            </p>
                          )}
                          {s.link && s.link !== "#" && (
                            <Link
                              href={s.link}
                              className="inline-block rounded-full bg-white/90 backdrop-blur-sm px-6 py-2 text-sm font-medium text-brand shadow hover:bg-white transition-colors"
                            >
                              Shop Now
                            </Link>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Glass arrows */}
            {count > 1 && (
              <>
                <button
                  aria-label="Previous slide"
                  onClick={() => goTo(active - 1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-10 w-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xl hover:bg-white/35 transition-all duration-200 shadow-lg"
                >
                  ‹
                </button>
                <button
                  aria-label="Next slide"
                  onClick={() => goTo(active + 1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-10 w-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xl hover:bg-white/35 transition-all duration-200 shadow-lg"
                >
                  ›
                </button>
              </>
            )}
          </div>

          {/* Right slide */}
          <div
            className="hidden sm:flex flex-shrink-0 w-[25%] cursor-pointer items-center"
            onClick={() => goTo(active + 1)}
          >
            <div className="relative w-full h-[75%] rounded-2xl overflow-hidden opacity-65 hover:opacity-80 transition-opacity duration-300 shadow-md">
              <img
                src={slides[getIndex(1)].image}
                alt={slides[getIndex(1)].title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/15 rounded-2xl" />
            </div>
          </div>
        </div>

        {/* Dots */}
        {count > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Slide ${i + 1}`}
                onClick={() => goTo(i)}
                className={
                  "rounded-full transition-all duration-300 " +
                  (i === active ? "w-6 h-2 bg-brand" : "w-2 h-2 bg-brand/25 hover:bg-brand/50")
                }
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
