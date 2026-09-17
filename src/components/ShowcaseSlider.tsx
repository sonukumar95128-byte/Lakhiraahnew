"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { categoryToSlug } from "@/lib/dummy-images";
import { useAdmin } from "@/lib/admin-store";

const AUTOPLAY_MS = 3500;
const TRANSITION_MS = 700;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * Coverflow-style product slider: one piece centred, two smaller ones peeking
 * on each side, sliding on forever. Every card links to its product page.
 */
export function ShowcaseSlider({ slugs }: { slugs: string[] }) {
  const { products } = useAdmin();

  const picks = slugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => !!p);

  const count = picks.length;
  const loop = count > 1;

  // Three copies of the row, parked in the middle one, so the track can slide
  // either way forever and be silently re-centred after a full lap.
  const items = loop ? [...picks, ...picks, ...picks] : picks;
  const start = loop ? count : 0;

  const [index, setIndex] = useState(start);
  const [metrics, setMetrics] = useState({ card: 0, step: 0, viewport: 0 });
  const [animating, setAnimating] = useState(true);
  const [paused, setPaused] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef<number | null>(null);
  const recentering = useRef(false);

  const active = count ? ((index % count) + count) % count : 0;

  // Cards share one layout width, so a single measurement drives every
  // position and the offset always matches the rendered index.
  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    const first = trackRef.current?.children[0] as HTMLElement | undefined;
    const second = trackRef.current?.children[1] as HTMLElement | undefined;
    if (!viewport || !first) return;
    const card = first.offsetWidth;
    const step = second ? second.offsetLeft - first.offsetLeft : card;
    setMetrics((m) =>
      m.card === card && m.step === step && m.viewport === viewport.offsetWidth
        ? m
        : { card, step, viewport: viewport.offsetWidth },
    );
  }, []);

  useLayoutEffect(() => {
    measure();
    const viewport = viewportRef.current;
    if (!viewport) return;
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [measure, count]);

  useEffect(() => {
    if (!loop || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => i + 1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [loop, paused]);

  // Hop back to the middle copy once a whole lap has been travelled.
  useEffect(() => {
    if (!loop) return;
    if (index >= count && index < count * 2) return;
    const id = setTimeout(() => {
      recentering.current = true;
      setAnimating(false);
      setIndex((((index % count) + count) % count) + count);
    }, TRANSITION_MS + 20);
    return () => clearTimeout(id);
  }, [index, loop, count]);

  useEffect(() => {
    if (!recentering.current) return;
    const frame = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        recentering.current = false;
        setAnimating(true);
      }),
    );
    return () => cancelAnimationFrame(frame);
  }, [index]);

  const onDragEnd = (x: number) => {
    const startX = dragStartX.current;
    dragStartX.current = null;
    if (startX === null) return;
    const diff = startX - x;
    if (Math.abs(diff) > 50) setIndex((i) => i + (diff > 0 ? 1 : -1));
  };

  if (count === 0) return null;

  const offset = metrics.step
    ? metrics.viewport / 2 - (index * metrics.step + metrics.card / 2)
    : 0;

  return (
    <div
      className="relative w-full select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        ref={viewportRef}
        className="overflow-hidden py-6"
        onMouseDown={(e) => { dragStartX.current = e.clientX; }}
        onMouseUp={(e) => onDragEnd(e.clientX)}
        onTouchStart={(e) => { setPaused(true); dragStartX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => { setPaused(false); onDragEnd(e.changedTouches[0].clientX); }}
      >
        <div
          ref={trackRef}
          className="flex items-center gap-4 sm:gap-6 will-change-transform"
          style={{
            transform: `translate3d(${offset}px, 0, 0)`,
            transition: animating ? `transform ${TRANSITION_MS}ms ${EASE}` : "none",
          }}
        >
          {items.map((p, i) => {
            const distance = Math.abs(i - index);
            const isCenter = i === index;
            const scale = isCenter ? 1 : distance === 1 ? 0.88 : 0.8;
            const opacity = isCenter ? 1 : distance === 1 ? 0.85 : distance === 2 ? 0.55 : 0;
            const href = `/jewellery/${categoryToSlug(p.category)}/${p.slug}`;

            return (
              <div
                key={`${p.slug}-${i}`}
                className={
                  "relative flex-shrink-0 rounded-3xl overflow-hidden bg-white " +
                  (isCenter
                    ? "z-10 shadow-[0_28px_60px_-25px_rgba(42,20,20,0.55)] ring-1 ring-gold/30"
                    : "z-0 shadow-none ring-1 ring-beige")
                }
                style={{
                  width: "clamp(180px, 34vw, 300px)",
                  transform: `scale(${scale})`,
                  opacity,
                  transition: `transform ${TRANSITION_MS}ms ${EASE}, opacity ${TRANSITION_MS}ms ${EASE}, box-shadow ${TRANSITION_MS}ms ${EASE}`,
                  pointerEvents: distance > 2 ? "none" : "auto",
                }}
                aria-hidden={distance > 2}
              >
                <Link
                  href={href}
                  tabIndex={isCenter ? 0 : -1}
                  onClick={(e) => {
                    if (!isCenter) {
                      e.preventDefault();
                      setIndex(i);
                    }
                  }}
                  className="block"
                >
                  <div className="relative aspect-[4/5] bg-ivory">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(min-width:1024px) 300px, 34vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="px-4 py-3 text-center">
                    <p className="text-xs sm:text-sm text-ink/70 line-clamp-1">{p.name}</p>
                    <p className="mt-1 font-heading text-base sm:text-lg text-brand">{p.price}</p>
                    {isCenter && (
                      <span className="mt-2 inline-block text-[11px] uppercase tracking-[0.18em] text-gold">
                        View details →
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {loop && (
        <>
          <button
            onClick={() => setIndex((i) => i - 1)}
            aria-label="Previous piece"
            className="absolute left-1 sm:left-6 top-[42%] -translate-y-1/2 z-20 h-10 w-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-lg text-brand text-lg hover:bg-white hover:scale-105 active:scale-95 transition duration-300"
          >
            ‹
          </button>
          <button
            onClick={() => setIndex((i) => i + 1)}
            aria-label="Next piece"
            className="absolute right-1 sm:right-6 top-[42%] -translate-y-1/2 z-20 h-10 w-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-lg text-brand text-lg hover:bg-white hover:scale-105 active:scale-95 transition duration-300"
          >
            ›
          </button>

          <div className="flex justify-center gap-1.5 mt-2">
            {picks.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(count + i)}
                aria-label={`Go to piece ${i + 1}`}
                className={
                  "h-2 rounded-full transition-all duration-500 " +
                  (i === active ? "w-6 bg-brand" : "w-2 bg-brand/25 hover:bg-brand/50")
                }
                style={{ transitionTimingFunction: EASE }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
