import { Skeleton } from "@/components/ui/Skeleton";
import { MagazineCard } from "@/components/ui/MagazineCard";
import { Sparkles } from "lucide-react";

export default function AIAdvisorSkeleton() {
  return (
    <section className="mt-16">
      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-300">
            <Sparkles size={20} />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-2 w-24" />
          </div>
        </div>
        <div className="h-px flex-1 bg-stone-100" />
      </div>

      <MagazineCard padding="none" className="overflow-hidden border-rose-100 shadow-xl shadow-rose-100/20">
        {/* Chat Display Area Skeleton */}
        <div className="h-[400px] p-6 space-y-6 bg-stone-50/30">
          <div className="flex gap-4">
            <Skeleton className="h-8 w-8 rounded-xl shrink-0" />
            <Skeleton className="h-20 w-[60%] rounded-3xl rounded-tl-none" />
          </div>
          <div className="flex gap-4 flex-row-reverse">
            <Skeleton className="h-8 w-8 rounded-xl shrink-0" />
            <Skeleton className="h-12 w-[40%] rounded-3xl rounded-tr-none" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-8 w-8 rounded-xl shrink-0" />
            <Skeleton className="h-16 w-[50%] rounded-3xl rounded-tl-none" />
          </div>
        </div>

        {/* Input Area Skeleton */}
        <div className="p-4 bg-white border-t border-stone-50 flex gap-2">
          <Skeleton className="h-11 flex-1 rounded-2xl" />
          <Skeleton className="h-11 w-11 rounded-2xl shrink-0" />
        </div>
      </MagazineCard>
    </section>
  );
}
