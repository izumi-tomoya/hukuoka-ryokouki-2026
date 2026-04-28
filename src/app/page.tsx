import Link from 'next/link';
import { Plus, Lock } from 'lucide-react';
import { getTrips } from '@/features/trip/api/tripActions';

export default async function PortalPage() {
  const trips = await getTrips();
  const tripCount = trips.length;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      {/* ─── Hero ─── */}
      <header
        className="relative overflow-hidden px-6 pt-24 md:pt-28 pb-16 md:pb-20 bg-linear-to-br from-white via-stone-50 to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 border-b border-border"
      >
        <div className="absolute -top-32 -left-32 h-150 w-150 rounded-full bg-rose-500/5 dark:bg-rose-500/10 blur-[160px]" />
        <div className="absolute -bottom-20 right-0 h-100 w-100 rounded-full bg-primary/5 dark:bg-primary/10 blur-[120px]" />

        {/* Watermark */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none overflow-hidden">
          <span className="font-playfair text-[180px] sm:text-[240px] md:text-[340px] font-bold italic leading-none tracking-tighter text-primary/5 dark:text-primary/10">
            M
          </span>
        </div>

        <div className="relative mx-auto max-w-7xl flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card/50 dark:bg-card/30 border border-border mb-8 md:mb-10 backdrop-blur-md whitespace-nowrap shadow-sm">
            <Lock size={10} className="text-primary" />
            <span className="text-[9px] font-black tracking-[4px] text-muted-foreground uppercase">
              Private Collection
            </span>
          </div>

          <h1
            className="font-playfair italic text-[48px] sm:text-[64px] md:text-[88px] font-bold leading-none tracking-tight bg-linear-to-r from-zinc-900 via-zinc-700 to-zinc-900 dark:from-white dark:via-zinc-300 dark:to-white bg-clip-text text-transparent"
          >
            Memories
          </h1>

          <div className="mt-6 md:mt-8 max-w-lg">
            <p className="text-[14px] md:text-[17px] text-muted-foreground font-medium leading-relaxed tracking-wide px-4">
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
              <div className="relative h-full overflow-hidden rounded-[32px] md:rounded-[40px] bg-card p-8 md:p-10 border border-border transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 dark:hover:shadow-primary/20 hover:-translate-y-2 active:scale-[0.98]">
                {/* Accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{ background: trip.accentColor || 'var(--primary)' }}
                />

                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[11px] font-black tracking-[0.3em] text-primary/60 uppercase">
                      {new Date(trip.startDate).getFullYear()}
                    </span>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  <h2 className="font-playfair text-[28px] md:text-[32px] font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                    {trip.title}
                  </h2>
                  <p className="mt-3 text-[13px] font-bold text-muted-foreground tracking-widest uppercase">
                    {trip.location}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] font-black tracking-widest text-muted-foreground uppercase">
                  <span>View Details</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-primary opacity-0 -translate-x-4 transition-all group-hover:opacity-100 group-hover:translate-x-0">
                    <Plus size={14} />
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {/* Create New Trip Link */}
          <Link
            href="/trip/new"
            className="group relative flex min-h-80 flex-col items-center justify-center rounded-[40px] border-2 border-dashed border-border bg-card/50 text-center transition-all hover:bg-card hover:border-primary active:scale-[0.98]"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
              <Plus size={32} />
            </div>
            <p className="mt-6 text-[12px] font-black tracking-[0.3em] text-muted-foreground uppercase group-hover:text-primary">
              New Adventure
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
