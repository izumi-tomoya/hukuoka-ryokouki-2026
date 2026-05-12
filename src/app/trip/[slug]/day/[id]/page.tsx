import { notFound } from "next/navigation";
import { getTripBySlug } from "@/features/trip/api/tripActions";
import DayView from "@/features/trip/components/DayView";
import { formatDateWithWeekday } from "@/features/trip/utils/dateUtils";
import { mapEventToTripEvent } from "@/features/trip/utils/tripUtils";
import { auth } from "@/lib/auth";

export default async function DayPage({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params;
  const dayNumber = parseInt(id, 10);
  if (Number.isNaN(dayNumber)) return notFound();

  const trip = await getTripBySlug(slug);
  if (!trip) return notFound();

  const day = trip.days?.find((d) => d.dayNumber === dayNumber);
  if (!day) return notFound();

  const events = day.events?.map(mapEventToTripEvent) ?? [];
  const session = await auth();
  const isAdmin = !!session?.user?.isAdmin;

  const dateLabel = formatDateWithWeekday(day.date);

  return (
    <DayView
      dayId={day.id}
      events={events}
      dayNumber={dayNumber}
      dayLabel={dateLabel}
      dayTitle={day.title ?? undefined}
      dayHighlight={day.highlight ?? undefined}
      dayNotes={day.notes ?? undefined}
      isCompleted={day.isCompleted}
      date={new Date(day.date).toISOString()}
      location={trip.location}
      tips={
        trip.tips?.map((t) => ({
          title: t.title,
          body: t.body,
          isWarning: t.isWarning,
          category: t.category ?? undefined,
          deepLevel: t.deepLevel,
        })) ?? []
      }
      slug={slug}
      days={trip.days ?? []}
      isAdmin={isAdmin}
    />
  );
}
