"use client";

import { Clock } from "lucide-react";
import type { YataiStop } from "@/features/trip/types/trip";
import { cn } from "@/lib/utils";

interface YataiLiveTrackerProps {
  stops: YataiStop[];
  eventId: string;
}

export default function YataiLiveTracker({ stops }: YataiLiveTrackerProps) {
  if (!stops || stops.length === 0) return null;

  return (
    <div className="relative mt-8 space-y-4">
      <div className="mb-6 flex items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 h-3 w-3 animate-ping rounded-full bg-rose-500" />
          <div className="relative h-3 w-3 rounded-full bg-rose-500" />
        </div>
        <span className="text-[10px] font-black tracking-[0.3em] text-rose-500 uppercase">Live Status</span>
      </div>

      <div className="space-y-6">
        {stops.map((stop, i) => (
          <div key={stop.stop} className="group relative flex gap-4">
            {/* Connecting line */}
            {i !== stops.length - 1 && (
              <div className="bg-muted/50 absolute top-6 bottom-[-24px] left-[13px] w-px transition-colors group-hover:bg-rose-100" />
            )}

            <div
              className={cn(
                "z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-bold shadow-sm transition-all",
                stop.isVisited
                  ? "border-stone-800 bg-stone-800 text-white"
                  : "border-border/50 bg-white text-stone-400 group-hover:border-rose-200 group-hover:text-rose-500",
              )}
            >
              {i + 1}
            </div>

            <div className="flex-1 pb-4">
              <div className="mb-1 flex items-center justify-between">
                <h4
                  className={cn(
                    "text-sm font-bold transition-colors",
                    stop.isVisited ? "text-stone-900" : "text-stone-500 group-hover:text-rose-600",
                  )}
                >
                  {stop.stop}
                </h4>
                <div className="bg-secondary/30 flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[9px] font-bold text-stone-400">
                  <Clock size={10} />
                  {stop.time}
                </div>
              </div>
              <p className="text-[11px] leading-relaxed font-medium text-stone-400">{stop.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
