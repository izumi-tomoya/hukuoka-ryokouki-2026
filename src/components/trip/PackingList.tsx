"use client";

import { usePackingStore } from "@/lib/store/usePackingStore";

export default function PackingList() {
  const { items, toggleItem } = usePackingStore();

  return (
    <div className="bg-white p-6 rounded-[20px] shadow-sm border border-stone-100">
      <h3 className="text-lg font-bold text-stone-800 mb-4">持ち物リスト</h3>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => toggleItem(item.id)}
              className="h-5 w-5 rounded border-stone-300 text-rose-500 focus:ring-rose-500"
            />
            <span className={item.checked ? "line-through text-stone-400" : "text-stone-700"}>
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
