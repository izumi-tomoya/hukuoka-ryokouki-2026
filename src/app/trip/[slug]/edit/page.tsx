import { notFound } from "next/navigation";
import { getTripBySlug } from "@/features/trip/api/tripActions";
import NewTripForm from "@/features/trip/components/client/NewTripForm";
import { Container } from "@/components/ui/Container";
import { MagazineCard } from "@/components/ui/MagazineCard";

export default async function EditTripPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);
  if (!trip) return notFound();

  return (
    <div className="min-h-screen bg-background pt-16 md:pt-24 pb-20">
      <Container className="max-w-2xl">
        <header className="mb-12 md:mb-16 text-center">
          <h1 className="font-playfair text-4xl md:text-6xl font-black text-foreground mb-4 tracking-tight leading-tight">
            Edit Journey
          </h1>
          <p className="text-muted-foreground text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase leading-relaxed">
            旅の詳細を更新しましょう
          </p>
        </header>

        <MagazineCard padding="lg" className="border-border/50 shadow-2xl shadow-primary/5">
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
