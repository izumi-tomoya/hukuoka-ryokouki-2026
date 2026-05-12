"use client";

import { useFilterStore } from "@/lib/store/useFilterStore";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "food", label: "グルメ" },
  { id: "sightseeing", label: "観光" },
  { id: "shopping", label: "ショッピング" },
  { id: "hotel", label: "ホテル" },
  { id: "surprise", label: "サプライズ" },
];

export default function CategoryFilter() {
  const { activeCategory, setActiveCategory } = useFilterStore();

  return (
    <div className="mb-8 flex flex-wrap gap-2">
      <button
        type="button"
        className={cn(
          "rounded-full border px-6 py-2 text-xs font-bold tracking-widest uppercase transition-all",
          activeCategory === null
            ? "border-rose-200 bg-rose-50 text-rose-600 shadow-sm"
            : "border-border/50 bg-white text-stone-400 hover:border-rose-100",
        )}
        onClick={() => setActiveCategory(null)}
      >
        すべて
      </button>
      {CATEGORIES.map((cat) => (
        <button
          type="button"
          key={cat.id}
          className={cn(
            "rounded-full border px-6 py-2 text-xs font-bold tracking-widest whitespace-nowrap uppercase transition-all",
            activeCategory === cat.id
              ? "border-rose-200 bg-rose-50 text-rose-600 shadow-sm"
              : "border-border/50 bg-white text-stone-400 hover:border-rose-100",
          )}
          onClick={() => setActiveCategory(cat.id === activeCategory ? null : cat.id)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
