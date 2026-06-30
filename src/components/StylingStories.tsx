"use client";

import Image from "next/image";
import { useRef } from "react";

export function StylingStories({ images }: { images: string[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: dir * track.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [&::-webkit-scrollbar]:hidden"
      >
        {images.map((img, i) => (
          <div
            key={i}
            className="relative shrink-0 snap-start w-[calc((100%-3*1rem)/4)] min-w-[180px] aspect-[9/16] rounded-lg overflow-hidden"
          >
            <Image
              src={img}
              alt="Styling story"
              fill
              sizes="(min-width: 1024px) 25vw, 45vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/15 grid place-items-center">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-white/90 text-brand text-lg">
                ▶
              </span>
            </div>
          </div>
        ))}
      </div>

      <button
        aria-label="Previous"
        onClick={() => scroll(-1)}
        className="hidden sm:grid absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 h-10 w-10 place-items-center rounded-full bg-white shadow text-brand hover:bg-gold-light"
      >
        ‹
      </button>
      <button
        aria-label="Next"
        onClick={() => scroll(1)}
        className="hidden sm:grid absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 h-10 w-10 place-items-center rounded-full bg-white shadow text-brand hover:bg-gold-light"
      >
        ›
      </button>
    </div>
  );
}
