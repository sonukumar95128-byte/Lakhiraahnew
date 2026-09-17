"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { AdminReel } from "@/lib/admin-store";

const AUTOPLAY_MS = 5000;
const TRANSITION_MS = 700;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

function getYoutubeId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/shorts\/([^?&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

/** Only the centre reel plays; the rest are still frames, so the row stays light. */
function ReelItem({
  reel,
  isCenter,
  videoRef,
}: {
  reel: AdminReel;
  isCenter: boolean;
  videoRef?: (el: HTMLVideoElement | null) => void;
}) {
  const format = reel.format ?? "portrait";
  const ytId = reel.videoUrl ? getYoutubeId(reel.videoUrl) : null;

  if (ytId) {
    return (
      <div className="relative h-full w-full bg-black overflow-hidden">
        {isCenter ? (
          <iframe
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&playsinline=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1`}
            className="absolute inset-0 h-full w-full"
            style={
              format === "portrait"
                ? // Scale up to crop the top branding bar (≈ 50px on a 315px-tall embed)
                  { top: "-16%", height: "132%", width: "100%" }
                : { top: "-8%", height: "116%", width: "100%" }
            }
            allow="autoplay; encrypted-media"
            title={reel.title || "Video reel"}
          />
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://i.ytimg.com/vi/${ytId}/maxresdefault.jpg`}
              alt={reel.title || "Video reel"}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                // Not every video has a max-res still; fall back to the small one.
                const img = e.currentTarget;
                if (!img.dataset.fallback) {
                  img.dataset.fallback = "1";
                  img.src = `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`;
                }
              }}
              className="absolute inset-0 h-full w-full object-cover scale-[1.35]"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="h-11 w-11 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white text-lg">
                ▶
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  if (reel.videoUrl) {
    return (
      <div className="relative h-full w-full bg-black">
        <video
          ref={videoRef}
          src={reel.videoUrl}
          className="h-full w-full object-cover"
          muted
          loop
          playsInline
          preload="metadata"
        />
        {!isCenter && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="h-11 w-11 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white text-lg">
              ▶
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-brand/10 flex flex-col items-center justify-center text-ink/30 gap-2">
      <span className="text-4xl">🎬</span>
      <span className="text-xs">No video</span>
    </div>
  );
}

export function ReelsSection({ reels }: { reels: AdminReel[] }) {
  const activeReels = reels.filter((r) => r.enabled);
  const count = activeReels.length;
  const loop = count > 1;

  // Three copies of the row, parked in the middle one: the track can slide
  // either way forever and is silently re-centred once it drifts a full copy.
  const items = loop ? [...activeReels, ...activeReels, ...activeReels] : activeReels;
  const start = loop ? count : 0;

  const [index, setIndex] = useState(start);
  const [metrics, setMetrics] = useState({ card: 0, step: 0, viewport: 0 });
  const [animating, setAnimating] = useState(true);
  const [paused, setPaused] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const dragStartX = useRef<number | null>(null);
  const recentering = useRef(false);

  const active = ((index % count) + count) % count;

  // Cards are all the same layout width, so one measurement drives every
  // position — the offset then always matches the rendered index.
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
  }, [measure]);

  const offset = metrics.step
    ? metrics.viewport / 2 - (index * metrics.step + metrics.card / 2)
    : 0;

  // Autoplay — pauses on hover/touch and for reduced-motion users.
  useEffect(() => {
    if (!loop || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => i + 1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [loop, paused]);

  // Hop back to the middle copy once a whole row has been travelled.
  useEffect(() => {
    if (!loop) return;
    if (index >= count && index < count * 2) return;
    const id = setTimeout(() => {
      recentering.current = true;
      setAnimating(false);
      setIndex(((index % count) + count) % count + count);
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

  // Only the centre reel plays.
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === index) v.play().catch(() => {});
      else {
        v.pause();
        v.currentTime = 0;
      }
    });
  }, [index]);

  const onDragEnd = (x: number) => {
    const startX = dragStartX.current;
    dragStartX.current = null;
    if (startX === null) return;
    const diff = startX - x;
    if (Math.abs(diff) > 50) setIndex((i) => i + (diff > 0 ? 1 : -1));
  };

  if (count === 0) return null;

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
          className="flex items-center gap-3 sm:gap-4 will-change-transform"
          style={{
            transform: `translate3d(${offset}px, 0, 0)`,
            transition: animating ? `transform ${TRANSITION_MS}ms ${EASE}` : "none",
          }}
        >
          {items.map((reel, i) => {
            const distance = Math.abs(i - index);
            const isCenter = i === index;
            const fmt = reel.format ?? "portrait";
            // Cards past the visible five stay mounted (so widths stay
            // measurable) but are invisible.
            const scale = isCenter ? 1 : distance === 1 ? 0.88 : distance === 2 ? 0.8 : 0.78;
            const opacity = isCenter ? 1 : distance === 1 ? 0.85 : distance === 2 ? 0.55 : 0;

            return (
              <div
                key={`${reel.id}-${i}`}
                onClick={() => !isCenter && setIndex(i)}
                className={
                  "relative flex-shrink-0 rounded-[1.75rem] overflow-hidden cursor-pointer " +
                  "transition-[transform,opacity,box-shadow] " +
                  (isCenter
                    ? "z-10 shadow-[0_28px_60px_-25px_rgba(42,20,20,0.6)] ring-1 ring-gold/30"
                    : "z-0 shadow-none")
                }
                style={{
                  width: fmt === "landscape" ? "clamp(260px, 52vw, 560px)" : "clamp(150px, 30vw, 260px)",
                  aspectRatio: fmt === "landscape" ? "16 / 9" : "9 / 16",
                  transform: `scale(${scale})`,
                  opacity,
                  transition: `transform ${TRANSITION_MS}ms ${EASE}, opacity ${TRANSITION_MS}ms ${EASE}, box-shadow ${TRANSITION_MS}ms ${EASE}`,
                  pointerEvents: distance > 2 ? "none" : "auto",
                }}
                aria-hidden={distance > 2}
              >
                <ReelItem
                  reel={reel}
                  isCenter={isCenter}
                  videoRef={(el) => { videoRefs.current[i] = el; }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {reel.title && isCenter && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none">
                    <p className="text-white text-sm font-medium drop-shadow line-clamp-2">{reel.title}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {loop && (
        <>
          <button
            onClick={() => setIndex((i) => i - 1)}
            aria-label="Previous reel"
            className="absolute left-1 sm:left-6 top-1/2 -translate-y-1/2 z-20 h-10 w-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-lg text-brand text-lg hover:bg-white hover:scale-105 active:scale-95 transition duration-300"
          >
            ‹
          </button>
          <button
            onClick={() => setIndex((i) => i + 1)}
            aria-label="Next reel"
            className="absolute right-1 sm:right-6 top-1/2 -translate-y-1/2 z-20 h-10 w-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-lg text-brand text-lg hover:bg-white hover:scale-105 active:scale-95 transition duration-300"
          >
            ›
          </button>

          <div className="flex justify-center gap-1.5 mt-4">
            {activeReels.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(count + i)}
                aria-label={`Go to reel ${i + 1}`}
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
