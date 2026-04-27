import { Skeleton } from "@/components/ui/Skeleton";
import { MagazineCard } from "@/components/ui/MagazineCard";
import { MapPin } from "lucide-react";

export default function TripMapSkeleton() {
  return (
    <MagazineCard padding="none" className="relative h-80 w-full overflow-hidden border-rose-100 shadow-xl shadow-rose-100/10">
      <Skeleton className="h-full w-full" />
      
      {/* Overlay info skeleton */}
      <div className="absolute bottom-6 left-6 z-[1000] bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-rose-100 shadow-sm flex flex-col gap-1">
        <Skeleton className="h-2 w-16" />
        <Skeleton className="h-3 w-24" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center gap-2 opacity-20">
          <MapPin size={32} className="text-rose-400" />
          <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Loading Map...</p>
        </div>
      </div>
    </MagazineCard>
  );
}
