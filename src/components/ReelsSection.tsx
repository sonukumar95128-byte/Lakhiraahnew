"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { AdminReel } from "@/lib/admin-store";

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

function ReelItem({
  reel,
  isCenter,
  videoRef,
}: {
  reel: AdminReel;
  isCenter: boolean;
  videoRef?: (el: HTMLVideoElement | null) => void;
}) {
  const [playing, setPlaying] = useState(false);
  const format = reel.format ?? "portrait";
  const ytId = reel.videoUrl ? getYoutubeId(reel.videoUrl) : null;

  if (ytId) {
    return (
      <div className="relative h-full w-full bg-black overflow-hidden">
        <iframe
          src={`https://www.youtube.com/embed/${ytId}?autoplay=${isCenter ? 1 : 0}&mute=1&loop=1&playlist=${ytId}&controls=0&playsinline=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1`}
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
        {/* Play icon overlay for non-center reels */}
        {!isCenter && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white text-xl">▶</div>
          </div>
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
          onClick={() => setPlaying((p) => !p)}
        />
        {!isCenter && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white text-xl">▶</div>
          </div>
        )}
        {isCenter && !playing && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center text-white text-2xl">▶</div>
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
  const [activeIdx, setActiveIdx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const count = activeReels.length;

  const goTo = useCallback((i: number) => {
    setActiveIdx((i + count) % count);
  }, [count]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (count <= 1) return;
    timerRef.current = setInterval(() => {
      setActiveIdx((cur) => (cur + 1) % count);
    }, 5000);
  }, [count]);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === activeIdx) { v.play().catch(() => {}); }
      else { v.pause(); v.currentTime = 0; }
    });
  }, [activeIdx]);

  const onDragStart = (x: number) => { setIsDragging(true); dragStartX.current = x; };
  const onDragEnd = (x: number) => {
    if (!isDragging) return;
    setIsDragging(false);
    const diff = dragStartX.current - x;
    if (Math.abs(diff) > 50) { goTo(activeIdx + (diff > 0 ? 1 : -1)); resetTimer(); }
  };

  if (count === 0) return null;

  const currentFormat = activeReels[activeIdx]?.format ?? "portrait";
  const isLandscape = currentFormat === "landscape";

  return (
    <div className="relative w-full select-none">
      <div
        className="flex items-center justify-center gap-3 sm:gap-4 overflow-hidden px-4"
        onMouseDown={(e) => onDragStart(e.clientX)}
        onMouseUp={(e) => onDragEnd(e.clientX)}
        onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
        onTouchEnd={(e) => onDragEnd(e.changedTouches[0].clientX)}
      >
        {activeReels.map((reel, i) => {
          const isCenter = i === activeIdx;
          const isAdjacent =
            Math.abs(i - activeIdx) === 1 ||
            (activeIdx === 0 && i === count - 1) ||
            (activeIdx === count - 1 && i === 0);
          if (!isCenter && !isAdjacent) return null;

          const fmt = reel.format ?? "portrait";
          const aspectRatio = fmt === "landscape" ? "16/9" : "9/16";

          return (
            <div
              key={reel.id}
              onClick={() => { if (!isCenter) { goTo(i); resetTimer(); } }}
              className={[
                "relative flex-shrink-0 rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer",
                isCenter
                  ? isLandscape
                    ? "w-[90%] sm:w-[70%] lg:w-[55%] opacity-100 scale-100 z-10 shadow-2xl"
                    : "w-[55%] sm:w-[38%] lg:w-[26%] opacity-100 scale-100 z-10 shadow-2xl"
                  : isLandscape
                    ? "w-[30%] sm:w-[20%] lg:w-[15%] opacity-40 scale-95 z-0"
                    : "w-[22%] sm:w-[20%] lg:w-[15%] opacity-40 scale-95 z-0",
              ].join(" ")}
              style={{ aspectRatio }}
            >
              <ReelItem
                reel={reel}
                isCenter={isCenter}
                videoRef={(el) => { videoRefs.current[i] = el; }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {reel.title && isCenter && (
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white text-sm font-medium drop-shadow line-clamp-2">{reel.title}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {count > 1 && (
        <>
          <button
            onClick={() => { goTo(activeIdx - 1); resetTimer(); }}
            className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 z-20 h-9 w-9 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-lg text-brand text-lg hover:bg-white transition-colors"
          >‹</button>
          <button
            onClick={() => { goTo(activeIdx + 1); resetTimer(); }}
            className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 z-20 h-9 w-9 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-lg text-brand text-lg hover:bg-white transition-colors"
          >›</button>
        </>
      )}

      {count > 1 && (
        <div className="flex justify-center gap-1.5 mt-4">
          {activeReels.map((_, i) => (
            <button
              key={i}
              onClick={() => { goTo(i); resetTimer(); }}
              className={"rounded-full transition-all duration-300 " + (i === activeIdx ? "w-6 h-2 bg-brand" : "w-2 h-2 bg-brand/25 hover:bg-brand/50")}
            />
          ))}
        </div>
      )}
    </div>
  );
}
