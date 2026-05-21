import { AlertCircle, JapaneseYen } from "lucide-react";
import { MagazineCard } from "@/components/ui/MagazineCard";
import type { TripEvent } from "@/features/trip/types/trip";
import { cn } from "@/lib/utils";

export default function BudgetSummary({ events }: { events: TripEvent[] }) {
  const plannedTotal = events.reduce((sum, e) => sum + (e.plannedBudget || e.budget || 0), 0);
  const actualTotal = events.reduce((sum, e) => sum + (e.actualExpense || 0), 0);
  const hasActuals = actualTotal > 0;
  const isOverBudget = hasActuals && actualTotal > plannedTotal;

  return (
    <MagazineCard
      padding="sm"
      className={cn(
        "flex items-center gap-3 transition-all md:gap-4",
        isOverBudget
          ? "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20"
          : "dark:bg-background dark:border-border border-rose-100 bg-rose-50/50",
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl shadow-sm transition-colors md:h-12 md:w-12 md:rounded-2xl",
          isOverBudget ? "dark:bg-card bg-white text-amber-500" : "dark:bg-card bg-white text-rose-500",
        )}
      >
        {isOverBudget ? <AlertCircle size={18} /> : <JapaneseYen size={18} />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="mb-0.5 truncate text-[9px] font-black tracking-[0.2em] text-rose-400 uppercase md:text-[10px] dark:text-rose-500">
          {hasActuals ? "Actual Expense" : "Planned Budget"}
        </p>
        <div className="flex items-baseline gap-1.5 md:gap-2">
          <p
            className={cn(
              "truncate text-lg font-bold tracking-tight md:text-xl",
              isOverBudget ? "text-amber-600 dark:text-amber-400" : "dark:text-foreground text-stone-900",
            )}
          >
            ¥{(hasActuals ? actualTotal : plannedTotal).toLocaleString()}
          </p>
          {hasActuals && (
            <span className="dark:text-muted-foreground truncate text-[9px] font-bold text-stone-400 md:text-[10px]">
              / ¥{plannedTotal.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </MagazineCard>
  );
}
