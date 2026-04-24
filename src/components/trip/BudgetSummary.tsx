"use client";

import { TripEvent } from "@/features/trip/types/trip";
import { useEventUserStore } from "@/lib/store/useEventUserStore";

export default function BudgetSummary({ events }: { events: TripEvent[] }) {
  const { getBudget } = useEventUserStore();

  const total = events.reduce((acc, event) => {
    // ユーザーが入力した予算があれば優先、なければデフォルト
    const userBudget = event.id ? getBudget(event.id, event.budget) : (event.budget ?? 0);
    return acc + userBudget;
  }, 0);

  return (
    <div className="rounded-3xl bg-rose-50/50 p-6 border border-rose-100/50 backdrop-blur-sm">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <p className="text-[10px] font-black tracking-[2px] text-rose-400 uppercase mb-1">Estimated Budget</p>
          <h3 className="text-sm font-bold text-rose-900">この日の予算目安</h3>
        </div>
        <p className="text-2xl font-bold text-rose-600">
          <span className="text-sm mr-1">¥</span>
          {total.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
