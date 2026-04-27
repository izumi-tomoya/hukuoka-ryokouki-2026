import { notFound } from "next/navigation";
import DayView from "@/features/trip/components/DayView";
import { getTripBySlug } from "@/features/trip/api/tripActions";
import { mapEventToTripEvent } from "@/features/trip/utils/tripUtils";
import { formatDateWithWeekday } from "@/features/trip/utils/dateUtils";

export default async function DayPage({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params;
  const dayNumber = parseInt(id, 10);
  if (isNaN(dayNumber)) return notFound();

  const trip = await getTripBySlug(slug);
  if (!trip) return notFound();

  const day = trip.days.find((d) => d.dayNumber === dayNumber);
  if (!day) return notFound();

  const events = day.events.map(mapEventToTripEvent);

  const dateLabel = formatDateWithWeekday(day.date);

  return (
    <DayView
      events={events}
      dayNumber={dayNumber}
      dayLabel={dateLabel}
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
      days={trip.days}
    />
  );
}
