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

export default async function TripPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // 1. DBからトリップ情報を取得（ここが失敗すると404）
  const trip = await getTripBySlug(slug);
  if (!trip) return notFound();

  // 2. 天気情報を取得（失敗してもデフォルト値で続行）
  const weather = await getWeatherData(trip.location).catch(() => null);
  const themeStatus = weather?.themeStatus || 'sunny';

  // 3. 認証情報を取得（Vercelの環境変数不足などで失敗しても一般ユーザーとして続行）
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
        <div className="grid grid-cols-1 gap-12">
          {/* ─── Hero / Intro ─── */}
          <div className={cn(
            "relative overflow-hidden rounded-[3.5rem] border p-6 md:p-16 shadow-xl transition-colors duration-1000",
            themeStatus === 'sunny' && "bg-white border-rose-100 shadow-rose-100/20",
            themeStatus === 'rainy' && "bg-slate-50 border-blue-100 shadow-blue-100/20",
            themeStatus === 'cloudy' && "bg-stone-50 border-stone-200 shadow-stone-100/20",
            themeStatus === 'snowy' && "bg-blue-50/30 border-indigo-100 shadow-indigo-100/10"
          )}>
            <div className={cn(
              "absolute top-0 right-0 h-64 w-64 blur-3xl -translate-y-1/2 translate-x-1/2 transition-colors duration-1000",
              themeStatus === 'sunny' && "bg-rose-50/50",
              themeStatus === 'rainy' && "bg-blue-100/40",
              themeStatus === 'cloudy' && "bg-stone-200/50",
              themeStatus === 'snowy' && "bg-indigo-100/50"
            )} />
            
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
              <div className="max-w-xl">
                <div className="flex items-center gap-3 text-rose-400 text-[11px] font-black uppercase tracking-[0.4em] mb-6">
                  <div className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse" />
                  Upcoming Chapter
                </div>
                <h3 className="font-playfair text-4xl md:text-5xl font-bold text-stone-900 mb-6 leading-tight">
                  この旅が、<br />ふたりの新しい記憶になる。
                </h3>
                {trip.description && (
                  <p className="text-stone-500 font-medium leading-relaxed italic border-l-2 border-rose-100 pl-6 my-8">
                    &ldquo;{trip.description}&rdquo;
                  </p>
                )}
                <div className="flex flex-wrap gap-4 mt-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-50 text-[12px] font-bold text-stone-600 ring-1 ring-stone-100">
                    <MapPin size={14} className="text-rose-300" />
                    {trip.location}
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-50 text-[12px] font-bold text-stone-600 ring-1 ring-stone-100">
                    <Calendar size={14} className="text-rose-300" />
                    {dateRange}
                  </div>
                </div>
              </div>
              
              <div className="shrink-0 flex flex-col items-center p-6 md:p-8 rounded-[2.5rem] bg-rose-50/30 ring-1 ring-rose-100 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-rose-400 mb-4">
                  <Clock size={12} />
                  Time to Departure
                </div>
                <TripCountdown startDate={trip.startDate} />
              </div>
            </div>
            
            <div className="mt-16 pt-12 border-t border-rose-50">
              <TripWeatherSummary location={trip.location} />
            </div>
          </div>

          {/* ─── Itinerary ─── */}
          <div>
            <SectionHeader title="The Path We Take" subtitle="Daily moments and discoveries" className="mb-10" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {trip.days.map((day) => (
                <Link
                  key={day.id}
                  href={`/trip/${slug}/day/${day.dayNumber}`}
                  className="group relative block"
                >
                  <div className="h-full rounded-[3rem] border border-rose-100 bg-white p-6 md:p-10 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-rose-200/30 hover:-translate-y-2 hover:border-rose-300 active:scale-[0.98]">
                    <div className="flex justify-between items-start mb-12">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-rose-300 mb-1">Day {day.dayNumber}</span>
                        <div className="h-1 w-8 bg-rose-100 rounded-full" />
                      </div>
                      <div className="h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition-all shadow-sm">
                        <ChevronRight size={20} strokeWidth={3} />
                      </div>
                    </div>
                    
                    <h2 className="font-playfair text-3xl font-bold text-stone-900 mb-4 leading-tight group-hover:text-rose-600 transition-colors">
                      {day.title || `Chapter ${day.dayNumber}`}
                    </h2>
                    
                    {day.highlight && (
                      <p className="text-sm font-medium text-stone-400 mb-6 line-clamp-1 italic">
                        &ldquo;{day.highlight}&rdquo;
                      </p>
                    )}

                    <div className="pt-6 border-t border-stone-50 flex items-center justify-between text-[11px] font-black text-rose-300 uppercase tracking-widest">
                      <div className="flex items-center gap-2">
                        <Calendar size={12} />
                        <span>{formatDateWithWeekday(day.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1 w-1 rounded-full bg-rose-200" />
                        <span>{day.events.length} Moments</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </TripLayout>
  );
}
