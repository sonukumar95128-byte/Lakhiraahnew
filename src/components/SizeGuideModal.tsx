"use client";

import { useEffect, useRef } from "react";

type SizeGuideModalProps = {
  onClose: () => void;
};

const ringSizes = [
  { india: "6", us: "3", circumference: "44.2mm" },
  { india: "8", us: "4", circumference: "46.8mm" },
  { india: "10", us: "5", circumference: "49.3mm" },
  { india: "12", us: "6", circumference: "51.9mm" },
  { india: "14", us: "7", circumference: "54.4mm" },
  { india: "16", us: "8", circumference: "57.0mm" },
  { india: "18", us: "9", circumference: "59.5mm" },
  { india: "20", us: "10", circumference: "62.1mm" },
];

const braceletSizes = [
  { size: "S (Small)", wrist: "14–15 cm", fit: "Snug" },
  { size: "M (Medium)", wrist: "15–17 cm", fit: "Regular" },
  { size: "L (Large)", wrist: "17–19 cm", fit: "Relaxed" },
];

export function SizeGuideModal({ onClose }: SizeGuideModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={dialogRef}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
        role="dialog"
        aria-label="Size guide"
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-beige">
          <h2 className="font-heading italic text-2xl text-brand">Size Guide</h2>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full text-ink/50 hover:bg-beige/50 hover:text-brand transition-colors text-xl leading-none"
            aria-label="Close size guide"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-5 space-y-7">
          {/* How to measure */}
          <div className="rounded-xl bg-gold-light/20 border border-gold/20 px-4 py-3 text-sm text-ink/70">
            <p className="font-medium text-brand mb-1">How to measure</p>
            <p>Wrap a strip of paper or a thread around your finger / wrist. Mark where it meets, then measure the length with a ruler.</p>
          </div>

          {/* Ring sizes */}
          <div>
            <h3 className="text-sm font-semibold text-brand mb-3 uppercase tracking-wide">Ring Size Chart</h3>
            <div className="overflow-hidden rounded-xl border border-beige text-sm">
              <table className="w-full">
                <thead className="bg-beige/40 text-xs text-ink/60 uppercase">
                  <tr>
                    <th className="px-3 py-2.5 text-left font-medium">India</th>
                    <th className="px-3 py-2.5 text-left font-medium">US / Canada</th>
                    <th className="px-3 py-2.5 text-left font-medium">Circumference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-beige">
                  {ringSizes.map((r) => (
                    <tr key={r.india} className="hover:bg-beige/20">
                      <td className="px-3 py-2 font-medium text-brand">{r.india}</td>
                      <td className="px-3 py-2 text-ink/70">{r.us}</td>
                      <td className="px-3 py-2 text-ink/70">{r.circumference}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bracelet sizes */}
          <div>
            <h3 className="text-sm font-semibold text-brand mb-3 uppercase tracking-wide">Bracelet / Bangle Size</h3>
            <div className="overflow-hidden rounded-xl border border-beige text-sm">
              <table className="w-full">
                <thead className="bg-beige/40 text-xs text-ink/60 uppercase">
                  <tr>
                    <th className="px-3 py-2.5 text-left font-medium">Size</th>
                    <th className="px-3 py-2.5 text-left font-medium">Wrist</th>
                    <th className="px-3 py-2.5 text-left font-medium">Fit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-beige">
                  {braceletSizes.map((b) => (
                    <tr key={b.size} className="hover:bg-beige/20">
                      <td className="px-3 py-2 font-medium text-brand">{b.size}</td>
                      <td className="px-3 py-2 text-ink/70">{b.wrist}</td>
                      <td className="px-3 py-2 text-ink/70">{b.fit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Necklace lengths */}
          <div>
            <h3 className="text-sm font-semibold text-brand mb-3 uppercase tracking-wide">Necklace / Chain Length</h3>
            <div className="space-y-2 text-sm text-ink/70">
              {[
                ["16 inches", "Sits at the collarbone (choker)"],
                ["18 inches", "Classic — just below the collarbone"],
                ["20 inches", "Sits at or below the neckline"],
                ["22–24 inches", "Long pendant / layering length"],
              ].map(([len, desc]) => (
                <div key={len} className="flex gap-3 rounded-lg border border-beige px-3 py-2.5">
                  <span className="font-medium text-brand min-w-[80px]">{len}</span>
                  <span>{desc}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-ink/40 pb-1">
            Still unsure? <a href="/help/contact" className="text-gold underline hover:text-brand">Contact us</a> and we&apos;ll help you find the right fit.
          </p>
        </div>
      </div>
    </div>
  );
}
