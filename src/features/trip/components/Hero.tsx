import type { TripNavData } from "../constants/navigationConfig";

interface HeroProps {
  trip: TripNavData;
}

export default function Hero({ trip }: HeroProps) {
  return (
    <div className="bg-background relative w-full overflow-hidden">
      {/* Background Gradient */}
      <div
        className="absolute inset-0 opacity-10 transition-opacity duration-1000 dark:opacity-20"
        style={{
          background: `linear-gradient(135deg, ${trip.accentColor || "var(--primary)"} 0%, transparent 100%)`,
        }}
      />

      <div className="relative mx-auto max-w-5xl px-6 pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <div className="bg-primary/10 border-primary/20 mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 backdrop-blur-sm">
            <span className="text-primary text-[10px] font-black tracking-[0.2em] uppercase">Current Journey</span>
          </div>

          <h1 className="font-playfair text-foreground mb-6 text-5xl leading-none font-black tracking-tighter md:text-7xl">
            {trip.title || "Untitled Trip"}
          </h1>

          <p className="text-muted-foreground max-w-xl text-lg leading-relaxed font-medium md:text-xl">
            {trip.description || "この旅の物語を綴りましょう。ふたりで歩む新しい足跡。"}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <div className="flex flex-col">
              <span className="text-muted-foreground mb-1 text-[9px] font-black tracking-widest uppercase">
                Location
              </span>
              <span className="text-foreground text-sm font-bold">{trip.location || "Unknown"}</span>
            </div>
            <div className="bg-border hidden h-8 w-px sm:block" />
            <div className="flex flex-col">
              <span className="text-muted-foreground mb-1 text-[9px] font-black tracking-widest uppercase">
                Timeline
              </span>
              <span className="text-foreground text-sm font-bold">
                {trip.startDate ? new Date(trip.startDate).toLocaleDateString() : "TBD"} —{" "}
                {trip.endDate ? new Date(trip.endDate).toLocaleDateString() : "TBD"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Line */}
      <div className="via-border absolute right-0 bottom-0 left-0 h-px bg-linear-to-r from-transparent to-transparent" />
    </div>
  );
}
