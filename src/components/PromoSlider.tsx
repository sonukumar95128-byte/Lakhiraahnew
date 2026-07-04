"use client";

import { useEffect, useRef, useState } from "react";
import type { PromoStrip } from "@/lib/admin-store";

function GlassArrow({ direction, onClick }: { direction: "left" | "right"; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={direction === "left" ? "Previous slide" : "Next slide"}
      className={
        "absolute top-1/2 -translate-y-1/2 z-20 h-11 w-11 rounded-full " +
        "bg-white/20 backdrop-blur-md border border-white/30 text-white text-xl " +
        "flex items-center justify-center hover:bg-white/35 active:scale-95 " +
        "transition-all duration-200 shadow-lg " +
        (direction === "left" ? "left-4 sm:left-6" : "right-4 sm:right-6")
      }
    >
      {direction === "left" ? "‹" : "›"}
    </button>
  );
}

export function PromoSlider({ slides }: { slides: PromoStrip[] }) {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1); // 1 = going right, -1 = going left
  const count = slides.length;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (count <= 1) return;
    timerRef.current = setInterval(() => {
      setDir(1);
      setActive((prev) => (prev + 1) % count);
    }, 4500);
  };

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [count]);

  const goTo = (i: number) => {
    const target = (i + count) % count;
    setDir(target > active || (active === count - 1 && target === 0) ? 1 : -1);
    setActive(target);
    resetTimer();
  };

  if (count === 0) return null;

  const prevIdx = (active - 1 + count) % count;
  const nextIdx = (active + 1) % count;

  return (
    <section className="w-full py-5">
      <div className="w-full">
        <div className="flex items-stretch gap-3 px-3">

          {/* Left peek — slides in from left */}
          <div
            className="hidden sm:block flex-shrink-0 w-[18%] rounded-2xl overflow-hidden cursor-pointer opacity-80 hover:opacity-90 transition-opacity duration-300"
            onClick={() => goTo(active - 1)}
          >
            <img
              src={slides[prevIdx].image}
              alt=""
              className="h-full w-full object-cover"
              style={{ objectPosition: "right center" }}
            />
          </div>

          {/* Center main slide — sliding track */}
          <div
            className="relative flex-1 rounded-2xl overflow-hidden shadow-xl"
            style={{ aspectRatio: "8/3" }}
          >
            {/* Sliding track: all slides in a row, translateX to show active */}
            <div
              className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${active * 100}%)`, width: `${count * 100}%` }}
            >
              {slides.map((s) => (
                <div key={s.id} className="relative h-full" style={{ width: `${100 / count}%` }}>
                  <img src={s.image} alt={s.title} className="h-full w-full object-cover" />
                  {s.title && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
                      <div className="absolute bottom-6 left-8 z-10">
                        <p className="font-heading italic text-xl sm:text-2xl text-white drop-shadow">
                          {s.title}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Glass arrows */}
            {count > 1 && (
              <>
                <GlassArrow direction="left" onClick={() => goTo(active - 1)} />
                <GlassArrow direction="right" onClick={() => goTo(active + 1)} />
              </>
            )}

            {/* Dots */}
            {count > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Slide ${i + 1}`}
                    onClick={() => goTo(i)}
                    className={
                      "rounded-full transition-all duration-300 " +
                      (i === active ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/50 hover:bg-white/80")
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right peek */}
          <div
            className="hidden sm:block flex-shrink-0 w-[18%] rounded-2xl overflow-hidden cursor-pointer opacity-80 hover:opacity-90 transition-opacity duration-300"
            onClick={() => goTo(active + 1)}
          >
            <img
              src={slides[nextIdx].image}
              alt=""
              className="h-full w-full object-cover"
              style={{ objectPosition: "left center" }}
            />
          </div>

        </div>

        {/* Dots mobile */}
        {count > 1 && (
          <div className="sm:hidden flex justify-center gap-2 mt-3">
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Slide ${i + 1}`}
                onClick={() => goTo(i)}
                className={
                  "rounded-full transition-all duration-300 " +
                  (i === active ? "w-6 h-2 bg-brand" : "w-2 h-2 bg-brand/30")
                }
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
