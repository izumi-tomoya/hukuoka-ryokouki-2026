import { notFound, redirect } from "next/navigation";
import { getTripBySlug } from "@/features/trip/api/tripActions";
import TripLayout from "@/features/trip/components/TripLayout";
import { Container } from "@/components/ui/Container";
import { auth } from "@/lib/auth";
import PackingList from "@/features/trip/components/client/PackingList";
import TipsList from "@/features/trip/components/client/TipsList";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { PackingItem } from "@prisma/client";

export default async function TripInfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);
  if (!trip) return notFound();

  const session = await auth();
  const isAdmin = !!session?.user?.isAdmin;

  // getTripBySlug で include された最新のパッキングアイテムを使用します
  const packingItems = trip.packingItems ?? [];

  return (
    <TripLayout
      slug={slug}
      activePath={`/trip/${slug}/info`}
      isSecretMode={isAdmin}
      title="Trip Essentials"
      subtitle="旅の準備と必要な情報"
      days={trip.days}
    >
      <Container className="pb-24 space-y-20">
        {/* --- Packing Section --- */}
        <section>
          <SectionHeader title="Checklist" subtitle="準備を完璧に整えよう" />
          <PackingList initialItems={packingItems} tripId={trip.id} />
        </section>

        {/* --- Booking & Knowledge Section --- */}
        <section>
          <SectionHeader title="Knowledge & Booking" subtitle="予約情報と現地の知恵" />
          <div className="mt-8">
            <TipsList 
              initialTips={trip.tips.map(t => ({
                id: t.id,
                title: t.title,
                body: t.body,
                venue: t.venue ?? "",
                imageUrl: t.imageUrl ?? "",
                isWarning: t.isWarning,
                isConfirmed: t.isConfirmed,
                category: t.category ?? "General",
                deepLevel: t.deepLevel,
                order: t.order
              }))} 
              tripId={trip.id} 
            />
          </div>
        </section>
      </Container>
    </TripLayout>
  );
}
