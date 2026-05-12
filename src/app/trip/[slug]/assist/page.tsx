import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getWeatherData } from "@/lib/weather";
import { getTripBySlug } from "@/features/trip/api/tripActions";
import TripLayout from "@/features/trip/components/TripLayout";
import AssistDashboard from "@/features/trip/components/client/AssistDashboard";
import { ensureDate } from "@/features/trip/utils/dateUtils";
import { Container } from "@/components/ui/Container";

export default async function TripAssistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);
  if (!trip) return notFound();

  const session = await auth();
  const isAdmin = !!session?.user?.isAdmin;
  const weather = await getWeatherData(trip.location).catch(() => null);

  const events = trip.days.flatMap((day) =>
    day.events.map((event) => {
      const e = event as {
        id: string;
        time: string;
        type: string;
        title?: string | null;
        formalName?: string | null;
        desc?: string | null;
        foodName?: string | null;
        foodDesc?: string | null;
        tag?: string | null;
        locationUrl?: string | null;
        isConfirmed: boolean;
        plannedBudget?: number | null;
        actualExpense?: number | null;
        transitSteps: Array<{
          time: string;
          station: string;
          mode: string;
          lineName?: string | null;
          duration?: string | null;
          fare?: string | null;
          platform?: string | null;
          exit?: string | null;
        }>;
      };

      return {
        id: e.id,
        dayNumber: day.dayNumber,
        date: ensureDate(day.date).toISOString(),
        time: e.time,
        type: e.type,
        title: e.title || e.foodName || "Untitled",
        formalName: e.formalName || undefined,
        desc: e.desc || e.foodDesc || undefined,
        tag: e.tag || undefined,
        locationUrl: e.locationUrl || undefined,
        isConfirmed: e.isConfirmed,
        plannedBudget: e.plannedBudget || 0,
        actualExpense: e.actualExpense || 0,
        transitSteps: e.transitSteps.map((step) => ({
          time: step.time,
          station: step.station,
          mode: step.mode,
          lineName: step.lineName || undefined,
          duration: step.duration || undefined,
          fare: step.fare || undefined,
          platform: step.platform || undefined,
          exit: step.exit || undefined,
        })),
      };
    })
  );

  return (
    <TripLayout
      slug={slug}
      activePath={`/trip/${slug}/assist`}
      isSecretMode={isAdmin}
      title="Travel Assist"
      subtitle="当日の判断と重要情報"
      days={trip.days}
    >
      <Container className="pb-24">
        <AssistDashboard
          trip={{
            id: trip.id,
            slug: trip.slug,
            title: trip.title,
            location: trip.location,
            startDate: ensureDate(trip.startDate).toISOString(),
            endDate: ensureDate(trip.endDate).toISOString(),
          }}
          events={events}
          tips={trip.tips.map((tip) => ({
            id: tip.id,
            title: tip.title,
            body: tip.body,
            venue: tip.venue || undefined,
            imageUrl: tip.imageUrl || undefined,
            isWarning: tip.isWarning,
            isConfirmed: tip.isConfirmed,
            category: tip.category || undefined,
          }))}
          isAdmin={isAdmin}
          weatherLabel={weather ? `${trip.location}: ${weather.current.condition} ${weather.current.temp}°C / ${weather.themeStatus}` : null}
          weatherData={weather}
        />
      </Container>
    </TripLayout>
  );
}
