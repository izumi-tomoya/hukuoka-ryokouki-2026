import { notFound, redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { getTripBySlug } from "@/features/trip/api/tripActions";
import BudgetManager from "@/features/trip/components/client/BudgetManager";
import TripLayout from "@/features/trip/components/TripLayout";
import type { Tip, TripEvent } from "@/features/trip/types/trip";
import { mapEventToTripEvent } from "@/features/trip/utils/tripUtils";
import { auth } from "@/lib/auth";

export default async function BudgetPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);
  if (!trip) return notFound();

  const session = await auth();
  if (!session?.user?.isAdmin) redirect(`/trip/${slug}`);

  const allEvents = trip.days.flatMap((day) =>
    day.events.map((e) => ({
      ...mapEventToTripEvent(e as never),
      dayNumber: day.dayNumber,
      dayTitle: day.title,
    })),
  );

  return (
    <TripLayout
      slug={slug}
      tripId={trip.id}
      activePath={`/trip/${slug}/budget`}
      isSecretMode={true}
      title={trip.title}
      subtitle={`${trip.location} / Budget`}
      days={trip.days}
      events={allEvents as TripEvent[]}
      tips={trip.tips as Tip[]}
    >
      <Container className="pb-24">
        <BudgetManager events={allEvents} />
      </Container>
    </TripLayout>
  );
}
