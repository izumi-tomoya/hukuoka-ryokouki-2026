import { MagazineCard } from "@/components/ui/MagazineCard";
import { JapaneseYen, AlertCircle } from "lucide-react";
import { TripEvent } from "@/features/trip/types/trip";
import { cn } from "@/lib/utils";

export default function BudgetSummary({ events }: { events: TripEvent[] }) {
  const plannedTotal = events.reduce((sum, e) => sum + (e.plannedBudget || e.budget || 0), 0);
  const actualTotal = events.reduce((sum, e) => sum + (e.actualExpense || 0), 0);
  const hasActuals = events.some(e => (e.actualExpense || 0) > 0);
  
  const isOverBudget = hasActuals && actualTotal > plannedTotal;

  return (
    <MagazineCard 
      padding="sm" 
      className={cn(
        "flex items-center gap-4 transition-all",
        isOverBudget ? "bg-amber-50 border-amber-200" : "bg-rose-50/50 border-rose-100"
      )}
    >
      <div className={cn(
        "h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm transition-colors",
        isOverBudget ? "bg-white text-amber-500" : "bg-white text-rose-500"
      )}>
        {isOverBudget ? <AlertCircle size={20} /> : <JapaneseYen size={20} />}
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-400 mb-0.5">
          {hasActuals ? "Actual vs Planned" : "Total Budget"}
        </p>
        <div className="flex items-baseline gap-2">
          <p className={cn("text-xl font-bold tracking-tight", isOverBudget ? "text-amber-600" : "text-stone-900")}>
            ¥{(hasActuals ? actualTotal : plannedTotal).toLocaleString()}
          </p>
          {hasActuals && (
            <span className="text-[10px] font-bold text-stone-400">
              / ¥{plannedTotal.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </MagazineCard>
  );
}
