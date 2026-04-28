'use client';

import { MagazineCard } from "@/components/ui/MagazineCard";
import { JapaneseYen, AlertCircle } from "lucide-react";
import { TripEvent } from "@/features/trip/types/trip";
import { cn } from "@/lib/utils";
import { useEventUserStore } from "@/lib/store/useEventUserStore";

export default function BudgetSummary({ events }: { events: TripEvent[] }) {
  const { getBudget } = useEventUserStore();

  // 各イベントの予算（予定額）を計算。ユーザーが上書きした値があればそれを使用し、なければDBの値を優先。
  // ここでは plannedTotal はDBの予定額、actualTotal はユーザーが入力した実績額とする。
  const plannedTotal = events.reduce((sum, e) => sum + (e.plannedBudget || e.budget || 0), 0);
  
  // クライアントサイドのストアから各イベントの入力を取得して合計する
  const actualTotal = events.reduce((sum, e) => {
    if (!e.id) return sum;
    return sum + getBudget(e.id, 0); // 第2引数を0にすることで、入力がない場合は0として扱う
  }, 0);

  const hasActuals = actualTotal > 0;
  const isOverBudget = hasActuals && actualTotal > plannedTotal;

  return (
    <MagazineCard 
      padding="sm" 
      className={cn(
        "flex items-center gap-3 md:gap-4 transition-all",
        isOverBudget 
          ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800" 
          : "bg-rose-50/50 dark:bg-zinc-900 border-rose-100 dark:border-zinc-800"
      )}
    >
      <div className={cn(
        "h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl flex items-center justify-center shadow-sm transition-colors",
        isOverBudget ? "bg-white dark:bg-zinc-800 text-amber-500" : "bg-white dark:bg-zinc-800 text-rose-500"
      )}>
        {isOverBudget ? <AlertCircle size={18} /> : <JapaneseYen size={18} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-rose-400 dark:text-rose-500 mb-0.5 truncate">
          {hasActuals ? "Actual Expense" : "Planned Budget"}
        </p>
        <div className="flex items-baseline gap-1.5 md:gap-2">
          <p className={cn("text-lg md:text-xl font-bold tracking-tight truncate", isOverBudget ? "text-amber-600 dark:text-amber-400" : "text-stone-900 dark:text-zinc-100")}>
            ¥{(hasActuals ? actualTotal : plannedTotal).toLocaleString()}
          </p>
          {hasActuals && (
            <span className="text-[9px] md:text-[10px] font-bold text-stone-400 dark:text-zinc-500 truncate">
              / ¥{plannedTotal.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </MagazineCard>
  );
}
