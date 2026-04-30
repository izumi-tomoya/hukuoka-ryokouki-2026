import { Skeleton } from "@/components/ui/Skeleton";
import { MapPin } from "lucide-react";

export default function TripMapSkeleton() {
  return (
    <div className="group relative opacity-60">
      <div className="relative h-80 w-full rounded-[3.5rem] overflow-hidden border border-rose-100 shadow-xl shadow-rose-100/10 bg-stone-50">
        <Skeleton className="h-full w-full" />
        
        {/* Floating Label Skeleton at Top Left */}
        <div className="absolute top-6 left-6 z-10 flex flex-col gap-1">
          <div className="bg-stone-900/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-stone-800 shadow-xl flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-rose-500/50" />
            <Skeleton className="h-2 w-16 bg-white/20" />
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center gap-2 opacity-20">
            <MapPin size={32} className="text-rose-400" />
            <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Loading Map...</p>
          </div>
        </div>
      </div>

      {/* Bottom Caption Skeleton */}
      <div className="mt-5 px-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-rose-200" />
            <Skeleton className="h-3 w-32" />
          </div>
          <div className="flex items-baseline gap-2 pl-16">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 pr-4">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>
    </div>
  );
}
