import PackingList from '@/components/trip/PackingList';
import { BentoTile } from '@/components/ui/BentoTile';
import { getTripBySlug } from '@/features/trip/api/tripActions';
import { ESSENTIALS_BY_REGION } from '@/config/constants';
import { notFound } from 'next/navigation';

export default async function TripInfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);

  if (!trip) return notFound();

  // location が "Fukuoka, Japan" なら "Fukuoka" をキーにするなど調整
  const regionKey = trip.location.includes("Fukuoka") ? "Fukuoka" : trip.location.split(',')[0];
  const regionEssentials = ESSENTIALS_BY_REGION[regionKey as keyof typeof ESSENTIALS_BY_REGION];

  return (
    <main className="min-h-screen bg-[#FDFDFC] text-[#2D2D2D] p-6 md:p-12">
      <header className="mb-12 max-w-2xl">
        <h1 className="text-3xl font-light tracking-tight mb-3">Trip Essentials</h1>
        <p className="text-zinc-500 text-base">二人の旅を完璧に楽しむための準備リスト</p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        <BentoTile>
          <PackingList />
        </BentoTile>

        {regionEssentials && (
          <BentoTile className="bg-white border-zinc-200">
            <h3 className="text-zinc-900 font-bold mb-4">{regionEssentials.title}</h3>
            <ul className="space-y-3">
              {regionEssentials.items.map((item, i) => (
                <li key={i} className="text-sm text-zinc-600 flex items-start gap-2">
                  <span className="text-rose-400 mt-1">●</span>
                  {item}
                </li>
              ))}
            </ul>
          </BentoTile>
        )}
      </div>
    </main>
  );
}
