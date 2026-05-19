"use client";

import { Bus, ChevronRight, Footprints, Info, MapPin, Train } from "lucide-react";
import type { TransitStep } from "@/features/trip/types/trip";
import { maskLineName, maskSecretText } from "@/features/trip/utils/tripUtils";
import { cn } from "@/lib/utils";

interface Props {
  steps: TransitStep[];
  isAdmin?: boolean;
}

const getModeIcon = (mode: string) => {
  switch (mode) {
    case "walking":
      return <Footprints size={14} className="text-muted-foreground" />;
    case "subway":
      return <Train size={14} className="text-blue-500" />;
    case "train":
      return <Train size={14} className="text-rose-500" />;
    case "bus":
      return <Bus size={14} className="text-green-500" />;
    case "arrival":
      return <MapPin size={14} className="text-rose-600" />;
    default:
      return <Info size={14} />;
  }
};

const getLineColor = (mode: string) => {
  switch (mode) {
    case "subway":
      return "bg-blue-500";
    case "train":
      return "bg-rose-500";
    default:
      return "bg-border";
  }
};

export default function TransitTimeline({ steps, isAdmin = false }: Props) {
  return (
    <div className="mt-6 space-y-0">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const isWalking = step.mode === "walking";
        const isArrival = step.mode === "arrival";

        return (
          <div key={step.id || `${step.time}-${step.station}`} className="relative flex gap-4">
            {/* Left: Time and Line */}
            <div className="flex w-12 shrink-0 flex-col items-center">
              <span className="text-muted-foreground mb-1 text-[10px] font-bold">{step.time}</span>

              <div className="relative flex flex-1 flex-col items-center">
                {/* Dot */}
                <div
                  className={cn(
                    "border-background z-10 h-3 w-3 rounded-full border-2 shadow-sm",
                    isArrival ? "bg-rose-600" : isWalking ? "bg-muted" : getLineColor(step.mode),
                  )}
                />

                {/* Line */}
                {!isLast && (
                  <div
                    className={cn(
                      "-mt-1 -mb-1 w-1 flex-1",
                      isWalking ? "border-border border-l-2 border-dotted" : getLineColor(step.mode),
                    )}
                  />
                )}
              </div>
            </div>

            {/* Right: Content */}
            <div className={cn("min-w-0 flex-1 pb-6", isLast && "pb-0")}>
              <div className="flex items-center justify-between gap-2">
                <h5
                  className={cn(
                    "truncate text-sm font-bold tracking-tight",
                    isArrival ? "text-rose-600 dark:text-rose-400" : "text-foreground",
                  )}
                >
                  {maskSecretText(step.station, isAdmin)}
                </h5>
                {step.fare && (
                  <span className="text-muted-foreground bg-secondary shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold transition-colors">
                    {step.fare}
                  </span>
                )}
              </div>

              {/* Transit Detail Box */}
              {!isArrival && (
                <div className="bg-card border-border mt-2 rounded-xl border p-3 shadow-sm transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="bg-secondary border-border flex h-8 w-8 shrink-0 items-center justify-center rounded-full border">
                      {getModeIcon(step.mode)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-foreground text-xs font-bold">
                          {maskLineName(step.lineName, isAdmin) || (isWalking ? "徒歩" : "")}
                        </span>
                        {step.duration && (
                          <span className="text-muted-foreground shrink-0 text-[10px] font-bold">{step.duration}</span>
                        )}
                      </div>

                      {(step.platform || step.exit) && (
                        <div className="mt-1 flex gap-2">
                          {step.platform && (
                            <span className="text-muted-foreground bg-secondary rounded px-1 py-0.5 text-[9px] font-bold">
                              {step.platform}
                            </span>
                          )}
                          {step.exit && (
                            <span className="rounded border border-rose-100 bg-rose-50 px-1 py-0.5 text-[9px] font-bold text-rose-700 dark:border-rose-900 dark:bg-rose-900/20 dark:text-rose-400">
                              {step.exit}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    {isWalking && <ChevronRight size={12} className="text-muted/50" />}
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
