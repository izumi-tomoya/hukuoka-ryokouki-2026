"use client";

import { useFilterStore } from "@/lib/store/useFilterStore";
import { Badge } from "@/components/ui/badge";
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
    <div className="flex flex-wrap gap-2 mb-8">
      <button
        className={cn(
          "px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all border",
          activeCategory === null
            ? "bg-rose-50 border-rose-200 text-rose-600 shadow-sm"
            : "bg-white border-stone-100 text-stone-400 hover:border-rose-100"
        )}
        onClick={() => setActiveCategory(null)}
      >
        すべて
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          className={cn(
            "px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all border whitespace-nowrap",
            activeCategory === cat.id
              ? "bg-rose-50 border-rose-200 text-rose-600 shadow-sm"
              : "bg-white border-stone-100 text-stone-400 hover:border-rose-100"
          )}
          onClick={() => setActiveCategory(cat.id === activeCategory ? null : cat.id)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
