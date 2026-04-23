import PackingList from '@/components/trip/PackingList';
import { BentoTile } from '@/components/ui/BentoTile';

export default function TripInfoPage({ params }: { params: { slug: string } }) {
  return (
    <main className="min-h-screen bg-[#FDFDFC] text-[#2D2D2D] p-6 md:p-12">
      <header className="mb-12 max-w-2xl">
        <h1 className="text-3xl font-light tracking-tight mb-3">Trip Essentials</h1>
        <p className="text-zinc-500 text-base">二人の旅を完璧に楽しむための準備リスト</p>
      </header>

      <BentoTile>
        <PackingList />
      </BentoTile>
    </main>
  );
}
