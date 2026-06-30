"use client";

import { useEffect, useRef, useState } from "react";

type Option = { value: string; label: string };

type DropdownProps = {
  options: Option[];
  defaultValue?: string;
  onChange?: (value: string) => void;
};

export function Dropdown({ options, defaultValue, onChange }: DropdownProps) {
  const [value, setValue] = useState(defaultValue ?? options[0]?.value);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onClickOutside);
    return () => document.removeEventListener("click", onClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-gold bg-white px-4 py-2 text-sm text-brand focus:outline-none focus:ring-1 focus:ring-gold"
      >
        {selected?.label}
        <span className={"text-gold transition-transform " + (open ? "rotate-180" : "")}>▾</span>
      </button>

      {open && (
        <ul className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-lg border border-beige bg-white shadow-lg">
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                onClick={() => {
                  setValue(opt.value);
                  onChange?.(opt.value);
                  setOpen(false);
                }}
                className={
                  "w-full px-4 py-2 text-left text-sm transition-colors hover:bg-gold-light/30 " +
                  (opt.value === value ? "text-brand font-medium bg-gold-light/20" : "text-ink/70")
                }
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
