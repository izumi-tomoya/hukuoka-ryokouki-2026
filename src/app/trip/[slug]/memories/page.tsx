import { notFound } from "next/navigation";
import { getTripBySlug } from "@/features/trip/api/tripActions";
import TripLayout from "@/features/trip/components/TripLayout";
import { auth } from "@/lib/auth";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MagazineCard } from "@/components/ui/MagazineCard";
import PhotoUploadButton from "@/features/trip/components/client/PhotoUploadButton";
import PhotoGallery from "@/features/trip/components/PhotoGallery";
import { Camera, Sparkles } from "lucide-react";

export default async function MemoriesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);
  if (!trip) return notFound();

  const session = await auth();
  const isAdmin = !!session?.user?.isAdmin;

  // 全てのイベントから写真が投稿されているイベントを抽出
  const eventsWithPhotos = trip.days.flatMap(day => 
    day.events.filter(event => (event.photos?.length ?? 0) > 0 || (event.actualPhotos?.length ?? 0) > 0)
  );

  // 全てのイベント（写真がないものも含む）をリストアップして投稿可能にする
  const allEvents = trip.days.flatMap(day => 
    day.events.map(event => ({
      id: event.id,
      title: event.title || event.foodName || "名称未設定のイベント",
      time: event.time,
      dayNumber: day.dayNumber,
      photos: event.photos || [],
    }))
  ).sort((a, b) => {
    if (a.dayNumber !== b.dayNumber) return a.dayNumber - b.dayNumber;
    return a.time.localeCompare(b.time);
  });

  return (
    <TripLayout 
      slug={slug} 
      activePath={`/trip/${slug}/memories`} 
      isSecretMode={isAdmin} 
      title="Travel Memories"
      subtitle="旅の瞬間を、永遠の記録に。"
    >
      <Container className="pb-24">
        {/* Header Section */}
        <div className="mb-16 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-rose-500 text-white shadow-xl shadow-rose-200 mb-6">
            <Camera size={32} />
          </div>
          <h2 className="font-playfair text-4xl font-bold text-stone-900 mb-4">Memory Collection</h2>
          <p className="text-stone-500 max-w-md mx-auto leading-relaxed">
            旅先で見つけた景色、美味しいもの、二人の笑顔。<br />
            大切な瞬間をアップロードして、共有しましょう。
          </p>
        </div>

        {/* Upload Section */}
        <div className="mb-24">
          <SectionHeader title="Share New Moment" subtitle="イベントを選んで写真をアップロード" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {allEvents.map((event) => (
              <MagazineCard key={event.id} padding="sm" className="flex flex-col justify-between border-rose-100 hover:border-rose-300 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-rose-400">Day {event.dayNumber} - {event.time}</span>
                    <Sparkles size={14} className="text-rose-200" />
                  </div>
                  <h3 className="font-bold text-stone-800 mb-6 line-clamp-1">{event.title}</h3>
                </div>
                <PhotoUploadButton eventId={event.id} />
              </MagazineCard>
            ))}
          </div>
        </div>

        {/* Gallery Section */}
        {eventsWithPhotos.length > 0 && (
          <div>
            <SectionHeader title="The Gallery" subtitle="これまでに集まった旅の記録" />
            <div className="space-y-16 mt-12">
              {eventsWithPhotos.map((event) => (
                <div key={event.id} className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                  <div className="flex items-baseline gap-4 mb-6">
                    <h3 className="font-playfair text-2xl font-bold text-stone-900">{event.title || event.foodName}</h3>
                    <div className="h-px flex-1 bg-stone-100" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">{event.time}</span>
                  </div>
                  <PhotoGallery photos={event.photos} eventId={event.id} />
                </div>
              ))}
            </div>
          </div>
        )}

        {eventsWithPhotos.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-stone-100 rounded-[3rem]">
            <p className="text-stone-400 font-medium italic">まだ写真がありません。最初の思い出をアップロードしてみましょう！</p>
          </div>
        )}
      </Container>
    </TripLayout>
  );
}
