import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getTripBySlug } from "@/features/trip/api/tripActions";
import BudgetDashboard from "@/features/trip/components/BudgetDashboard";
import PackingList from "@/features/trip/components/client/PackingList";
import SmartPackingSuggestions from "@/features/trip/components/client/SmartPackingSuggestions";
import TipsList from "@/features/trip/components/client/TipsList";
import TransitTimeline from "@/features/trip/components/TransitTimeline";
import TripLayout from "@/features/trip/components/TripLayout";
import TripWeatherSummary from "@/features/trip/components/TripWeatherSummary";
import { calculateBudgetStats, mapEventToTripEvent } from "@/features/trip/utils/tripUtils";
import { auth } from "@/lib/auth";
import { getWeatherData } from "@/lib/weather";

export default async function TripInfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);
  if (!trip) return notFound();

  const session = await auth();
  const isAdmin = !!session?.user?.isAdmin;

  // getTripBySlug で include された最新のパッキングアイテムを使用します
  const packingItems = trip.packingItems ?? [];
  const weather = await getWeatherData(trip.location).catch(() => null);

  // Prisma のイベントデータを TripEvent 型に変換
  const allEvents = trip.days.flatMap((day) => day.events.map((e) => mapEventToTripEvent(e as any)));
  const budgetStats = calculateBudgetStats(allEvents);

  const dayStats = trip.days.map((day) => {
    const events = day.events.map((e) => mapEventToTripEvent(e as never));
    return {
      dayNumber: day.dayNumber,
      title: day.title,
      planned: events.reduce((s, e) => s + (e.plannedBudget || 0), 0),
      actual: events.reduce((s, e) => s + (e.actualExpense || 0), 0),
    };
  });
  const transitEvents = allEvents.filter(
    (e) => e.type === "transport" || (e.transitSteps && e.transitSteps.length > 0),
  );

  const insightEvents = allEvents.map((event, index) => ({
    id: event.id || `insight-${index}`,
    dayNumber: 0, // 簡易的なインサイト用
    date: new Date().toISOString(),
    time: event.time,
    type: event.type,
    title: event.title || event.foodName || "Untitled",
    desc: event.desc || event.foodDesc || undefined,
    locationUrl: event.locationUrl || undefined,
    isConfirmed: event.isConfirmed,
    plannedBudget: event.plannedBudget || 0,
    actualExpense: event.actualExpense || 0,
  }));

  return (
    <TripLayout
      slug={slug}
      activePath={`/trip/${slug}/info`}
      isSecretMode={isAdmin}
      title="Trip Essentials"
      subtitle="旅の準備と必要な情報"
      days={trip.days}
    >
      <Container className="space-y-24 pb-24">
        {/* --- Weather Summary Section --- */}
        <section>
          <SectionHeader title="Local Forecast" subtitle="現地の天候とアドバイス" />
          <div className="mt-8">
            <TripWeatherSummary location={trip.location} endDate={trip.endDate} />
          </div>
        </section>

        {/* --- Budget Section --- */}
        <section>
          <SectionHeader title="Budget Overview" subtitle="旅の支出と予算の状況" />
          <div className="mt-8">
            <BudgetDashboard stats={budgetStats} dayStats={dayStats} />
          </div>
        </section>

        {/* --- Transit Timeline Section --- */}
        {transitEvents.length > 0 && (
          <section>
            <SectionHeader title="Transportation" subtitle="主な移動経路の確認" />
            <div className="mt-8">
              <TransitTimeline steps={transitEvents.flatMap((e) => e.transitSteps ?? [])} isAdmin={isAdmin} />
            </div>
          </section>
        )}

        {/* --- Packing Section --- */}
        <section>
          <SectionHeader title="Checklist" subtitle="準備を完璧に整えよう" />
          <div className="mt-8">
            <SmartPackingSuggestions
              tripId={trip.id}
              itemNames={packingItems.map((item) => item.name)}
              events={insightEvents}
              weatherData={weather}
            />
          </div>
          <div className="mt-8">
            <PackingList initialItems={packingItems} tripId={trip.id} />
          </div>
        </section>

        {/* --- Booking & Knowledge Section --- */}
        <section>
          <SectionHeader title="Knowledge & Booking" subtitle="予約情報と現地の知恵" />
          <div className="mt-8">
            <TipsList
              initialTips={trip.tips.map((t) => ({
                id: t.id,
                title: t.title,
                body: t.body,
                venue: t.venue ?? "",
                imageUrl: t.imageUrl ?? "",
                isWarning: t.isWarning,
                isConfirmed: t.isConfirmed,
                category: t.category ?? "General",
                deepLevel: t.deepLevel,
                order: t.order,
              }))}
              tripId={trip.id}
            />
          </div>
        </section>
      </Container>
    </TripLayout>
  );
}
