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
    <div className="flex gap-2 p-4 overflow-x-auto scrollbar-hide">
      <Badge
        variant={activeCategory === null ? "default" : "outline"}
        className="cursor-pointer px-4 py-1.5"
        onClick={() => setActiveCategory(null)}
      >
        すべて
      </Badge>
      {CATEGORIES.map((cat) => (
        <Badge
          key={cat.id}
          variant={activeCategory === cat.id ? "default" : "outline"}
          className={cn(
            "cursor-pointer px-4 py-1.5 whitespace-nowrap",
            activeCategory === cat.id ? "bg-rose-500 hover:bg-rose-600" : ""
          )}
          onClick={() => setActiveCategory(cat.id === activeCategory ? null : cat.id)}
        >
          {cat.label}
        </Badge>
      ))}
    </div>
  );
}
