import type { TripEvent } from "@/features/trip/types/trip";
import dynamic from "next/dynamic";

const EventCard = dynamic(() => import("@/components/trip/EventCard"), {
  loading: () => <div className="h-40 w-full animate-pulse rounded-[22px] bg-stone-100" />,
});

interface TimelineProps {
  events: TripEvent[];
  dayNumber?: number;
  isAdmin?: boolean;
}

const getTheme = (dayNumber: number) => {
  const themes = {
    1: {
      bg: "bg-rose-300",
      ring: "ring-rose-50",
      line: "bg-rose-100",
      timeBg: "bg-rose-50 text-rose-500",
    },
    2: {
      bg: "bg-purple-300",
      ring: "ring-purple-50",
      line: "bg-purple-100",
      timeBg: "bg-purple-50 text-purple-500",
    },
  };
  return themes[dayNumber as keyof typeof themes] || {
    bg: "bg-stone-300",
    ring: "ring-stone-50",
    line: "bg-stone-100",
    timeBg: "bg-stone-50 text-stone-500",
  };
};

export default function Timeline({ events, dayNumber = 1, isAdmin }: TimelineProps) {
  const theme = getTheme(dayNumber);

  return (
    <div className="relative bg-stone-50 px-3 pb-20 pt-8">
      {/* Vertical connecting line - move slightly left */}
      <div
        className={`absolute left-[19px] top-0 h-full w-px ${theme.line}`}
      />

      <div className="relative space-y-6">
        {events.map((event, index) => (
          <div key={index} className="relative flex gap-2 md:gap-4">
            {/* Left column: dot */}
            <div className="relative flex w-6 shrink-0 flex-col items-center pt-3">
              <div className={`z-10 h-3 w-3 rounded-full border-2 border-white shadow-sm ring-2 ${theme.ring} ${theme.bg}`} />
            </div>

            {/* Right column: time + card */}
            <div className="min-w-0 flex-1 pb-2">
              <div className="mb-2">
                <span
                  className={`inline-block rounded-full px-3 py-0.5 text-[9px] font-black uppercase tracking-widest ${theme.timeBg}`}
                >
                  {event.time}
                </span>
              </div>

              <div
                className="animate-in fade-in slide-in-from-bottom-3 duration-500"
                style={{ animationDelay: `${Math.min(index * 70, 500)}ms` }}
              >
                <EventCard event={event} isAdmin={isAdmin} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* End marker */}
      <div className={`absolute bottom-8 left-[13px] h-4 w-4 rounded-full border-4 border-white shadow-sm ${theme.bg} opacity-30`} />
    </div>
  );
}
