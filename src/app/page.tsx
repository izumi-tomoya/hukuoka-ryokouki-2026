import Link from 'next/link';
import { Plus, Lock } from 'lucide-react';
import { getTrips } from '@/features/trip/api/tripActions';

export default async function PortalPage() {
  const trips = await getTrips();
  const tripCount = trips.length;

  return (
    <div className="min-h-screen bg-[#FFFCF9] selection:bg-rose-100">
      {/* ─── Hero ─── */}
      <header
        className="relative overflow-hidden px-6 pt-24 md:pt-28 pb-16 md:pb-20"
        style={{ background: 'linear-gradient(160deg, #FFF5F7 0%, #FFE8F0 45%, #F5E8FF 100%)' }}
      >
        <div className="absolute -top-32 -left-32 h-150 w-150 rounded-full bg-rose-200/30 blur-[160px]" />
        <div className="absolute -bottom-20 right-0 h-100 w-100 rounded-full bg-purple-200/20 blur-[120px]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-rose-300/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-rose-200/30 to-transparent" />

        {/* Watermark */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none overflow-hidden">
          <span className="font-playfair text-[180px] sm:text-[240px] md:text-[340px] font-bold italic leading-none tracking-tighter text-rose-300/12">
            M
          </span>
        </div>

        <div className="relative mx-auto max-w-7xl flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 ring-1 ring-rose-200/60 mb-8 md:mb-10 backdrop-blur-md whitespace-nowrap shadow-sm">
            <Lock size={10} className="text-rose-400" />
            <span className="text-[9px] font-black tracking-[4px] text-rose-400/80 uppercase">
              Private Collection
            </span>
          </div>

          <h1
            className="font-playfair italic text-[48px] sm:text-[64px] md:text-[88px] font-bold leading-none tracking-tight"
            style={{
              background:
                'linear-gradient(140deg, #D4607A 0%, #C04870 35%, #9B3A8C 65%, #D4607A 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Memories
          </h1>

          <div className="mt-6 md:mt-8 max-w-lg">
            <p className="text-[14px] md:text-[17px] text-rose-900/60 font-medium leading-relaxed tracking-wide px-4">
              {tripCount > 0
                ? `${tripCount}つの旅路、数えきれないほどの物語。ふたりで歩んだ軌跡をここに。`
                : 'これから始まる、ふたりだけの新しい物語を綴りましょう。'}
            </p>
          </div>
        </div>
      </header>

      {/* ─── Grid ─── */}
      <main className="mx-auto max-w-7xl px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {trips.map((trip) => (
            <Link key={trip.id} href={`/trip/${trip.slug}`} className="group relative block">
              <div className="relative h-full overflow-hidden rounded-[32px] md:rounded-[40px] bg-white p-8 md:p-10 ring-1 ring-rose-100/50 transition-all duration-500 hover:shadow-2xl hover:shadow-rose-200/40 hover:-translate-y-2 active:scale-[0.98]">
                {/* Accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{ background: trip.accentColor || '#D4607A' }}
                />

                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[11px] font-black tracking-[0.3em] text-rose-300 uppercase">
                      {new Date(trip.startDate).getFullYear()}
                    </span>
                    <div className="h-px flex-1 bg-rose-50" />
                  </div>
                  <h2 className="font-playfair text-[28px] md:text-[32px] font-bold text-stone-900 leading-tight group-hover:text-rose-600 transition-colors">
                    {trip.title}
                  </h2>
                  <p className="mt-3 text-[13px] font-bold text-rose-400/80 tracking-widest uppercase">
                    {trip.location}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] font-black tracking-widest text-stone-300 uppercase">
                  <span>View Details</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-rose-400 opacity-0 -translate-x-4 transition-all group-hover:opacity-100 group-hover:translate-x-0">
                    <Plus size={14} />
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {/* Create New Trip Link */}
          <Link
            href="/trip/new"
            className="group relative flex min-h-80 flex-col items-center justify-center rounded-[40px] border-2 border-dashed border-rose-100 bg-white/50 text-center transition-all hover:bg-white hover:border-rose-300 active:scale-[0.98]"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-300 transition-transform group-hover:scale-110 group-hover:bg-rose-100 group-hover:text-rose-500">
              <Plus size={32} />
            </div>
            <p className="mt-6 text-[12px] font-black tracking-[0.3em] text-rose-300 uppercase group-hover:text-rose-500">
              New Adventure
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
