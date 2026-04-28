import { TripNavData } from "../constants/navigationConfig";

interface HeroProps {
  trip: TripNavData;
}

export default function Hero({ trip }: HeroProps) {
  return (
    <div className="relative w-full overflow-hidden bg-background">
      {/* Background Gradient */}
      <div 
        className="absolute inset-0 opacity-10 dark:opacity-20 transition-opacity duration-1000"
        style={{ 
          background: `linear-gradient(135deg, ${trip.accentColor || 'var(--primary)'} 0%, transparent 100%)` 
        }}
      />
      
      <div className="relative mx-auto max-w-5xl px-6 pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6 backdrop-blur-sm">
            <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">
              Current Journey
            </span>
          </div>
          
          <h1 className="font-playfair text-5xl md:text-7xl font-black text-foreground tracking-tighter leading-none mb-6">
            {trip.title}
          </h1>
          
          <p className="max-w-xl text-lg md:text-xl text-muted-foreground font-medium leading-relaxed">
            {trip.description || "この旅の物語を綴りましょう。ふたりで歩む新しい足跡。"}
          </p>
          
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Location</span>
              <span className="text-sm font-bold text-foreground">{trip.location}</span>
            </div>
            <div className="w-px h-8 bg-border hidden sm:block" />
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Timeline</span>
              <span className="text-sm font-bold text-foreground">
                {new Date(trip.startDate).toLocaleDateString()} — {new Date(trip.endDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative Line */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent" 
      />
    </div>
  );
}
