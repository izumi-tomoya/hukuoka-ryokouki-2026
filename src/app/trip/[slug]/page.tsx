import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { SECRET_MODE_COOKIE_NAME } from "@/config/constants";
import { getTripBySlug } from "@/features/trip/api/tripActions";
import { Calendar, MapPin, ChevronRight, Clock } from "lucide-react";
import CategoryTabs from "@/components/trip/CategoryTabs";
import { TripCountdown } from "@/features/trip/components/client/TripCountdown";

export default async function TripPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);
  if (!trip) return notFound();

  const cookieStore = await cookies();
  const isSecretMode = cookieStore.get(SECRET_MODE_COOKIE_NAME)?.value === "true";

  return (
    <div className="min-h-screen bg-stone-50 pb-24">
      {/* ─── Header ─── */}
      <header className="px-6 pt-16 pb-12 mx-auto max-w-5xl">
        <CategoryTabs slug={slug} activePath={`/trip/${slug}`} isSecretMode={isSecretMode} />
        
        <div className="mt-12 text-center md:text-left">
          <h1 className="font-playfair text-5xl md:text-6xl font-extrabold text-stone-900 mb-6 tracking-tight leading-tight">
            {trip.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 text-stone-400 text-xs font-bold tracking-[0.2em] uppercase">
            <div className="flex items-center gap-2"><MapPin size={14} className="text-rose-400" /> {trip.location}</div>
            <div className="h-1.5 w-1.5 rounded-full bg-rose-200" />
            <div className="flex items-center gap-2"><Calendar size={14} className="text-rose-400" /> {new Date(trip.startDate).toLocaleDateString("ja-JP", { month: "short", day: "numeric" })} — {new Date(trip.endDate).toLocaleDateString("ja-JP", { month: "short", day: "numeric" })}</div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {/* Countdown Tile */}
          <div className="md:col-span-2 overflow-hidden rounded-[3rem] bg-white border border-rose-100 p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 text-rose-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4">
                <Clock size={12} />
                Countdown to Journey
              </div>
              <h3 className="font-playfair text-3xl font-bold text-stone-900">旅の始まりまで、あと...</h3>
            </div>
            <div className="shrink-0">
              <TripCountdown startDate={trip.startDate} />
            </div>
          </div>

          {/* Day Cards */}
          {trip.days.map((day) => (
            <Link
              key={day.id}
              href={`/trip/${slug}/day/${day.dayNumber}`}
              className="group block rounded-[2.5rem] border border-rose-100 bg-white p-10 shadow-sm transition-all hover:shadow-2xl hover:-translate-y-1.5 hover:border-rose-300"
            >
              <div className="flex justify-between items-start mb-12">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-rose-400">Chapter {day.dayNumber}</span>
                <div className="h-14 w-14 rounded-3xl bg-rose-50 flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all shadow-sm">
                  <ChevronRight size={24} strokeWidth={2.5} />
                </div>
              </div>
              <h2 className="font-playfair text-4xl font-bold text-stone-900 mb-4 leading-tight">{day.title}</h2>
              <div className="pt-6 border-t border-stone-50 flex items-center justify-between text-xs font-bold text-stone-400 uppercase tracking-widest">
                <span>{new Date(day.date).toLocaleDateString("ja-JP", { month: "short", day: "numeric", weekday: "short" })}</span>
                <span>{day.events.length} Plans</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
