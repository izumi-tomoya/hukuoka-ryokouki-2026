import type { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { getTripBySlug } from "@/features/trip/api/tripActions";
import MemoriesContent from "@/features/trip/components/client/MemoriesContent";
import type { MemoryReelPhoto } from "@/features/trip/components/client/MemoryReel";
import TripLayout from "@/features/trip/components/TripLayout";
import { calculateBudgetStats, mapEventToTripEvent, maskSecretText } from "@/features/trip/utils/tripUtils";
import { auth } from "@/lib/auth";

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

  const allTripEvents =
    trip.days?.flatMap((day) => day.events.map((event) => mapEventToTripEvent(event as unknown as EventWithStops))) ??
    [];
  const insightEvents = trip.days.flatMap((day) =>
    day.events.map((event) => {
      const isSurprise = !isAdmin && event.tag === "surprise";
      return {
        id: event.id,
        dayNumber: day.dayNumber,
        date: new Date(day.date).toISOString(),
        time: event.time,
        type: event.type,
        title: isSurprise ? "🎁 Surprise Spot" : maskSecretText(event.title || event.foodName || "Untitled", isAdmin),
        desc: isSurprise
          ? "当日まで秘密。ふたりの特別な時間が待っています。"
          : maskSecretText(event.desc || event.foodDesc || "", isAdmin) || undefined,
        locationUrl: isSurprise ? undefined : event.locationUrl || undefined,
        isConfirmed: event.isConfirmed,
        plannedBudget: event.plannedBudget || 0,
        actualExpense: event.actualExpense || 0,
      };
    }),
  );

  const albumPhotos: MemoryReelPhoto[] = trip.days.flatMap((day) =>
    day.events.flatMap((event) => {
      const isSurprise = !isAdmin && event.tag === "surprise";

      const title = isSurprise
        ? "🎁 Surprise Moment"
        : maskSecretText(event.title || event.foodName || day.title || trip.location, isAdmin);
      const description = isSurprise
        ? "当日まで秘密。ふたりの特別な時間が待っています。"
        : maskSecretText(event.desc || event.foodDesc || event.highlight || event.notes || "", isAdmin) || undefined;
      const location = isSurprise
        ? "Secret Spot"
        : maskSecretText(event.title || event.foodName || day.title || trip.location, isAdmin);
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
    }),
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
