import { notFound } from "next/navigation";
import { getTripBySlug } from "@/features/trip/api/tripActions";
import TripLayout from "@/features/trip/components/TripLayout";
import { auth } from "@/lib/auth";
import { calculateBudgetStats, mapEventToTripEvent } from "@/features/trip/utils/tripUtils";
import MemoriesContent from "@/features/trip/components/client/MemoriesContent";
import type { Prisma } from "@prisma/client";

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

  // getTripBySlug で include された最新のアワード情報を使用します
  const awards = trip.gourmetAwards ?? [];

  // 1. 全てのイベントを型安全な形式（TripEvent）にマッピング
  const allTripEvents = trip.days?.flatMap(day => 
    day.events.map(event => mapEventToTripEvent(event as unknown as EventWithStops))
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

  // 2. 予算統計の計算
  const budgetStats = calculateBudgetStats(allTripEvents);

  // 3. 写真があるイベントを抽出（ここも TripEvent 形式に統一）
  const eventsWithPhotos = allTripEvents.filter(event => (event.photos?.length ?? 0) > 0);

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
      <MemoriesContent 
        tripId={trip.id}
        awards={awards}
        budgetStats={budgetStats}
        eventsWithPhotos={eventsWithPhotos}
        allEvents={allTripEvents}
        insightEvents={insightEvents}
        isAdmin={isAdmin}
      />
    </TripLayout>
  );
}
