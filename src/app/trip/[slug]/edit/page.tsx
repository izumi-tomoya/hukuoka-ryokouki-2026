import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { MagazineCard } from "@/components/ui/MagazineCard";
import { getTripBySlug } from "@/features/trip/api/tripActions";
import NewTripForm from "@/features/trip/components/client/NewTripForm";

export default async function EditTripPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);
  if (!trip) return notFound();

  return (
    <div className="bg-background min-h-screen pt-16 pb-20 md:pt-24">
      <Container className="max-w-2xl">
        <header className="mb-12 text-center md:mb-16">
          <h1 className="font-playfair text-foreground mb-4 text-4xl leading-tight font-black tracking-tight md:text-6xl">
            Edit Journey
          </h1>
          <p className="text-muted-foreground text-[10px] leading-relaxed font-bold tracking-[0.2em] uppercase md:text-xs">
            旅の詳細を更新しましょう
          </p>
        </header>

        <MagazineCard padding="lg" className="border-border/50 shadow-primary/5 shadow-2xl">
          <NewTripForm
            initialData={{
              id: trip.id,
              title: trip.title,
              description: trip.description,
              location: trip.location,
              startDate: new Date(trip.startDate).toISOString(),
              endDate: new Date(trip.endDate).toISOString(),
              accentColor: trip.accentColor,
            }}
          />
        </MagazineCard>
      </Container>
    </div>
  );
}
