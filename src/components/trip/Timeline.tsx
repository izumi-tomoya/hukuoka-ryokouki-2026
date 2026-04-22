import type { TripEvent } from "@/types/trip";
import EventCard from "@/components/trip/EventCard";

interface TimelineProps {
  events: TripEvent[];
  dayNumber?: 1 | 2;
}

const dotAccent = {
  1: {
    bg: "bg-orange-500",
    ring: "ring-orange-100",
    line: "from-transparent via-orange-200/50 to-transparent",
    timeBg: "bg-orange-50 text-orange-500 ring-orange-100",
  },
  2: {
    bg: "bg-rose-500",
    ring: "ring-rose-100",
    line: "from-transparent via-rose-200/50 to-transparent",
    timeBg: "bg-rose-50 text-rose-500 ring-rose-100",
  },
} as const;

export default function Timeline({ events, dayNumber = 1 }: TimelineProps) {
  const theme = dotAccent[dayNumber];

  return (
    <div className="relative bg-white px-5 pb-20 pt-8">
      {/* Vertical connecting line */}
      <div
        className={`absolute left-5.25 top-0 h-full w-px bg-linear-to-b ${theme.line}`}
      />

      <div className="relative space-y-6">
        {events.map((event, index) => (
          <div key={index} className="relative flex gap-4">
            {/* Left column: dot */}
            <div className="relative flex w-4 shrink-0 flex-col items-center pt-2.75">
              <div className={`z-10 h-4 w-4 rounded-full border-2 border-white shadow-md ring-4 ${theme.ring} ${theme.bg}`} />
            </div>

            {/* Right column: time + card */}
            <div className="min-w-0 flex-1 pb-2">
              {/* Time pill — in flow, never clipped */}
              <div className="mb-2">
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold tabular-nums ring-1 whitespace-nowrap tracking-tighter ${theme.timeBg}`}
                >
                  {event.time}
                </span>
              </div>

              {/* Card */}
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
      <div className={`absolute bottom-8 left-3.5 h-5 w-5 rounded-full border-4 border-white shadow-sm ${theme.bg} opacity-25`} />
    </div>
  );
}
