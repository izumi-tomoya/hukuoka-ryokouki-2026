import PackingList from '@/components/trip/PackingList';

export default function TripInfoPage({ params }: { params: { slug: string } }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 md:py-20">
      <div className="mb-10 text-center">
        <h1 className="font-playfair text-3xl font-bold text-rose-900 mb-4">Trip Essentials</h1>
        <p className="text-sm text-rose-600/70 font-medium tracking-wide uppercase">忘れ物はない？二人の旅を完璧に楽しむためのリスト</p>
      </div>

      <PackingList />
    </div>
  );
}
