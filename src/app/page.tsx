import { Lock, Plus } from "lucide-react";
import Link from "next/link";
import { MagazineCard } from "@/components/ui/MagazineCard";
import { getTrips } from "@/features/trip/api/tripActions";

export default async function PortalPage() {
  const trips = await getTrips();
  const tripCount = trips.length;

  return (
    <div className="bg-background text-foreground min-h-screen transition-colors duration-500">
      {/* ─── Hero ─── */}
      <header className="border-border relative overflow-hidden border-b bg-linear-to-br from-white via-stone-50 to-white px-6 pt-24 pb-16 md:pt-28 md:pb-20 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        <div className="absolute -top-32 -left-32 h-150 w-150 rounded-full bg-rose-500/5 blur-[160px] dark:bg-rose-500/10" />
        <div className="bg-primary/5 dark:bg-primary/10 absolute right-0 -bottom-20 h-100 w-100 rounded-full blur-[120px]" />

        {/* Watermark */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none">
          <span className="font-playfair text-primary/5 dark:text-primary/10 text-[180px] leading-none font-bold tracking-tighter italic sm:text-[240px] md:text-[340px]">
            M
          </span>
        </div>

        <div className="relative mx-auto flex max-w-7xl flex-col items-center text-center">
          <div className="bg-card/50 dark:bg-card/30 border-border mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 whitespace-nowrap shadow-sm backdrop-blur-md md:mb-10">
            <Lock size={10} className="text-primary" />
            <span className="text-muted-foreground text-[9px] font-black tracking-[4px] uppercase">
              Private Collection
            </span>
          </div>

          <h1 className="font-playfair bg-linear-to-r from-zinc-900 via-zinc-700 to-zinc-900 bg-clip-text text-[48px] leading-none font-bold tracking-tight text-transparent italic sm:text-[64px] md:text-[88px] dark:from-white dark:via-zinc-300 dark:to-white">
            Memories
          </h1>

          <div className="mt-6 max-w-lg md:mt-8">
            <p className="text-muted-foreground px-4 text-[14px] leading-relaxed font-medium tracking-wide md:text-[17px]">
              {tripCount > 0
                ? `${tripCount}つの旅路、数えきれないほどの物語。ふたりで歩んだ軌跡をここに。`
                : "これから始まる、ふたりだけの新しい物語を綴りましょう。"}
            </p>
          </div>
        </div>
      </header>

      {/* ─── Grid ─── */}
      <main className="mx-auto max-w-7xl px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10 lg:grid-cols-3">
          {trips.map((trip) => (
            <Link key={trip.id} href={`/trip/${trip.slug}`} className="group relative block">
              <MagazineCard
                className="hover:shadow-primary/5 dark:hover:shadow-primary/20 relative h-full overflow-hidden p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl active:scale-[0.98] md:p-10"
                padding="none"
              >
                {/* Accent line */}
                <div
                  className="absolute top-0 right-0 left-0 h-1.5"
                  style={{ background: trip.accentColor || "var(--primary)" }}
                />

                <div className="mb-10">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="text-primary/60 text-[11px] font-black tracking-[0.3em] uppercase">
                      {new Date(trip.startDate).getFullYear()}
                    </span>
                    <div className="bg-border h-px flex-1" />
                  </div>
                  <h2 className="font-playfair text-foreground group-hover:text-primary text-[28px] leading-tight font-bold transition-colors md:text-[32px]">
                    {trip.title}
                  </h2>
                  <p className="text-muted-foreground mt-3 text-[13px] font-bold tracking-widest uppercase">
                    {trip.location}
                  </p>
                </div>

                <div className="text-muted-foreground flex items-center justify-between text-[11px] font-black tracking-widest uppercase">
                  <span>View Details</span>
                  <div className="bg-secondary text-primary flex h-8 w-8 -translate-x-4 items-center justify-center rounded-full opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
                    <Plus size={14} />
                  </div>
                </div>
              </MagazineCard>
            </Link>
          ))}

          {/* Create New Trip Link */}
          <Link
            href="/trip/new"
            className="group border-border bg-card/50 hover:bg-card hover:border-primary relative flex min-h-80 flex-col items-center justify-center rounded-[40px] border-2 border-dashed text-center transition-all active:scale-[0.98]"
          >
            <div className="bg-secondary text-muted-foreground group-hover:bg-primary flex h-16 w-16 items-center justify-center rounded-full transition-all group-hover:scale-110 group-hover:text-white">
              <Plus size={32} />
            </div>
            <p className="text-muted-foreground group-hover:text-primary mt-6 text-[12px] font-black tracking-[0.3em] uppercase">
              New Adventure
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
