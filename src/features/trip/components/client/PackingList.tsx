"use client";

import { usePackingStore } from "@/lib/store/usePackingStore";
import { MagazineCard } from "@/components/ui/MagazineCard";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PackingListProps {
  category: string;
  items: { id: string; name: string; checked: boolean }[];
}

export default function PackingList({ category, items: categoryItems }: PackingListProps) {
  const { toggleItem } = usePackingStore();

  return (
    <MagazineCard className="flex flex-col gap-6 h-full border-rose-100/50">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-stone-900 leading-tight">{category}</h3>
        <div className="px-3 py-1 bg-stone-50 rounded-full text-[10px] font-black uppercase text-stone-400">
          {categoryItems.filter(i => i.checked).length} / {categoryItems.length}
        </div>
      </div>
      
      <div className="space-y-4">
        {categoryItems.map((item) => (
          <button
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className="w-full flex items-start gap-4 text-left group transition-all"
          >
            <div className={cn(
              "h-6 w-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all",
              item.checked ? "bg-rose-500 text-white shadow-lg shadow-rose-200" : "bg-stone-50 text-stone-300 ring-1 ring-stone-100 group-hover:ring-rose-200 group-hover:bg-rose-50"
            )}>
              {item.checked ? <CheckCircle2 size={14} /> : <Circle size={14} className="opacity-50" />}
            </div>
            <span className={cn(
              "text-sm font-medium transition-colors",
              item.checked ? "text-stone-300 line-through" : "text-stone-600 group-hover:text-rose-600"
            )}>
              {item.name}
            </span>
          </button>
        ))}
      </div>
    </MagazineCard>
  );
}
