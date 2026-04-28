'use client';

import type { TripEvent } from "@/features/trip/types/trip";
import dynamic from "next/dynamic";
import TransitTimeline from "./TransitTimeline";
import { cn } from "@/lib/utils";

const EventCard = dynamic(() => import("@/features/trip/components/EventCard"), {
  loading: () => <div className="h-40 w-full animate-pulse rounded-[22px] bg-secondary" />,
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
  return themes[dayNumber as keyof typeof themes] || {
    bg: "bg-primary",
    ring: "ring-primary/20",
    line: "bg-border",
    timeBg: "bg-secondary text-primary",
  };
};

export default function Timeline({ events, dayNumber = 1, isAdmin }: TimelineProps) {
  const theme = getTheme(dayNumber);

  return (
    <div className="relative bg-transparent px-0 md:px-3 pb-20 pt-8 transition-colors duration-500">
      {/* Vertical connecting line */}
      <div
        className={cn(
          "absolute left-[7px] md:left-[23px] top-0 h-full w-[2px] opacity-50",
          theme.line
        )}
      />

      <div className="relative space-y-10">
        {events.map((event, index) => (
          <div key={index} className="relative flex gap-2 md:gap-4 group">
            {/* Left column: dot */}
            <div className="relative flex w-4 md:w-6 shrink-0 flex-col items-center pt-4">
              <div className={cn(
                "z-10 h-3 w-3 rounded-full border-2 border-background shadow-lg ring-4 transition-all group-hover:scale-125",
                theme.ring,
                theme.bg
              )} />
            </div>

            {/* Right column: time + card */}
            <div className="min-w-0 flex-1 pb-2">
              <div className="mb-4">
                <span
                  className={cn(
                    "inline-block rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm",
                    theme.timeBg
                  )}
                >
                  {event.time}
                </span>
              </div>

              <div
                className="animate-in fade-in slide-in-from-bottom-3 duration-500"
                style={{ animationDelay: `${Math.min(index * 70, 500)}ms` }}
              >
                <EventCard event={event} isAdmin={isAdmin} />
                
                {/* 移動経路 */}
                {event.transitSteps && event.transitSteps.length > 0 && (isAdmin || event.tag !== 'surprise') && (
                  <div className="mt-4 pl-2">
                    <TransitTimeline steps={event.transitSteps} isAdmin={isAdmin} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* End marker */}
      <div className={cn(
        "absolute bottom-8 left-[3px] md:left-[17px] h-4 w-4 rounded-full border-2 border-background shadow-lg opacity-50",
        theme.bg
      )} />
    </div>
  );
}
