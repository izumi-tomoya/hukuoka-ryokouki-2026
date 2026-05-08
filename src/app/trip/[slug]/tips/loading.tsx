import { Container } from "@/components/ui/Container";
import TipsSectionSkeleton from "@/features/trip/components/TipsSectionSkeleton";
import TripLayout from "@/features/trip/components/TripLayout";

export default function TipsLoading() {
  return (
    <TripLayout isLoading={true}>
      <Container className="pb-24">
        <div className="mb-12">
          <TipsSectionSkeleton />
        </div>
      </Container>
    </TripLayout>
  );
}
