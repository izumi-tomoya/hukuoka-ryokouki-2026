import { Container } from "@/components/ui/Container";
import { MagazineCard } from "@/components/ui/MagazineCard";
import TripLayout from "@/features/trip/components/TripLayout";

export default function AssistLoading() {
  return (
    <TripLayout isLoading={true}>
      <Container className="pb-24 space-y-6">
        <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <MagazineCard className="h-80 opacity-20" />
          <MagazineCard className="h-80 opacity-10" />
        </section>

        <section>
          <MagazineCard className="h-64 opacity-20" />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <MagazineCard className="h-96 opacity-10" />
          <MagazineCard className="h-96 opacity-10" />
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <MagazineCard className="h-64 opacity-5" />
          <MagazineCard className="h-64 opacity-5" />
          <MagazineCard className="h-64 opacity-5" />
        </section>
      </Container>
    </TripLayout>
  );
}
