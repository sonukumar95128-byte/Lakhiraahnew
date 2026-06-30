"use client";

import { useState } from "react";

type DualRangeSliderProps = {
  min: number;
  max: number;
  step?: number;
};

function formatRupee(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

export function DualRangeSlider({ min, max, step = 100 }: DualRangeSliderProps) {
  const [low, setLow] = useState(min);
  const [high, setHigh] = useState(max);

  const lowPercent = ((low - min) / (max - min)) * 100;
  const highPercent = ((high - min) / (max - min)) * 100;

  return (
    <div>
      <div className="relative h-1.5 rounded-full bg-beige">
        <div
          className="absolute h-1.5 rounded-full bg-gold"
          style={{ left: `${lowPercent}%`, right: `${100 - highPercent}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={low}
          onChange={(e) => setLow(Math.min(Number(e.target.value), high - step))}
          className="range-thumb absolute inset-0 w-full appearance-none bg-transparent"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={high}
          onChange={(e) => setHigh(Math.max(Number(e.target.value), low + step))}
          className="range-thumb absolute inset-0 w-full appearance-none bg-transparent"
        />
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-ink/60">
        <span className="rounded-full border border-beige px-2.5 py-1">{formatRupee(low)}</span>
        <span className="rounded-full border border-beige px-2.5 py-1">{formatRupee(high)}</span>
      </div>
    </div>
  );
}
