import { MagazineCard } from "@/components/ui/MagazineCard";
import { Tip } from "@/features/trip/types/trip";
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
        className={cn(i < level ? "text-amber-400 fill-amber-400" : "text-border dark:text-zinc-800")} 
      />
    ))}
  </div>
);

export default function TipsSection({ tips }: TipsSectionProps) {
  if (!tips || tips.length === 0) return null;

  return (
    <section className="mt-12 md:mt-16">
      <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
        <h2 className="font-playfair text-xl md:text-2xl font-bold text-foreground transition-colors">Deep Column</h2>
        <div className="h-px flex-1 bg-border transition-colors" />
      </div>

      <div className="grid gap-4 md:gap-6">
        {tips.map((tip, i) => (
          <MagazineCard key={i} padding="sm" className="relative overflow-hidden group">
            {/* Category Ribbon */}
            <div className="absolute top-0 right-0">
              <div className="bg-primary/10 dark:bg-primary/20 text-primary text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl border-l border-b border-border transition-colors">
                {tip.category || "General"}
              </div>
            </div>

            <div className="flex items-start gap-3 md:gap-4">
              <div className={cn("mt-1 shrink-0 transition-colors", tip.isWarning ? "text-amber-500" : "text-primary")}>
                {tip.isWarning ? <AlertTriangle size={18} /> : <Lightbulb size={18} />}
              </div>
              <div className="flex-1 pr-10">
                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 mb-2">
                  <h3 className="text-sm font-bold text-foreground transition-colors">{tip.title}</h3>
                  <StarRating level={tip.deepLevel} />
                </div>
                <p className="text-[13px] text-muted-foreground leading-relaxed transition-colors">{tip.body}</p>
              </div>
            </div>
          </MagazineCard>
        ))}
      </div>
    </section>
  );
}
