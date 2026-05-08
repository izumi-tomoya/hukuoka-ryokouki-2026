import { notFound } from "next/navigation";
import { getTripBySlug } from "@/features/trip/api/tripActions";
import TripLayout from "@/features/trip/components/TripLayout";
import { auth } from "@/lib/auth";
import { calculateBudgetStats, mapEventToTripEvent } from "@/features/trip/utils/tripUtils";
import MemoriesContent from "@/features/trip/components/client/MemoriesContent";
import type { MemoryReelPhoto } from "@/features/trip/components/client/MemoryReel";
import type { Prisma } from "@prisma/client";
import { Container } from "@/components/ui/Container";

type EventWithStops = Prisma.EventGetPayload<{
  include: {
    yataiStops: true;
    transitSteps: true;
    photos: true;
  };
}>;

export default async function MemoriesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);
  if (!trip) return notFound();

  const session = await auth();
  const isAdmin = !!session?.user?.isAdmin;

  const awards = trip.gourmetAwards ?? [];

  const allTripEvents = trip.days?.flatMap((day) =>
    day.events.map((event) => mapEventToTripEvent(event as unknown as EventWithStops))
  ) ?? [];
  const insightEvents = trip.days.flatMap((day) =>
    day.events.map((event) => ({
      id: event.id,
      dayNumber: day.dayNumber,
      date: new Date(day.date).toISOString(),
      time: event.time,
      type: event.type,
      title: event.title || event.foodName || "Untitled",
      desc: event.desc || event.foodDesc || undefined,
      locationUrl: event.locationUrl || undefined,
      isConfirmed: event.isConfirmed,
      plannedBudget: event.plannedBudget || 0,
      actualExpense: event.actualExpense || 0,
    }))
  );

  const albumPhotos: MemoryReelPhoto[] = trip.days.flatMap((day) =>
    day.events.flatMap((event) => {
      const title = event.title || event.foodName || day.title || trip.location;
      const description = event.desc || event.foodDesc || event.highlight || event.notes || undefined;
      const location = event.title || event.foodName || day.title || trip.location;
      const dayLabel = `Day ${day.dayNumber}`;
      const dateLabel = new Date(day.date).toLocaleDateString("ja-JP", {
        month: "long",
        day: "numeric",
        weekday: "short",
      });

      return (event.photos || []).map((photo) => ({
        url: photo.url,
        title,
        time: event.time,
        dateLabel,
        location,
        description,
        dayLabel,
      }));
    })
  );

  const budgetStats = calculateBudgetStats(allTripEvents);
  const eventsWithPhotos = allTripEvents.filter((event) => (event.photos?.length ?? 0) > 0);

  return (
    <TripLayout
      slug={slug}
      tripId={trip.id}
      activePath={`/trip/${slug}/memories`}
      isSecretMode={isAdmin}
      title="Travel Memories"
      subtitle="旅の瞬間を、永遠の記録に。"
      days={trip.days ?? []}
      events={allTripEvents}
    >
      <Container className="pb-24">
        <MemoriesContent
          tripId={trip.id}
          tripSlug={slug}
          awards={awards}
          budgetStats={budgetStats}
          eventsWithPhotos={eventsWithPhotos}
          allEvents={allTripEvents}
          insightEvents={insightEvents}
          albumPhotos={albumPhotos}
          isAdmin={isAdmin}
        />
      </Container>
    </TripLayout>
  );
}
