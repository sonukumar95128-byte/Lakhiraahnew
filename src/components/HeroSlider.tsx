"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Slide = { image: string; href: string; alt: string };

export function HeroSlider({ slides }: { slides: Slide[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => setActive((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  if (slides.length === 0) return null;

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
          <Image src={slide.image} alt={slide.alt} fill priority={i === 0} sizes="100vw" className="object-cover" />
        </Link>
      ))}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setActive(i)}
            className={
              "h-2 w-2 rounded-full transition-colors " + (i === active ? "bg-gold" : "bg-white/60")
            }
          />
        ))}
      </div>
    </div>
  );
}
