import Link from "next/link";
import { MapPin, Calendar, ChevronRight, Plus, Lock } from "lucide-react";
import { getTrips } from "@/app/actions/tripActions";
import NewTripForm from "@/components/trip/client/NewTripForm";

const statusConfig = {
  Upcoming:  { dot: "bg-sky-400",    text: "text-sky-700",    ring: "ring-sky-200",    bg: "bg-sky-50"    },
  Planning:  { dot: "bg-rose-400",   text: "text-rose-700",   ring: "ring-rose-200",   bg: "bg-rose-50"   },
  Completed: { dot: "bg-emerald-400", text: "text-emerald-700", ring: "ring-emerald-200", bg: "bg-emerald-50" },
} as const;

export default async function PortalPage() {
  const trips = await getTrips();

  return (
    <div className="min-h-screen bg-stone-50 selection:bg-rose-100">

      {/* ─── Hero ─── */}
      <header className="relative overflow-hidden px-6 pt-28 pb-20 bg-rose-50/50">
        <div className="absolute -top-32 -left-32 h-150 w-150 rounded-full bg-rose-100/50 blur-[160px]" />
        <div className="absolute -bottom-20 right-0 h-100 w-100 rounded-full bg-purple-100/40 blur-[120px]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-stone-200" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-stone-200" />

        {/* Watermark */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none overflow-hidden">
          <span className="font-playfair text-[240px] md:text-[340px] font-bold italic leading-none tracking-tighter text-rose-200/30">
            M
          </span>
        </div>

        <div className="relative mx-auto max-w-7xl flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white ring-1 ring-rose-100 mb-10 shadow-sm">
            <Lock size={10} className="text-rose-400" />
            <span className="text-[10px] font-black tracking-[4px] text-rose-500 uppercase">Private Collection</span>
          </div>

          <h1
            className="font-playfair italic text-[56px] md:text-[88px] font-bold leading-none tracking-tight text-rose-900"
          >
            Memoir
          </h1>

          <div className="flex items-center gap-5 mt-5 mb-7">
            <div className="h-px w-12 bg-rose-200" />
            <span className="text-[10px] font-black tracking-[5px] text-rose-400 uppercase whitespace-nowrap">Est. 2026</span>
            <div className="h-px w-12 bg-rose-200" />
          </div>

          <p className="text-stone-500 text-sm md:text-base font-medium max-w-sm mx-auto leading-relaxed">
            ふたりで巡った場所、これから行きたい場所。<br />
            すべての旅の大切な記録を、ここに。
          </p>
        </div>
      </header>

      {/* ─── Collection ─── */}
      <main className="mx-auto max-w-7xl px-6 md:px-12 pt-12 pb-28">
        <div className="mb-10 flex items-center gap-4">
          <div className="h-px flex-1 bg-linear-to-r from-rose-200/60 to-transparent" />
          <span className="text-[9px] font-black tracking-[7px] text-rose-300 uppercase">
            {trips.length > 0 ? `${trips.length} Journey${trips.length !== 1 ? "s" : ""}` : "Collection"}
          </span>
          <div className="h-px flex-1 bg-linear-to-l from-rose-200/60 to-transparent" />
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
                <div className="overflow-hidden rounded-[36px] bg-white ring-1 ring-rose-100/80 shadow-lg shadow-rose-200/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-rose-200/40">
                  {/* Gradient "photo" */}
                  <div className="relative h-72 overflow-hidden" style={{ background: trip.image }}>
                    <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/5 to-transparent" />
                    <div className="absolute inset-3 rounded-[28px] ring-1 ring-white/10" />

                    {/* Status badge */}
                    <div className="absolute top-5 right-5">
                      <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md ring-1 text-[9px] font-black uppercase tracking-widest whitespace-nowrap ${s.bg} ${s.ring} ${s.text}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                        {trip.status}
                      </span>
                    </div>

                    <div className="absolute bottom-6 left-7 right-7">
                      <div className="flex items-center gap-2 mb-1.5 overflow-hidden">
                        <MapPin size={11} className="text-white/60 shrink-0" />
                        <span className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/60 whitespace-nowrap overflow-hidden text-ellipsis">{trip.location}</span>
                      </div>
                      <h2 className="font-playfair text-[22px] md:text-[30px] font-bold text-white leading-tight drop-shadow-lg tracking-tighter whitespace-nowrap overflow-hidden text-ellipsis">
                        {trip.title}
                      </h2>
                    </div>
                  </div>

                  {/* Footer strip */}
                  <div className="flex items-center justify-between px-7 py-5">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <Calendar size={13} className="text-rose-300 shrink-0" />
                      <span className="text-[12px] font-bold text-rose-400/70 whitespace-nowrap overflow-hidden tracking-tighter">
                        {new Date(trip.startDate).toLocaleDateString("ja-JP", { year: "numeric", month: "short", day: "numeric" })}
                        {" – "}
                        {new Date(trip.endDate).toLocaleDateString("ja-JP", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 shadow-sm transition-all group-hover:bg-rose-500">
                      <ChevronRight size={16} strokeWidth={2.5} className="text-rose-400 transition-colors group-hover:text-white" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}

          {/* ─── New trip card ─── */}
          <div className="overflow-hidden rounded-[36px] bg-[#FFF8FA] ring-1 ring-rose-200/50 shadow-sm">
            <div className="px-8 pt-8 pb-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 ring-1 ring-rose-200">
                  <Plus size={18} className="text-rose-500" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[9px] font-black tracking-[3px] text-rose-400/70 uppercase whitespace-nowrap">New Chapter</p>
                  <h3 className="text-[16px] font-bold text-rose-900/70 leading-none mt-0.5">次の旅を計画する</h3>
                </div>
              </div>
              <div className="h-px bg-rose-100 mb-6" />
              <NewTripForm />
            </div>
          </div>
        </div>
      </main>

      <footer className="py-10 border-t border-rose-100/60">
        <p className="text-center text-[9px] font-black tracking-[4px] text-rose-300/80 uppercase whitespace-nowrap">
          &copy; 2026 Memoir — Private Travel Journal
        </p>
      </footer>
    </div>
  );
}
