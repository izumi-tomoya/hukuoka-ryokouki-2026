import type { TripEvent } from "@/types/trip";
import EventCard from "@/components/trip/EventCard";

interface TimelineProps {
  events: TripEvent[];
  dayNumber?: 1 | 2;
}

const dotAccent = {
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
} as const;

export default function Timeline({ events, dayNumber = 1 }: TimelineProps) {
  const theme = dotAccent[dayNumber];

  return (
    <div className="relative bg-stone-50 px-5 pb-20 pt-8">
      {/* Vertical connecting line */}
      <div
        className={`absolute left-5 top-0 h-full w-px ${theme.line}`}
      />

      <div className="relative space-y-6">
        {events.map((event, index) => (
          <div key={index} className="relative flex gap-4">
            {/* Left column: dot */}
            <div className="relative flex w-4 shrink-0 flex-col items-center pt-3">
              <div className={`z-10 h-3 w-3 rounded-full border-2 border-white shadow-sm ring-2 ${theme.ring} ${theme.bg}`} />
            </div>

            {/* Right column: time + card */}
            <div className="min-w-0 flex-1 pb-2">
              <div className="mb-3">
                <span
                  className={`inline-block rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest ${theme.timeBg}`}
                >
                  {event.time}
                </span>
              </div>

              <div
                className="animate-in fade-in slide-in-from-bottom-3 duration-500"
                style={{ animationDelay: `${Math.min(index * 70, 500)}ms` }}
              >
                <EventCard event={event} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* End marker */}
      <div className={`absolute bottom-8 left-3.5 h-5 w-5 rounded-full border-4 border-white shadow-sm ${theme.bg} opacity-30`} />
    </div>
  );
}
