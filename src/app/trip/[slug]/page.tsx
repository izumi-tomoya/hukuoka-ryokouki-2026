import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { SECRET_MODE_COOKIE_NAME } from "@/config/constants";
import { getTripBySlug } from "@/app/actions/tripActions";
import { Calendar, MapPin, ChevronRight, Lock } from "lucide-react";

export default async function TripPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);
  if (!trip) return notFound();

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* ─── Header ─── */}
      <header className="px-6 pt-12 pb-8 mx-auto max-w-5xl">
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-rose-400 mb-8 hover:text-rose-600">
          ← Back to Collection
        </Link>
        <h1 className="font-playfair text-4xl md:text-5xl font-bold text-rose-950 mb-4 tracking-tight">{trip.title}</h1>
        <div className="flex items-center gap-4 text-stone-500 text-sm font-medium">
          <div className="flex items-center gap-1.5"><MapPin size={14} /> {trip.location}</div>
          <span>•</span>
          <div className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(trip.startDate).toLocaleDateString("ja-JP", { month: "short", day: "numeric" })}</div>
        </div>
      </header>

      {/* ─── Days Grid ─── */}
      <main className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trip.days.map((day) => (
            <Link
              key={day.id}
              href={`/trip/${slug}/day/${day.dayNumber}`}
              className="group block rounded-[2rem] border border-rose-100 bg-white p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-8">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-400">Day {day.dayNumber}</span>
                <div className="h-10 w-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                  <ChevronRight size={18} />
                </div>
              </div>
              <h2 className="font-playfair text-2xl font-bold text-stone-900 mb-2">{day.title}</h2>
              <p className="text-sm text-stone-500">{day.events.length} Plans</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
