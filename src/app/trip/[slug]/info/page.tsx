import { Luggage } from 'lucide-react';
import TripLayout from '@/features/trip/components/TripLayout';
import { Container } from '@/components/ui/Container';
import { auth } from '@/lib/auth';
import { getTripBySlug } from '@/features/trip/api/tripActions';
import { notFound } from 'next/navigation';
import TripWeatherSummary from '@/features/trip/components/TripWeatherSummary';
import { SectionHeader } from '@/components/ui/SectionHeader';
import PackingSection from '@/features/trip/components/client/PackingSection';
import EssentialTips from '@/features/trip/components/EssentialTips';
import TransitDashboard from '@/features/trip/components/client/TransitDashboard';
import AdventureCard from '@/features/trip/components/client/AdventureCard';

export default async function TripInfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth();
  const isAdmin = !!session?.user?.isAdmin;

  const trip = await getTripBySlug(slug);
  if (!trip) return notFound();

  return (
    <TripLayout 
      slug={slug} 
      activePath={`/trip/${slug}/info`} 
      isSecretMode={isAdmin} 
      title="Trip Essentials"
      subtitle="忘れ物はない？二人の旅を完璧に楽しむためのリスト"
      days={trip.days}
    >
      <Container className="pb-24">
        <SectionHeader 
          title="Weather Forecast" 
          subtitle="福岡の天気予報を確認して服装を準備しよう"
        />
        <div className="mb-16">
          <TripWeatherSummary location={trip.location} />
        </div>

        <SectionHeader 
          title="Domestic Travel Tips" 
          subtitle="国内旅行・福岡滞在をよりスムーズにするためのヒント"
        />
        <div className="mb-16">
          <EssentialTips />
        </div>

        <SectionHeader 
          title="Path Finder" 
          subtitle="街を繋ぐ、ふたりの足跡。移動をよりスマートに。"
        />
        <div className="mb-16">
          <TransitDashboard isSecretMode={isAdmin} />
        </div>

        <div className="mb-24">
          <AdventureCard />
        </div>

        <SectionHeader 
          title="Packing List" 
          subtitle="快適な旅のためのチェックリスト（自動保存されます）"
        />
        
        <PackingSection />

        <div className="mt-16 bg-stone-900 rounded-[32px] p-8 md:p-12 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Ready to Go?</h3>
          <p className="text-stone-400 max-w-md mx-auto mb-8">
            準備が整ったら、あとは思い切り楽しむだけ！<br />
            二人の福岡旅行が最高の思い出になりますように。
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-rose-500 rounded-full font-bold text-sm">
            <Luggage size={18} />
            いってらっしゃい！
          </div>
        </div>
      </Container>
    </TripLayout>
  );
}
