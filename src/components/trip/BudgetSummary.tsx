import { MagazineCard } from "@/components/ui/MagazineCard";
import { JapaneseYen } from "lucide-react";
import { TripEvent } from "@/features/trip/types/trip";

export default function BudgetSummary({ events }: { events: TripEvent[] }) {
  const total = events.reduce((sum, e) => sum + (e.budget || 0), 0);
  
  return (
    <MagazineCard padding="sm" className="flex items-center gap-4 bg-rose-50/50 border-rose-100">
      <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-rose-500 shadow-sm">
        <JapaneseYen size={20} />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-400 mb-0.5">Total Budget</p>
        <p className="text-xl font-bold text-stone-900">¥{total.toLocaleString()}</p>
      </div>
    </MagazineCard>
  );
}
