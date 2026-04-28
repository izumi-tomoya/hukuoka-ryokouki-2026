import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getTripBySlug } from "@/features/trip/api/tripActions";
import TripLayout from "@/features/trip/components/TripLayout";
import { Container } from "@/components/ui/Container";
import TipsList from "@/features/trip/components/client/TipsList";

export default async function TipsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const session = await auth();
  if (!session?.user?.isAdmin) redirect(`/trip/${slug}`);

  const trip = await getTripBySlug(slug);
  if (!trip) return notFound();

  // Tipsデータを整形して渡す
  const tips = trip.tips.map((t) => ({ 
    id: t.id,
    title: t.title, 
    body: t.body, 
    isWarning: t.isWarning,
    category: t.category ?? "General",
    deepLevel: t.deepLevel,
    order: t.order
  }));

  return (
    <TripLayout
      slug={slug}
      activePath={`/trip/${slug}/tips`}
      isSecretMode={true}
      title="Secret Guide"
      subtitle="管理者専用プレミアム・ナレッジベース"
      days={trip.days}
    >
      <Container className="pb-24">
        <div className="mb-12">
          <p className="text-muted-foreground leading-relaxed max-w-2xl">
            旅のクオリティを一段階引き上げるための攻略情報です。
            グルメの穴場、移動のコツ、そして絶対に外せない注意点をまとめて管理できます。
          </p>
        </div>

        <TipsList initialTips={tips} tripId={trip.id} />
      </Container>
    </TripLayout>
  );
}
