"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PromoStrip } from "@/lib/admin-store";

// Track geometry, in % of the slider width.
const SLIDE_W = 70;
const GAP = 3;
const STEP = SLIDE_W + GAP;
const EDGE = (100 - SLIDE_W) / 2; // centers the active slide

const AUTOPLAY_MS = 4500;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const TRANSITION_MS = 700;

export function PromoSlider({ slides }: { slides: PromoStrip[] }) {
  const count = slides.length;
  const loop = count > 1;

  // Clone the last slide before and the first slide after, so the track can
  // keep moving in one direction and be silently rewound at the seam.
  const items = loop ? [slides[count - 1], ...slides, slides[0]] : slides;
  const firstReal = loop ? 1 : 0;

  const [index, setIndex] = useState(firstReal);
  const [animating, setAnimating] = useState(true);
  const [paused, setPaused] = useState(false);
  const rewinding = useRef(false);

  const active = ((index - firstReal) % count + count) % count;

  const go = useCallback((delta: number) => setIndex((i) => i + delta), []);
  const goToSlide = (i: number) => setIndex(i + firstReal);

  // Autoplay — pauses on hover/touch and for reduced-motion users.
  useEffect(() => {
    if (!loop || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [loop, paused, go]);

  // Once a clone has finished sliding in, jump to its real twin with the
  // transition switched off — the seam is invisible.
  useEffect(() => {
    if (!loop) return;
    const onClone = index === 0 || index === items.length - 1;
    if (!onClone) return;
    const id = setTimeout(() => {
      rewinding.current = true;
      setAnimating(false);
      setIndex(index === 0 ? count : firstReal);
    }, TRANSITION_MS + 20);
    return () => clearTimeout(id);
  }, [index, loop, items.length, count, firstReal]);

  // Re-enable the transition only once the rewound position has painted.
  useEffect(() => {
    if (!rewinding.current) return;
    const frame = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        rewinding.current = false;
        setAnimating(true);
      }),
    );
    return () => cancelAnimationFrame(frame);
  }, [index]);

  if (count === 0) return null;

  return (
    <section
      className="w-full py-5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex will-change-transform"
            style={{
              gap: `${GAP}%`,
              transform: `translate3d(calc(${EDGE}% - ${index * STEP}%), 0, 0)`,
              transition: animating ? `transform ${TRANSITION_MS}ms ${EASE}` : "none",
            }}
          >
            {items.map((s, i) => {
              const isActive = i === index;
              return (
                <div
                  key={`${s.id}-${i}`}
                  className={
                    "flex-shrink-0 rounded-2xl overflow-hidden bg-beige " +
                    "transition-[box-shadow] duration-700 " +
                    (isActive ? "shadow-[0_18px_40px_-20px_rgba(42,20,20,0.45)]" : "shadow-none")
                  }
                  style={{
                    width: `${SLIDE_W}%`,
                    aspectRatio: "16 / 6",
                    transitionTimingFunction: EASE,
                  }}
                >
                  <Link
                    href={s.link || "/jewellery"}
                    aria-label={s.title || "View collection"}
                    tabIndex={isActive ? 0 : -1}
                    aria-hidden={!isActive}
                    onClick={(e) => {
                      if (!isActive) {
                        e.preventDefault();
                        setIndex(i);
                      }
                    }}
                    className="block h-full w-full"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.image}
                      alt={s.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {loop && (
          <>
            <button
              onClick={() => go(-1)}
              aria-label="Previous"
              className="hidden sm:flex absolute left-[3.5%] top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-md text-brand text-lg hover:bg-white hover:scale-105 active:scale-95 transition duration-300"
            >
              ←
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next"
              className="hidden sm:flex absolute right-[3.5%] top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-md text-brand text-lg hover:bg-white hover:scale-105 active:scale-95 transition duration-300"
            >
              →
            </button>

            <div className="flex justify-center gap-2 mt-3">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={
                    "h-2 rounded-full transition-all duration-500 " +
                    (i === active ? "w-6 bg-brand" : "w-2 bg-brand/30 hover:bg-brand/60")
                  }
                  style={{ transitionTimingFunction: EASE }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
