import type { TripEvent } from "@/types/trip";
import EventCard from "@/components/trip/EventCard";

interface TimelineProps {
  events: TripEvent[];
  dayNumber?: 1 | 2;
}

const dotAccent = {
  1: { ring: "ring-orange-100", bg: "bg-orange-500", line: "from-transparent via-orange-200/60 to-transparent" },
  2: { ring: "ring-rose-100", bg: "bg-rose-500", line: "from-transparent via-rose-200/60 to-transparent" },
} as const;

export default function Timeline({ events, dayNumber = 1 }: TimelineProps) {
  const theme = dotAccent[dayNumber];

  return (
    <div className="relative bg-white px-5 pb-20 pt-10">
      {/* Vertical connecting line */}
      <div
        className={`absolute left-8.25 top-0 h-full w-0.375 bg-linear-to-b ${theme.line}`}
      />

      <div className="relative space-y-8">
        {events.map((event, index) => (
          <div key={index} className="relative pl-11">
            {/* Timeline dot */}
            <div className="absolute -left-2.5 top-1 z-20 flex items-center justify-center">
              {/* Outer glow ring */}
              <div
                className={`absolute h-8 w-8 rounded-full ring-4 ${theme.ring} opacity-60`}
              />
              {/* Inner dot */}
              <div
                className={`relative h-3.5 w-3.5 rounded-full border-3 border-white shadow-md ${theme.bg}`}
              />
            </div>

            {/* Time label — horizontal glassy badge */}
            <div className="absolute -left-14 top-1 w-12 text-right">
              <span className="inline-block px-1.5 py-0.5 rounded-md bg-stone-100/80 text-[10px] font-bold text-stone-500 tabular-nums shadow-xs">
                {event.time}
              </span>
            </div>

            {/* Card */}
            <div
              className="animate-in fade-in slide-in-from-bottom-3 duration-500"
              style={{ animationDelay: `${Math.min(index * 80, 600)}ms` }}
            >
              <EventCard event={event} />
            </div>
          </div>
        ))}
      </div>

      {/* End marker */}
      <div
        className={`absolute bottom-8 left-6.25 h-6 w-6 rounded-full border-4 border-white shadow-sm ${theme.bg} opacity-30`}
      />
    </div>
  );
}
