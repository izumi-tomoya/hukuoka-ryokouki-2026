import { Container } from "@/components/ui/Container";
import { MagazineCard } from "@/components/ui/MagazineCard";
import { Skeleton } from "@/components/ui/Skeleton";
import TripLayout from "@/features/trip/components/TripLayout";

export default function MemoriesLoading() {
  return (
    <TripLayout isLoading={true}>
      <Container className="pb-24 space-y-12">
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-48 rounded-full" />
            <div className="h-px grow bg-border opacity-30" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MagazineCard className="h-48 opacity-20" />
            <MagazineCard className="h-48 opacity-20" />
            <MagazineCard className="h-48 opacity-20" />
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-48 rounded-full" />
            <div className="h-px grow bg-border opacity-30" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-square rounded-3xl bg-muted/20 animate-pulse" />
            ))}
          </div>
        </section>
      </Container>
    </TripLayout>
  );
}
