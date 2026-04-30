import { notFound } from "next/navigation";
import Link from "next/link";
import { getTripBySlug } from "@/features/trip/api/tripActions";
import { ChevronRight, Clock, MapPin, Calendar } from "lucide-react";
import TripLayout from "@/features/trip/components/TripLayout";
import { TripCountdown } from "@/features/trip/components/client/TripCountdown";
import { auth } from "@/lib/auth";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import TripWeatherSummary from "@/features/trip/components/TripWeatherSummary";
import { getWeatherData } from "@/lib/weather";
import { cn } from "@/lib/utils";
import { formatDateRange, formatDateWithWeekday } from "@/features/trip/utils/dateUtils";
import { MagazineCard } from "@/components/ui/MagazineCard";

export default async function TripPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const trip = await getTripBySlug(slug);
  if (!trip) return notFound();

  const weather = await getWeatherData(trip.location).catch(() => null);
  const themeStatus = weather?.themeStatus || 'sunny';

  let isAdmin = false;
  try {
    const session = await auth();
    isAdmin = !!session?.user?.isAdmin;
  } catch (e) {
    console.error("Auth failed on runtime:", e);
  }

  const dateRange = formatDateRange(trip.startDate, trip.endDate);

  return (
    <TripLayout 
      slug={slug} 
      activePath={`/trip/${slug}`} 
      isSecretMode={isAdmin} 
      title={trip.title}
      subtitle={`${trip.location} / ${dateRange}`}
      days={trip.days}
    >
      <Container className="pb-24">
        <div className="grid grid-cols-1 gap-16">
          {/* ─── Hero / Overview Card ─── */}
          <MagazineCard padding="lg" className="relative overflow-hidden border-border shadow-xl shadow-primary/5 dark:shadow-none">
            <div className={cn(
              "absolute top-0 right-0 h-96 w-96 blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-30 transition-colors duration-1000",
              themeStatus === 'sunny' && "bg-rose-500",
              themeStatus === 'rainy' && "bg-blue-500",
              themeStatus === 'cloudy' && "bg-stone-500",
              themeStatus === 'snowy' && "bg-indigo-500"
            )} />
            
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
              <div className="max-w-xl">
                <div className="flex items-center gap-3 text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-8">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  Upcoming Chapter
                </div>
                <h3 className="font-playfair text-4xl md:text-6xl font-black text-foreground mb-8 leading-tight tracking-tighter">
                  この旅が、<br />ふたりの新しい記憶になる。
                </h3>
                {trip.description && (
                  <p className="text-muted-foreground font-medium leading-relaxed italic border-l-2 border-primary/20 pl-6 my-10 max-w-lg">
                    &ldquo;{trip.description}&rdquo;
                  </p>
                )}
                <div className="flex flex-wrap gap-4 mt-10">
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary text-[11px] font-bold text-foreground border border-border">
                    <MapPin size={14} className="text-primary" />
                    {trip.location}
                  </div>
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary text-[11px] font-bold text-foreground border border-border">
                    <Calendar size={14} className="text-primary" />
                    {dateRange}
                  </div>
                </div>
              </div>
              
              <div className="shrink-0 flex flex-col items-center p-8 md:p-10 rounded-article bg-primary/5 border border-primary/10 backdrop-blur-md shadow-inner">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6">
                  <Clock size={12} />
                  Departure In
                </div>
                <TripCountdown startDate={trip.startDate} />
              </div>
            </div>
            
            <div className="mt-16 pt-12 border-t border-border">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Local Forecast</span>
              </div>
              <TripWeatherSummary location={trip.location} />
            </div>
          </MagazineCard>

          {/* ─── Itinerary ─── */}
          <div className="space-y-12">
            <div className="flex items-center gap-4">
              <div className="h-px grow bg-border" />
              <h2 className="font-playfair text-2xl md:text-3xl font-black text-foreground text-center px-4">
                The Path We Take
              </h2>
              <div className="h-px grow bg-border" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trip.days.map((day) => (
                <Link
                  key={day.id}
                  href={`/trip/${slug}/day/${day.dayNumber}`}
                  className="group block h-full"
                >
                  <MagazineCard className="h-full border-border transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 hover:border-primary/30 active:scale-[0.98]">
                    <div className="flex justify-between items-start mb-12">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary mb-1">Day {day.dayNumber}</span>
                        <div className="h-1 w-8 bg-primary/20 rounded-full" />
                      </div>
                      <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all shadow-sm">
                        <ChevronRight size={20} strokeWidth={3} />
                      </div>
                    </div>
                    
                    <h2 className="font-playfair text-3xl font-bold text-foreground mb-4 leading-tight group-hover:text-primary transition-colors">
                      {day.title || `Chapter ${day.dayNumber}`}
                    </h2>
                    
                    {day.highlight && (
                      <p className="text-sm font-medium text-muted-foreground mb-8 line-clamp-1 italic">
                        &ldquo;{day.highlight}&rdquo;
                      </p>
                    )}

                    <div className="pt-6 border-t border-border flex items-center justify-between text-[11px] font-black text-muted-foreground uppercase tracking-widest group-hover:text-primary transition-colors">
                      <div className="flex items-center gap-2">
                        <Calendar size={12} />
                        <span>{formatDateWithWeekday(day.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1 w-1 rounded-full bg-primary/40" />
                        <span>{day.events?.length ?? 0} Moments</span>
                      </div>
                    </div>
                  </MagazineCard>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </TripLayout>
  );
}
