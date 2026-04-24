import { MagazineCard } from "@/components/ui/MagazineCard";
import { Tip } from "@/features/trip/types/tip";
import { AlertTriangle, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface TipsSectionProps {
  tips: Tip[];
}

export default function TipsSection({ tips }: TipsSectionProps) {
  if (!tips || tips.length === 0) return null;

  return (
    <section className="mt-16">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="font-playfair text-2xl font-bold text-stone-900">Expert Tips</h2>
        <div className="h-px flex-1 bg-stone-200" />
      </div>

      <div className="grid gap-6">
        {tips.map((tip, i) => (
          <MagazineCard key={i} padding="sm" className="flex items-start gap-4">
            <div className={cn("mt-1 shrink-0", tip.isWarning ? "text-amber-500" : "text-rose-400")}>
              {tip.isWarning ? <AlertTriangle size={20} /> : <Lightbulb size={20} />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 mb-1">{tip.title}</h3>
              <p className="text-sm text-stone-600 leading-relaxed">{tip.body}</p>
            </div>
          </MagazineCard>
        ))}
      </div>
    </section>
  );
}
