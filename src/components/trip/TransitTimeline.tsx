"use client";

import { TransitStep } from "@/features/trip/types/trip";
import { Train, Bus, Footprints, MapPin, ChevronRight, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  steps: TransitStep[];
}

const getModeIcon = (mode: string) => {
  switch (mode) {
    case 'walking': return <Footprints size={14} className="text-zinc-400" />;
    case 'subway': return <Train size={14} className="text-blue-500" />;
    case 'train': return <Train size={14} className="text-rose-500" />;
    case 'bus': return <Bus size={14} className="text-green-500" />;
    case 'arrival': return <MapPin size={14} className="text-rose-600" />;
    default: return <Info size={14} />;
  }
};

const getLineColor = (mode: string) => {
  switch (mode) {
    case 'subway': return "bg-blue-500";
    case 'train': return "bg-rose-500";
    default: return "bg-zinc-200";
  }
};

export default function TransitTimeline({ steps }: Props) {
  return (
    <div className="mt-6 space-y-0">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const isWalking = step.mode === 'walking';
        const isArrival = step.mode === 'arrival';

        return (
          <div key={index} className="relative flex gap-4">
            {/* Left: Time and Line */}
            <div className="flex flex-col items-center w-12 shrink-0">
              <span className="text-[10px] font-bold text-zinc-500 mb-1">{step.time}</span>
              
              <div className="relative flex-1 flex flex-col items-center">
                {/* Dot */}
                <div className={cn(
                  "h-3 w-3 rounded-full border-2 border-white shadow-sm z-10",
                  isArrival ? "bg-rose-600" : isWalking ? "bg-zinc-300" : getLineColor(step.mode)
                )} />
                
                {/* Line */}
                {!isLast && (
                  <div className={cn(
                    "w-1 flex-1 -mt-1 -mb-1",
                    isWalking ? "border-l-2 border-dotted border-zinc-200" : getLineColor(step.mode)
                  )} />
                )}
              </div>
            </div>

            {/* Right: Content */}
            <div className={cn("flex-1 pb-6 min-w-0", isLast && "pb-0")}>
              <div className="flex items-center justify-between gap-2">
                <h5 className={cn(
                  "text-sm font-bold tracking-tight truncate",
                  isArrival ? "text-rose-600" : "text-zinc-800"
                )}>
                  {step.station}
                </h5>
                {step.fare && (
                  <span className="text-[10px] font-bold text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded shrink-0">
                    {step.fare}
                  </span>
                )}
              </div>

              {/* Transit Detail Box */}
              {!isArrival && (
                <div className="mt-2 bg-white rounded-xl p-3 border border-stone-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-stone-50 flex items-center justify-center border border-stone-100 shrink-0">
                      {getModeIcon(step.mode)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-stone-800 truncate">
                          {step.lineName || (isWalking ? "徒歩" : "")}
                        </span>
                        {step.duration && (
                          <span className="text-[10px] font-bold text-stone-500 shrink-0">
                            {step.duration}
                          </span>
                        )}
                      </div>
                      
                      {(step.platform || step.exit) && (
                        <div className="mt-1 flex gap-2">
                          {step.platform && (
                            <span className="text-[9px] font-bold text-stone-500 bg-stone-100 px-1 py-0.5 rounded">
                              {step.platform}
                            </span>
                          )}
                          {step.exit && (
                            <span className="text-[9px] font-bold text-rose-700 bg-rose-50 border border-rose-100 px-1 py-0.5 rounded">
                              {step.exit}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    {isWalking && <ChevronRight size={12} className="text-stone-300" />}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
