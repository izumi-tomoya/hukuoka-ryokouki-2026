import { Skeleton } from "@/components/ui/Skeleton";
import { MagazineCard } from "@/components/ui/MagazineCard";
import { Sparkles, Bot } from "lucide-react";

export default function AIAdvisorSkeleton() {
  return (
    <section className="mt-16 animate-fade-up">
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary/30">
            <Sparkles size={20} />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </div>

      <MagazineCard padding="none" className="overflow-hidden border-border opacity-60">
        {/* Chat Area Skeleton */}
        <div className="h-[450px] p-6 space-y-8 bg-secondary/10">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`flex gap-4 ${i % 2 === 0 ? "flex-row-reverse" : "flex-row"}`}
            >
              <Skeleton className="h-8 w-8 rounded-xl shrink-0" />
              <div className={`flex flex-col gap-2 ${i % 2 === 0 ? "items-end" : "items-start"} grow max-w-[70%]`}>
                <Skeleton className={`h-16 w-full rounded-3xl ${i % 2 === 0 ? "rounded-tr-none" : "rounded-tl-none"}`} />
                <Skeleton className="h-2 w-20" />
              </div>
            </div>
          ))}
        </div>

        {/* Input Area Skeleton */}
        <div className="p-5 bg-card border-t border-border flex gap-3">
          <Skeleton className="h-12 grow rounded-2xl" />
          <Skeleton className="h-12 w-12 rounded-2xl shrink-0" />
        </div>
      </MagazineCard>
    </section>
  );
}
