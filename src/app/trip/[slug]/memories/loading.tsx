import { Container } from "@/components/ui/Container";
import { MagazineCard } from "@/components/ui/MagazineCard";
import { Skeleton } from "@/components/ui/Skeleton";
import TripLayout from "@/features/trip/components/TripLayout";

export default function MemoriesLoading() {
  return (
    <TripLayout isLoading={true}>
      <Container className="space-y-12 pb-24">
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-48 rounded-full" />
            <div className="bg-border h-px grow opacity-30" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <MagazineCard className="h-48 opacity-20" />
            <MagazineCard className="h-48 opacity-20" />
            <MagazineCard className="h-48 opacity-20" />
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-48 rounded-full" />
            <div className="bg-border h-px grow opacity-30" />
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-muted/20 aspect-square animate-pulse rounded-3xl" />
            ))}
          </div>
        </section>
      </Container>
    </TripLayout>
  );
}
