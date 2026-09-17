"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { AdminTestimonial } from "@/lib/admin-store";

const AUTOPLAY_MS = 4000;
const TRANSITION_MS = 700;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

function Card({ t }: { t: AdminTestimonial }) {
  return (
    <article className="group/card relative h-full rounded-2xl border border-beige bg-white p-6 pt-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-[0_22px_45px_-28px_rgba(42,20,20,0.5)]">
      {/* Oversized quote mark that warms up on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-5 top-2 font-heading text-6xl leading-none text-gold/15 transition-all duration-500 group-hover/card:text-gold/35 group-hover/card:scale-110"
      >
        &rdquo;
      </span>

      <div className="text-gold text-sm mb-3 tracking-[0.15em]">
        {"★".repeat(t.rating)}
        <span className="text-gold/25">{"★".repeat(5 - t.rating)}</span>
      </div>

      <p className="relative text-sm text-ink/80 leading-relaxed mb-5">{t.text}</p>

      <div className="flex items-center gap-3 pt-4 border-t border-beige/80">
        {t.avatar ? (
          <div className="relative h-9 w-9 rounded-full overflow-hidden shrink-0 ring-1 ring-beige transition-all duration-500 group-hover/card:ring-gold/60">
            <Image src={t.avatar} alt={t.name} fill sizes="36px" className="object-cover" />
          </div>
        ) : (
          <div className="grid h-9 w-9 place-items-center rounded-full bg-brand/10 text-brand text-sm font-medium shrink-0">
            {t.name.charAt(0)}
          </div>
        )}
        <span className="text-sm font-medium text-brand">{t.name}</span>
        <span className="ml-auto text-[11px] uppercase tracking-[0.16em] text-gold">✓ verified</span>
      </div>

      {/* Gold hairline that draws in on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-6 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-gold to-transparent transition-transform duration-500 group-hover/card:scale-x-100"
      />
    </article>
  );
}

export function TestimonialsCarousel({ testimonials }: { testimonials: AdminTestimonial[] }) {
  const count = testimonials.length;
  const loop = count > 1;

  // Three copies, parked in the middle one, so the track slides on forever.
  const items = loop ? [...testimonials, ...testimonials, ...testimonials] : testimonials;
  const start = loop ? count : 0;

  const [index, setIndex] = useState(start);
  const [metrics, setMetrics] = useState({ step: 0 });
  const [animating, setAnimating] = useState(true);
  const [paused, setPaused] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const recentering = useRef(false);

  const active = count ? ((index % count) + count) % count : 0;

  const measure = useCallback(() => {
    const first = trackRef.current?.children[0] as HTMLElement | undefined;
    const second = trackRef.current?.children[1] as HTMLElement | undefined;
    if (!first) return;
    const step = second ? second.offsetLeft - first.offsetLeft : first.offsetWidth;
    setMetrics((m) => (m.step === step ? m : { step }));
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

  // Hop back to the middle copy once a full lap has been travelled.
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

  if (count === 0) {
    return <p className="text-center text-sm text-ink/40 py-8">No approved testimonials yet.</p>;
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div ref={viewportRef} className="overflow-hidden -mx-2 px-2 pb-3">
        <div
          ref={trackRef}
          className="flex items-stretch will-change-transform"
          style={{
            transform: `translate3d(${-index * metrics.step}px, 0, 0)`,
            transition: animating ? `transform ${TRANSITION_MS}ms ${EASE}` : "none",
          }}
        >
          {items.map((t, i) => (
            <div
              key={`${t.id}-${i}`}
              className="shrink-0 w-full sm:w-1/2 lg:w-1/3 pr-4"
              aria-hidden={i < index || i > index + 2}
            >
              <Card t={t} />
            </div>
          ))}
        </div>
      </div>

      {loop && (
        <div className="flex justify-center gap-1.5 mt-5">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(count + i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={
                "h-2 rounded-full transition-all duration-500 " +
                (i === active ? "w-6 bg-brand" : "w-2 bg-brand/25 hover:bg-brand/50")
              }
              style={{ transitionTimingFunction: EASE }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
