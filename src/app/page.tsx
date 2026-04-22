import Link from "next/link";
import { MapPin, Calendar, ChevronRight, Plus, Lock } from "lucide-react";
import { getTrips } from "@/app/actions/tripActions";
import NewTripForm from "@/components/trip/client/NewTripForm";

const statusConfig = {
  Upcoming:  { dot: "bg-blue-400",    text: "text-blue-200",    ring: "ring-blue-400/20",    bg: "bg-blue-400/10"    },
  Planning:  { dot: "bg-amber-400",   text: "text-amber-200",   ring: "ring-amber-400/20",   bg: "bg-amber-400/10"   },
  Completed: { dot: "bg-emerald-400", text: "text-emerald-200", ring: "ring-emerald-400/20", bg: "bg-emerald-400/10" },
} as const;

export default async function PortalPage() {
  const trips = await getTrips();

  return (
    <div className="min-h-screen bg-[#FAF8F4] selection:bg-amber-100">

      {/* ─── Hero ─── */}
      <header className="relative overflow-hidden bg-[#0D0A06] px-6 pt-28 pb-20">
        <div className="absolute -top-40 -left-40 h-150 w-150 rounded-full bg-amber-800/8 blur-[160px]" />
        <div className="absolute -bottom-20 right-0 h-100 w-100 rounded-full bg-orange-900/6 blur-[120px]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-amber-600/25 to-transparent" />

        {/* Large M watermark */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none overflow-hidden">
          <span className="font-playfair text-[240px] md:text-[340px] font-bold italic leading-none tracking-tighter text-white/[0.018]">
            M
          </span>
        </div>

        <div className="relative mx-auto max-w-7xl flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/4 ring-1 ring-white/10 mb-10 backdrop-blur-md whitespace-nowrap">
            <Lock size={10} className="text-amber-400/70" />
            <span className="text-[9px] font-black tracking-[4px] text-white/40 uppercase">Private Collection</span>
          </div>

          <h1
            className="font-playfair italic text-[56px] md:text-[88px] font-bold leading-none tracking-tight"
            style={{
              background: "linear-gradient(140deg, #F0DFB0 0%, #E8C46A 35%, #C49830 65%, #EDD898 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Memoir
          </h1>

          <div className="flex items-center gap-5 mt-5 mb-7">
            <div className="h-px w-12 bg-amber-700/30" />
            <span className="text-[9px] font-black tracking-[5px] text-amber-700/35 uppercase whitespace-nowrap">Est. 2026</span>
            <div className="h-px w-12 bg-amber-700/30" />
          </div>

          <p className="text-white/30 text-[13px] md:text-[15px] font-medium max-w-sm mx-auto leading-relaxed">
            ふたりで巡った場所、これから行きたい場所。<br />
            すべての旅の大切な記録を、ここに。
          </p>
        </div>
      </header>

      {/* ─── Collection ─── */}
      <main className="mx-auto max-w-7xl px-6 md:px-12 pt-12 pb-28">
        <div className="mb-10 flex items-center gap-4">
          <div className="h-px flex-1 bg-linear-to-r from-stone-200 to-transparent" />
          <span className="text-[9px] font-black tracking-[7px] text-stone-300 uppercase">
            {trips.length > 0 ? `${trips.length} Journey${trips.length !== 1 ? "s" : ""}` : "Collection"}
          </span>
          <div className="h-px flex-1 bg-linear-to-l from-stone-200 to-transparent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {trips.map((trip, i) => {
            const s = statusConfig[(trip.status as keyof typeof statusConfig)] ?? statusConfig.Upcoming;
            return (
              <Link
                key={trip.id}
                href={`/trip/${trip.slug}`}
                className="group block animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="overflow-hidden rounded-[36px] bg-white ring-1 ring-stone-100/80 shadow-lg shadow-stone-200/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-stone-300/40">
                  {/* Gradient "photo" */}
                  <div className="relative h-72 overflow-hidden" style={{ background: trip.image }}>
                    <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/5 to-transparent" />
                    <div className="absolute inset-3 rounded-[28px] ring-1 ring-white/8" />

                    {/* Status badge */}
                    <div className="absolute top-5 right-5">
                      <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md ring-1 text-[9px] font-black uppercase tracking-widest whitespace-nowrap ${s.bg} ${s.ring} ${s.text}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                        {trip.status}
                      </span>
                    </div>

                    <div className="absolute bottom-6 left-7 right-7">
                      <div className="flex items-center gap-2 mb-1.5 overflow-hidden">
                        <MapPin size={11} className="text-white/50 shrink-0" />
                        <span className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/50 whitespace-nowrap overflow-hidden text-ellipsis">{trip.location}</span>
                      </div>
                      <h2 className="font-playfair text-[22px] md:text-[30px] font-bold text-white leading-tight drop-shadow-lg tracking-tighter whitespace-nowrap overflow-hidden text-ellipsis">
                        {trip.title}
                      </h2>
                    </div>
                  </div>

                  {/* Footer strip */}
                  <div className="flex items-center justify-between px-7 py-5">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <Calendar size={13} className="text-stone-300 shrink-0" />
                      <span className="text-[12px] font-bold text-stone-400 whitespace-nowrap overflow-hidden tracking-tighter">
                        {new Date(trip.startDate).toLocaleDateString("ja-JP", { year: "numeric", month: "short", day: "numeric" })}
                        {" – "}
                        {new Date(trip.endDate).toLocaleDateString("ja-JP", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-50 shadow-sm transition-all group-hover:bg-[#0D0A06]">
                      <ChevronRight size={16} strokeWidth={2.5} className="text-stone-300 transition-colors group-hover:text-white" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}

          {/* ─── New trip card ─── */}
          <div className="overflow-hidden rounded-[36px] bg-[#FDFAF5] ring-1 ring-amber-200/60 shadow-sm">
            <div className="px-8 pt-8 pb-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 ring-1 ring-amber-200">
                  <Plus size={18} className="text-amber-600" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[9px] font-black tracking-[3px] text-amber-500/60 uppercase whitespace-nowrap">New Chapter</p>
                  <h3 className="text-[16px] font-bold text-stone-700 leading-none mt-0.5">次の旅を計画する</h3>
                </div>
              </div>
              <div className="h-px bg-amber-100 mb-6" />
              <NewTripForm />
            </div>
          </div>
        </div>
      </main>

      <footer className="py-10 border-t border-stone-100/80">
        <p className="text-center text-[9px] font-black tracking-[4px] text-stone-300 uppercase whitespace-nowrap">
          &copy; 2026 Memoir — Private Travel Journal
        </p>
      </footer>
    </div>
  );
}
