import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getTripBySlug } from "@/features/trip/api/tripActions";
import TipsSection from "@/features/trip/components/TipsSection";
import TripLayout from "@/features/trip/components/TripLayout";
import { Container } from "@/components/ui/Container";

export default async function TipsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const session = await auth();
  if (!session?.user?.isAdmin) redirect(`/trip/${slug}`);

  const trip = await getTripBySlug(slug);
  if (!trip) return notFound();

  const tips = trip.tips.map((t) => ({ 
    title: t.title, 
    body: t.body, 
    isWarning: t.isWarning,
    category: t.category ?? undefined,
    deepLevel: t.deepLevel
  }));

  return (
    <TripLayout
      slug={slug}
      activePath={`/trip/${slug}/tips`}
      isSecretMode={true}
      title="Secret Tips"
      subtitle="管理者専用プレミアムガイド"
      days={trip.days}
    >
      <Container className="pb-24">
        <TipsSection tips={tips} />
      </Container>
    </TripLayout>
  );
}
