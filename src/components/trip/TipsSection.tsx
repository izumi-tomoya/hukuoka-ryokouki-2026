import { MagazineCard } from "@/components/ui/MagazineCard";
import { Tip } from "@/features/trip/types/tip";
import { AlertTriangle, Lightbulb, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface TipsSectionProps {
  tips: Tip[];
}

const StarRating = ({ level = 1 }: { level?: number }) => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        size={10} 
        className={cn(i < level ? "text-amber-400 fill-amber-400" : "text-stone-200")} 
      />
    ))}
  </div>
);

export default function TipsSection({ tips }: TipsSectionProps) {
  if (!tips || tips.length === 0) return null;

  return (
    <section className="mt-16">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="font-playfair text-2xl font-bold text-stone-900">Deep Fukuoka Column</h2>
        <div className="h-px flex-1 bg-stone-200" />
      </div>

      <div className="grid gap-6">
        {tips.map((tip, i) => (
          <MagazineCard key={i} padding="sm" className="relative overflow-hidden">
            {/* Category Ribbon */}
            <div className="absolute top-0 right-0">
              <div className="bg-rose-50 text-rose-500 text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl border-l border-b border-rose-100">
                {tip.category || "General"}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className={cn("mt-1 shrink-0", tip.isWarning ? "text-amber-500" : "text-rose-400")}>
                {tip.isWarning ? <AlertTriangle size={20} /> : <Lightbulb size={20} />}
              </div>
              <div className="flex-1 pr-12">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-sm font-bold text-stone-900">{tip.title}</h3>
                  <StarRating level={tip.deepLevel} />
                </div>
                <p className="text-sm text-stone-600 leading-relaxed">{tip.body}</p>
              </div>
            </div>
          </MagazineCard>
        ))}
      </div>
    </section>
  );
}
