"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DualRangeSlider } from "@/components/DualRangeSlider";
import { categories, categoryToSlug } from "@/lib/dummy-images";

type FilterSectionProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-beige py-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between text-sm font-medium text-brand"
      >
        {title}
        <span className="text-ink/40">{open ? "▾" : "▸"}</span>
      </button>
      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked?: boolean;
  onChange?: () => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-ink/70 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-beige accent-gold focus:ring-1 focus:ring-gold"
      />
      {label}
    </label>
  );
}

function Pill({ label }: { label: string }) {
  const [active, setActive] = useState(false);
  return (
    <button
      onClick={() => setActive((a) => !a)}
      className={
        "rounded-full border px-3 py-1 text-xs transition-colors " +
        (active ? "border-gold bg-gold text-brand" : "border-beige text-ink/70 hover:border-gold")
      }
    >
      {label}
    </button>
  );
}

type FilterSidebarProps = {
  priceMin: number;
  priceMax: number;
  activeCategories?: string[]; // category slugs currently applied
};

export function FilterSidebar({ priceMin, priceMax, activeCategories = [] }: FilterSidebarProps) {
  const router = useRouter();

  const toggleCategory = (slug: string) => {
    const next = activeCategories.includes(slug)
      ? activeCategories.filter((s) => s !== slug)
      : [...activeCategories, slug];

    if (next.length === 0) router.push("/jewellery");
    else if (next.length === 1) router.push(`/jewellery/${next[0]}`);
    else router.push(`/jewellery?category=${next.join(",")}`);
  };

  return (
    <aside
      className="w-full lg:w-64 shrink-0 rounded-xl border border-beige p-5 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto [scrollbar-width:thin] [scrollbar-color:var(--color-beige)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-beige [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent"
    >
      <h3 className="font-heading text-xl text-brand mb-4">Filters</h3>

      <FilterSection title="Category">
        {categories.map((c) => {
          const slug = categoryToSlug(c);
          return (
            <Checkbox
              key={c}
              label={c}
              checked={activeCategories.includes(slug)}
              onChange={() => toggleCategory(slug)}
            />
          );
        })}
      </FilterSection>

      <FilterSection title="Price">
        <DualRangeSlider min={priceMin} max={priceMax} step={100} />
      </FilterSection>

      <FilterSection title="Metal type">
        {["Yellow gold", "Rose gold", "White gold", "Platinum", "Silver"].map((m) => (
          <Checkbox key={m} label={m} />
        ))}
      </FilterSection>

      <FilterSection title="Gold karat">
        <div className="flex gap-2">
          {["14k", "18k", "22k"].map((k) => (
            <Pill key={k} label={k} />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Diamond type">
        {["Natural", "Lab-grown", "Solitaire", "No diamond"].map((d) => (
          <Checkbox key={d} label={d} />
        ))}
      </FilterSection>

      <FilterSection title="Diamond colour">
        <div className="flex gap-2">
          {["D-F", "G-H", "I-J"].map((c) => (
            <Pill key={c} label={c} />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Diamond clarity">
        <div className="flex gap-2">
          {["VVS", "VS", "SI"].map((c) => (
            <Pill key={c} label={c} />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Occasion" defaultOpen={false}>
        {["Bridal", "Everyday Light", "Gifting"].map((o) => (
          <Checkbox key={o} label={o} />
        ))}
      </FilterSection>

      <FilterSection title="Availability" defaultOpen={false}>
        <Checkbox label="In stock only" />
      </FilterSection>
    </aside>
  );
}
