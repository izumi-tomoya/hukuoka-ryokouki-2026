import { AlertTriangle, Lightbulb, Star } from "lucide-react";
import { MagazineCard } from "@/components/ui/MagazineCard";
import type { Tip } from "@/features/trip/types/trip";
import { cn } from "@/lib/utils";

interface TipsSectionProps {
  tips: Tip[];
}

const StarRating = ({ level = 1 }: { level?: number }) => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star
        // biome-ignore lint/suspicious/noArrayIndexKey: stable array of 5 stars
        key={`star-${i}`}
        size={10}
        className={cn(i < level ? "fill-amber-400 text-amber-400" : "text-border dark:text-zinc-800")}
      />
    ))}
  </div>
);

export default function TipsSection({ tips }: TipsSectionProps) {
  if (!tips || tips.length === 0) return null;

  return (
    <section className="mt-12 md:mt-16">
      <div className="mb-6 flex items-center gap-3 md:mb-8 md:gap-4">
        <h2 className="font-playfair text-foreground text-xl font-bold transition-colors md:text-2xl">Deep Column</h2>
        <div className="bg-border h-px flex-1 transition-colors" />
      </div>

      <div className="grid gap-4 md:gap-6">
        {tips.map((tip, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: tips have no stable unique id
          <MagazineCard key={tip.id || `${tip.title}-${i}`} padding="sm" className="group relative overflow-hidden">
            {/* Category Ribbon */}
            <div className="absolute top-0 right-0">
              <div className="bg-primary/10 dark:bg-primary/20 text-primary border-border rounded-bl-xl border-b border-l px-3 py-1 text-[8px] font-black tracking-widest uppercase transition-colors">
                {tip.category || "General"}
              </div>
            </div>

            <div className="flex items-start gap-3 md:gap-4">
              <div className={cn("mt-1 shrink-0 transition-colors", tip.isWarning ? "text-amber-500" : "text-primary")}>
                {tip.isWarning ? <AlertTriangle size={18} /> : <Lightbulb size={18} />}
              </div>
              <div className="flex-1 pr-10">
                <div className="mb-2 flex flex-col gap-1 md:flex-row md:items-center md:gap-3">
                  <h3 className="text-foreground text-sm font-bold transition-colors">{tip.title}</h3>
                  <StarRating level={tip.deepLevel} />
                </div>
                <p className="text-muted-foreground text-[13px] leading-relaxed transition-colors">{tip.body}</p>
              </div>
            </div>
          </MagazineCard>
        ))}
      </div>
    </section>
  );
}
