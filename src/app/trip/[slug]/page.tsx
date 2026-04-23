import { BentoTile } from "@/components/ui/BentoTile";
import { getTripBySlug } from "@/features/trip/api/tripActions";
import { notFound } from "next/navigation";
import { TripCountdown } from "@/features/trip/components/client/TripCountdown";
import Link from "next/link";

export default async function TripPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);

  if (!trip) return notFound();

  return (
    <main className="min-h-screen bg-[#FDFDFC] p-6 pb-24 md:p-12">
      <header className="mb-12 max-w-2xl">
        <h1 className="text-4xl font-light tracking-tight text-zinc-900 mb-2">{trip.title}</h1>
        <p className="text-zinc-500">{trip.location}</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Countdown Tile */}
        <BentoTile className="md:col-span-2 lg:col-span-1 bg-[#FDFDFC] border-zinc-200">
          <h3 className="text-zinc-400 text-[10px] uppercase tracking-[0.2em] mb-4">Countdown</h3>
          <TripCountdown startDate={new Date(trip.startDate)} />
        </BentoTile>

        {/* Days Grid */}
        {trip.days.map((day) => (
          <Link 
            key={day.id} 
            href={`/trip/${slug}/day/${day.dayNumber}`}
            className="group block"
          >
            <BentoTile className="transition-all hover:shadow-lg hover:border-zinc-300">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Day {day.dayNumber}</span>
              <h3 className="text-xl font-medium mt-1 mb-4">{day.title}</h3>
              <p className="text-sm text-zinc-500 line-clamp-2">{day.highlight}</p>
            </BentoTile>
          </Link>
        ))}
      </div>
    </main>
  );
}
