"use client";

import dynamic from "next/dynamic";
import type { TripEvent } from "@/features/trip/types/trip";
import { cn } from "@/lib/utils";
import EventCardSkeleton from "./EventCardSkeleton";
import TransitTimeline from "./TransitTimeline";

const EventCard = dynamic(() => import("@/features/trip/components/EventCard"), {
  loading: () => <EventCardSkeleton />,
});

interface TimelineProps {
  events: TripEvent[];
  dayNumber?: number;
  isAdmin?: boolean;
}

const getTheme = (dayNumber: number) => {
  const themes = {
    1: {
      bg: "bg-rose-400",
      ring: "ring-rose-400/20",
      line: "bg-rose-400/20",
      timeBg: "bg-rose-500/10 text-rose-500",
    },
    2: {
      bg: "bg-purple-400",
      ring: "ring-purple-400/20",
      line: "bg-purple-400/20",
      timeBg: "bg-purple-500/10 text-purple-500",
    },
  };
  return (
    themes[dayNumber as keyof typeof themes] || {
      bg: "bg-primary",
      ring: "ring-primary/20",
      line: "bg-border",
      timeBg: "bg-secondary text-primary",
    }
  );
};

export default function Timeline({ events, dayNumber = 1, isAdmin }: TimelineProps) {
  const theme = getTheme(dayNumber);

  return (
    <div className="relative bg-transparent px-0 pt-8 pb-20 transition-colors duration-500 md:px-3">
      {/* Vertical connecting line */}
      <div className={cn("absolute top-0 left-[7px] h-full w-[2px] opacity-50 md:left-[23px]", theme.line)} />

      <div className="relative space-y-10">
        {events.map((event, index) => {
          const previousEvent = index > 0 ? events[index - 1] : null;
          const prevLoc = previousEvent
            ? previousEvent.foodName || previousEvent.formalName || previousEvent.title
            : null;

          return (
            <div key={event.slug || event.id || index} className="group relative flex gap-2 md:gap-4">
              {/* Left column: dot */}
              <div className="relative flex w-4 shrink-0 flex-col items-center pt-4 md:w-6">
                <div
                  className={cn(
                    "border-background z-10 h-3 w-3 rounded-full border-2 shadow-lg ring-4 transition-all group-hover:scale-125",
                    theme.ring,
                    theme.bg,
                  )}
                />
              </div>

              {/* Right column: time + card */}
              <div className="min-w-0 flex-1 pb-2">
                <div className="mb-4">
                  <span
                    className={cn(
                      "inline-block rounded-full px-4 py-1 text-[10px] font-black tracking-widest uppercase shadow-sm",
                      theme.timeBg,
                    )}
                  >
                    {event.time}
                  </span>
                </div>

                <div
                  className="animate-in fade-in slide-in-from-bottom-3 duration-500"
                  style={{ animationDelay: `${Math.min(index * 70, 500)}ms` }}
                >
                  {/* 移動経路 */}
                  {event.transitSteps && event.transitSteps.length > 0 && (
                    <div className="mb-6 pl-2">
                      <TransitTimeline steps={event.transitSteps} isAdmin={isAdmin} />
                    </div>
                  )}

                  <EventCard event={event} isAdmin={isAdmin} previousLocation={prevLoc || undefined} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* End marker */}
      <div
        className={cn(
          "border-background absolute bottom-8 left-[3px] h-4 w-4 rounded-full border-2 opacity-50 shadow-lg md:left-[17px]",
          theme.bg,
        )}
      />
    </div>
  );
}
