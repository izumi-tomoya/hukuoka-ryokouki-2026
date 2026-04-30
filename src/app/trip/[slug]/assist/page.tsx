import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getWeatherData } from "@/lib/weather";
import { getTripBySlug } from "@/features/trip/api/tripActions";
import TripLayout from "@/features/trip/components/TripLayout";
import AssistDashboard from "@/features/trip/components/client/AssistDashboard";

export default async function TripAssistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);
  if (!trip) return notFound();

  const session = await auth();
  const isAdmin = !!session?.user?.isAdmin;
  const weather = await getWeatherData(trip.location).catch(() => null);

  const events = trip.days.flatMap((day) =>
    day.events.map((event) => ({
      id: event.id,
      dayNumber: day.dayNumber,
      date: day.date.toISOString(),
      time: event.time,
      type: event.type,
      title: event.title || event.foodName || "Untitled",
      desc: event.desc || event.foodDesc || undefined,
      locationUrl: event.locationUrl || undefined,
      isConfirmed: event.isConfirmed,
      plannedBudget: event.plannedBudget || 0,
      actualExpense: event.actualExpense || 0,
      transitSteps: event.transitSteps.map((step) => ({
        time: step.time,
        station: step.station,
        mode: step.mode,
        lineName: step.lineName || undefined,
        duration: step.duration || undefined,
        fare: step.fare || undefined,
        platform: step.platform || undefined,
        exit: step.exit || undefined,
      })),
    }))
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
      <AssistDashboard
        trip={{
          id: trip.id,
          slug: trip.slug,
          title: trip.title,
          location: trip.location,
          startDate: trip.startDate.toISOString(),
          endDate: trip.endDate.toISOString(),
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
        weatherLabel={weather ? `${trip.location}: ${weather.condition} ${weather.temp}°C / ${weather.themeStatus}` : null}
      />
    </TripLayout>
  );
}
