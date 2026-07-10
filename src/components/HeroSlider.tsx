"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Slide = { image: string; href: string; alt: string };

function GlassArrow({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      aria-label={direction === "left" ? "Previous slide" : "Next slide"}
      className={
        "hidden sm:flex absolute top-1/2 -translate-y-1/2 z-20 h-11 w-11 rounded-full " +
        "bg-white/20 backdrop-blur-md border border-white/30 text-white text-xl " +
        "items-center justify-center hover:bg-white/35 active:scale-95 " +
        "transition-all duration-200 shadow-lg " +
        (direction === "left" ? "left-6" : "right-6")
      }
    >
      {direction === "left" ? "‹" : "›"}
    </button>
  );
}

export function HeroSlider({ slides }: { slides: Slide[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => setActive((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const prev = () => setActive((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setActive((i) => (i + 1) % slides.length);

  return (
    <div className="relative aspect-[16/6] w-full overflow-hidden">
      {slides.map((slide, i) => (
        <Link
          key={slide.href + i}
          href={slide.href}
          className={
            "absolute inset-0 transition-opacity duration-700 " +
            (i === active ? "opacity-100 z-10" : "opacity-0 z-0")
          }
          aria-hidden={i !== active}
          tabIndex={i === active ? 0 : -1}
        >
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />
        </Link>
      ))}

      {slides.length > 1 && (
        <>
          <GlassArrow direction="left" onClick={prev} />
          <GlassArrow direction="right" onClick={next} />
        </>
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setActive(i)}
            className={
              "rounded-full transition-all duration-300 " +
              (i === active ? "h-2 w-6 bg-gold" : "h-2 w-2 bg-white/60 hover:bg-white/90")
            }
          />
        ))}
      </div>
    </div>
  );
}
