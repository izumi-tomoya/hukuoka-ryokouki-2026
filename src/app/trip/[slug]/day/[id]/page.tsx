import { notFound } from "next/navigation";
import DayView from "@/components/trip/DayView";
import { getTripBySlug } from "@/app/actions/tripActions";
import { mapEventToTripEvent } from "@/lib/tripUtils";

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
    <DayView
      events={events}
      dayNumber={themeDay}
      dayLabel={`DAY ${dayNumber} — ${new Date(day.date).toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" })}`}
      dayTitle={day.title ?? undefined}
      dayHighlight={day.highlight ?? undefined}
      tips={trip.tips.map((t) => ({ title: t.title, body: t.body, isWarning: t.isWarning }))}
      slug={slug}
    />
  );
}
