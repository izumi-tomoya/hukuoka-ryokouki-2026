import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { SECRET_MODE_COOKIE_NAME } from "@/config/constants";
import { getTripBySlug } from "@/app/actions/tripActions";
import { Calendar, MapPin, ChevronRight } from "lucide-react";

export default async function TripPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);
  if (!trip) return notFound();

  const cookieStore = await cookies();
  const isSecretMode = cookieStore.get(SECRET_MODE_COOKIE_NAME)?.value === "true";

  const dayTheme = [
    { accent: "#C45A10", accentDim: "text-amber-400/80", bg: "from-[#3D1007] via-[#7A2E0A] to-[#C45A10]" },
    { accent: "#9B3370", accentDim: "text-rose-400/80",  bg: "from-[#0D0818] via-[#1A0D2E] to-[#2D1645]" },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F4] selection:bg-amber-100">

      {/* ─── Hero ─── */}
      <header className="relative overflow-hidden px-6 pt-16 pb-20 md:pt-24 md:pb-28" style={{ background: trip.image }}>
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-black/10" />
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />

        <div className="relative mx-auto max-w-7xl">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/8 px-4 py-1.5 text-[10px] font-black tracking-[3px] text-white/60 uppercase backdrop-blur-md ring-1 ring-white/10 hover:bg-white/15 transition-all"
          >
            ← Memoir
          </Link>

          <div className="flex items-center gap-2 mb-3">
            <MapPin size={12} className="text-white/50" />
            <span className="text-[10px] font-bold tracking-[4px] uppercase text-white/50">{trip.location}</span>
          </div>
          <h1 className="font-playfair text-[40px] md:text-[60px] font-bold text-white leading-tight tracking-tight drop-shadow-xl mb-4">
            {trip.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Calendar size={13} className="text-white/40" />
              <span className="text-[12px] font-bold text-white/40">
                {new Date(trip.startDate).toLocaleDateString("ja-JP", { year: "numeric", month: "short", day: "numeric" })}
                {" – "}
                {new Date(trip.endDate).toLocaleDateString("ja-JP", { month: "short", day: "numeric" })}
              </span>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white/60 backdrop-blur-sm ring-1 ring-white/15">
              {trip.status}
            </span>
          </div>
        </div>
      </header>

      {/* ─── Days ─── */}
      <main className="mx-auto max-w-7xl px-6 md:px-12 pt-12 pb-24">
        <div className="mb-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-linear-to-r from-stone-200 to-transparent" />
          <span className="text-[9px] font-black tracking-[7px] text-stone-300 uppercase">Itinerary</span>
          <div className="h-px flex-1 bg-linear-to-l from-stone-200 to-transparent" />
        </div>

        {trip.days.length === 0 ? (
          <p className="text-center text-stone-400 py-20 text-[13px] font-medium">
            スケジュールはまだ登録されていません
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {trip.days.map((day) => {
              const t = dayTheme[(day.dayNumber - 1) % dayTheme.length];
              return (
                <Link
                  key={day.id}
                  href={`/trip/${slug}/day/${day.dayNumber}`}
                  className="group relative block overflow-hidden rounded-[32px] shadow-md transition-all hover:-translate-y-1.5 hover:shadow-2xl"
                >
                  <div className={`absolute inset-0 bg-linear-to-br ${t.bg}`} />
                  <div className="absolute left-0 top-8 bottom-8 w-1.5 rounded-r-full" style={{ background: t.accent }} />
                  <div className="absolute inset-0 rounded-[32px] ring-1 ring-white/10" />
                  <div
                    className="absolute -bottom-4 -right-2 pointer-events-none select-none font-playfair font-black leading-none text-white/5 transition-transform group-hover:scale-110"
                    style={{ fontSize: "120px" }}
                  >
                    {String(day.dayNumber).padStart(2, "0")}
                  </div>

                  <div className="relative p-8 lg:p-10">
                    <div className="flex items-start justify-between mb-5">
                      <div>
                        <p className={`text-[10px] font-black tracking-[4px] uppercase mb-2 whitespace-nowrap ${t.accentDim}`}>
                          Day {String(day.dayNumber).padStart(2, "0")}
                        </p>
                        <h3 className="font-playfair text-[24px] md:text-[28px] font-bold text-white leading-tight tracking-tight">
                          {day.title ?? `Day ${day.dayNumber}`}
                        </h3>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-[20px] text-white shadow-xl transition-all group-hover:scale-110" style={{ background: t.accent }}>
                        <ChevronRight size={22} strokeWidth={2.5} />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-[11px] font-bold text-white/30 bg-white/5 px-3 py-1 rounded-full">
                        {new Date(day.date).toLocaleDateString("ja-JP", { month: "short", day: "numeric", weekday: "short" })}
                      </span>
                      <div className="h-1 w-1 rounded-full bg-white/15" />
                      <span className="rounded-full text-white px-3 py-1 text-[10px] font-black uppercase tracking-wider whitespace-nowrap" style={{ background: t.accent }}>
                        {day.events.length} Events
                      </span>
                    </div>

                    <div className="flex gap-1.5">
                      {Array.from({ length: Math.min(day.events.length, 16) }).map((_, i) => (
                        <div key={i} className="h-2 flex-1 rounded-full bg-white/15 transition-all group-hover:bg-white/30" />
                      ))}
                    </div>
                  </div>
                </Link>
              );
            })}

            {isSecretMode && trip.tips.length > 0 && (
              <Link
                href={`/trip/${slug}/tips`}
                className="group relative flex items-center gap-6 overflow-hidden rounded-[32px] bg-stone-950 p-8 md:p-10 shadow-2xl transition-all hover:-translate-y-1.5 md:col-span-2"
              >
                <div className="absolute inset-0 bg-linear-to-br from-amber-600/15 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="absolute inset-0 rounded-[32px] ring-1 ring-white/6" />
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-[24px] border border-amber-400/20 bg-amber-400/10 text-4xl backdrop-blur-sm transition-transform group-hover:scale-110 group-hover:rotate-3">
                  🧭
                </div>
                <div className="relative">
                  <p className="text-[10px] font-black tracking-[4px] text-amber-400/70 uppercase mb-1.5 whitespace-nowrap">Secret Guide</p>
                  <h3 className="text-[20px] font-bold text-white tracking-tight">Escort Tips</h3>
                  <p className="text-[12px] text-white/30 mt-1">裏方として完璧な旅をプロデュース</p>
                </div>
                <div className="relative ml-auto flex h-12 w-12 items-center justify-center rounded-[18px] bg-white/5 transition-all group-hover:bg-amber-400/10">
                  <ChevronRight size={22} className="text-white/40 transition-colors group-hover:text-amber-400" />
                </div>
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
