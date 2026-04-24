import { notFound } from "next/navigation";
import DayView from "@/components/trip/DayView";
import { getTripBySlug } from "@/features/trip/api/tripActions";
import { mapEventToTripEvent } from "@/lib/tripUtils";
import { BentoTile } from "@/components/ui/BentoTile";

export default async function DayPage({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params;
  const dayNumber = parseInt(id, 10);
  if (isNaN(dayNumber)) return notFound();

  const trip = await getTripBySlug(slug);
  if (!trip) return notFound();

  const day = trip.days.find((d) => d.dayNumber === dayNumber);
  if (!day) return notFound();

  const events = day.events.map(mapEventToTripEvent);
  const themeDay = (dayNumber === 1 || dayNumber === 2) ? dayNumber as 1 | 2 : 1;

  return (
    <main className="min-h-screen bg-[#FDFDFC] text-[#2D2D2D] p-4 md:p-12">
      <header className="mb-8">
        <BentoTile>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-2 block">
            DAY {dayNumber}
          </span>
          <h1 className="text-2xl font-light tracking-tight">
            {new Date(day.date).toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" })}
          </h1>
          {day.title && <p className="text-zinc-500 mt-1 text-sm">{day.title}</p>}
          {day.highlight && <p className="text-xs font-medium text-zinc-900 mt-3">{day.highlight}</p>}
        </BentoTile>
      </header>

      <DayView
        events={events}
        dayNumber={themeDay}
        dayLabel={`DAY ${dayNumber}`}
        dayTitle={day.title ?? undefined}
        dayHighlight={day.highlight ?? undefined}
        tips={trip.tips.map((t) => ({ 
          title: t.title, 
          body: t.body, 
          isWarning: t.isWarning,
          category: t.category ?? undefined,
          deepLevel: t.deepLevel
        }))}
        slug={slug}
      />
    </main>
  );
}
