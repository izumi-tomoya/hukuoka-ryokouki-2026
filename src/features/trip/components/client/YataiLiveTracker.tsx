"use client";

import { YataiStop } from "@/features/trip/types/trip";
import { Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface YataiLiveTrackerProps {
  stops: YataiStop[];
  eventId: string;
}

export default function YataiLiveTracker({ stops }: YataiLiveTrackerProps) {
  if (!stops || stops.length === 0) return null;

  return (
    <div className="relative mt-8 space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <div className="h-3 w-3 rounded-full bg-rose-500 animate-ping absolute inset-0" />
          <div className="h-3 w-3 rounded-full bg-rose-500 relative" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500">Live Status</span>
      </div>

      <div className="space-y-6">
        {stops.map((stop, i) => (
          <div key={i} className="relative flex gap-4 group">
            {/* Connecting line */}
            {i !== stops.length - 1 && (
              <div className="absolute left-[13px] top-6 bottom-[-24px] w-px bg-stone-100 group-hover:bg-rose-100 transition-colors" />
            )}

            <div className={cn(
              "z-10 h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-all shadow-sm border-2",
              stop.isVisited 
                ? "bg-stone-800 text-white border-stone-800" 
                : "bg-white text-stone-400 border-stone-100 group-hover:border-rose-200 group-hover:text-rose-500"
            )}>
              {i + 1}
            </div>

            <div className="flex-1 pb-4">
              <div className="flex items-center justify-between mb-1">
                <h4 className={cn(
                  "text-sm font-bold transition-colors",
                  stop.isVisited ? "text-stone-900" : "text-stone-500 group-hover:text-rose-600"
                )}>
                  {stop.stop}
                </h4>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-stone-50 text-[9px] font-bold text-stone-400">
                  <Clock size={10} />
                  {stop.time}
                </div>
              </div>
              <p className="text-[11px] text-stone-400 leading-relaxed font-medium">
                {stop.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
