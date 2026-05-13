import { Calendar, Camera, ChevronRight, Clock, Hotel, MapPin, Plane, Utensils } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { MagazineCard } from "@/components/ui/MagazineCard";
import { BentoTile } from "@/components/ui/BentoTile";
import { getTripBySlug } from "@/features/trip/api/tripActions";
import { TripCountdown } from "@/features/trip/components/client/TripCountdown";
import { TripManagementActions } from "@/features/trip/components/client/TripManagementActions";
import TripLayout from "@/features/trip/components/TripLayout";
import TripWeatherSummary from "@/features/trip/components/TripWeatherSummary";
import type { Tip, TripEvent } from "@/features/trip/types/trip";
import { formatDateRange, formatDateWithWeekday } from "@/features/trip/utils/dateUtils";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { getWeatherData } from "@/lib/weather";

export default async function TripPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const trip = await getTripBySlug(slug);
  if (!trip) return notFound();

  const weather = await getWeatherData(trip.location).catch(() => null);
  const themeStatus = weather?.themeStatus || "sunny";

  const session = await auth();
  const isAdmin = !!session?.user?.isAdmin;

  const dateRange = formatDateRange(trip.startDate, trip.endDate);

  const allTripEvents =
    trip.days?.flatMap(
      (day) =>
        day.events?.map((event) => ({
          id: event.id,
          time: event.time,
          title: event.title,
          foodName: event.foodName,
        })) ?? [],
    ) ?? [];

  return (
    <TripLayout
      slug={slug}
      tripId={trip.id}
      activePath={`/trip/${slug}`}
      isSecretMode={isAdmin}
      title={trip.title}
      subtitle={`${trip.location} / ${dateRange}`}
      days={trip.days}
      events={allTripEvents as TripEvent[]}
      tips={trip.tips as Tip[]}
    >
      <Container className="pb-24">
        <div className="grid grid-cols-1 gap-10 md:gap-16">
          {/* ─── Hero / Overview Card ─── */}
          <MagazineCard
            padding="lg"
            className="border-border shadow-primary/5 relative overflow-hidden shadow-xl dark:shadow-none"
          >
            <div
              className={cn(
                "absolute top-0 right-0 h-96 w-96 translate-x-1/2 -translate-y-1/2 opacity-30 blur-[100px] transition-colors duration-1000",
                themeStatus === "sunny" && "bg-rose-500",
                themeStatus === "rainy" && "bg-blue-500",
                themeStatus === "cloudy" && "bg-stone-500",
                themeStatus === "snowy" && "bg-indigo-500",
              )}
            />

            <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-center lg:gap-12">
              <div className="max-w-xl min-w-0">
                <div className="text-primary mb-6 flex items-center gap-3 text-[10px] font-black tracking-[0.18em] uppercase sm:tracking-[0.4em] md:mb-8">
                  <div className="bg-primary h-1.5 w-1.5 animate-pulse rounded-full" />
                  <span className="truncate">Upcoming Chapter</span>
                </div>
                <h3 className="font-playfair text-foreground mb-6 text-3xl leading-tight font-black tracking-tight break-words sm:text-4xl md:mb-8 md:text-6xl">
                  この旅が、
                  <br />
                  ふたりの新しい記憶になる。
                </h3>
                {trip.description && (
                  <p className="text-muted-foreground border-primary/20 my-10 max-w-lg border-l-2 pl-6 leading-relaxed font-medium italic">
                    &ldquo;{trip.description}&rdquo;
                  </p>
                )}

                {isAdmin && (
                  <div className="animate-in fade-in slide-in-from-left-4 mt-8 mb-4 duration-700">
                    <TripManagementActions tripId={trip.id} slug={slug} />
                  </div>
                )}

                <div className="mt-10 flex flex-wrap gap-4">
                  <div className="bg-secondary text-foreground border-border inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[11px] font-bold">
                    <MapPin size={14} className="text-primary" />
                    {trip.location}
                  </div>
                  <div className="bg-secondary text-foreground border-border inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[11px] font-bold">
                    <Calendar size={14} className="text-primary" />
                    {dateRange}
                  </div>
                </div>
              </div>

              <div className="md:rounded-article bg-primary/5 border-primary/10 flex w-full shrink-0 flex-col items-center rounded-[1.5rem] border p-6 shadow-inner backdrop-blur-md md:p-10 lg:w-auto">
                <div className="text-primary mb-6 flex items-center gap-2 text-[10px] font-black tracking-[0.18em] uppercase sm:tracking-[0.3em]">
                  <Clock size={12} />
                  Departure In
                </div>
                <TripCountdown startDate={trip.startDate} />
              </div>
            </div>

            <div className="border-border mt-10 border-t pt-8 md:mt-16 md:pt-12">
              <div className="mb-8 flex items-center gap-3">
                <div className="bg-primary h-2 w-2 rounded-full" />
                <span className="text-muted-foreground text-[10px] font-black tracking-widest uppercase">
                  Local Forecast
                </span>
              </div>
              <TripWeatherSummary location={trip.location} endDate={trip.endDate} />
            </div>
          </MagazineCard>

          {/* ─── Collections ─── */}
          <div className="space-y-10">
            <div className="flex items-center gap-4">
              <div className="bg-border h-px grow" />
              <h2 className="font-playfair text-foreground px-2 text-center text-2xl font-black sm:px-4 md:text-3xl">
                Explore Collections
              </h2>
              <div className="bg-border h-px grow" />
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              <BentoTile
                href={`/trip/${slug}/category/food`}
                title="Gourmet"
                subtitle="美味しい思い出"
                icon={Utensils}
                color="rose"
                className="col-span-1"
              />
              <BentoTile
                href={`/trip/${slug}/category/sightseeing`}
                title="Sightseeing"
                subtitle="絶景と体験"
                icon={Camera}
                color="sky"
                className="col-span-1"
              />
              <BentoTile
                href={`/trip/${slug}/category/transport`}
                title="Transport"
                subtitle="移動の記録"
                icon={Plane}
                color="zinc"
                className="col-span-1"
              />
              <BentoTile
                href={`/trip/${slug}/category/hotel`}
                title="Stay"
                subtitle="安らぎの場所"
                icon={Hotel}
                color="emerald"
                className="col-span-1"
              />
            </div>
          </div>

          {/* ─── Itinerary ─── */}
          <div className="space-y-12">
            <div className="flex items-center gap-4">
              <div className="bg-border h-px grow" />
              <h2 className="font-playfair text-foreground px-2 text-center text-2xl font-black sm:px-4 md:text-3xl">
                The Path We Take
              </h2>
              <div className="bg-border h-px grow" />
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {trip.days.map((day) => (
                <Link key={day.id} href={`/trip/${slug}/day/${day.dayNumber}`} className="group block h-full">
                  <MagazineCard className="border-border hover:shadow-primary/5 hover:border-primary/30 h-full transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl active:scale-[0.98]">
                    <div className="mb-12 flex items-start justify-between">
                      <div className="flex flex-col">
                        <span className="text-primary mb-1 text-[10px] font-black tracking-[0.5em] uppercase">
                          Day {day.dayNumber}
                        </span>
                        <div className="bg-primary/20 h-1 w-8 rounded-full" />
                      </div>
                      <div className="bg-secondary text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm transition-all">
                        <ChevronRight size={20} strokeWidth={3} />
                      </div>
                    </div>

                    <h2 className="font-playfair text-foreground group-hover:text-primary mb-4 text-3xl leading-tight font-bold transition-colors">
                      {day.title || `Chapter ${day.dayNumber}`}
                    </h2>

                    {day.highlight && (
                      <p className="text-muted-foreground mb-8 line-clamp-1 text-sm font-medium italic">
                        &ldquo;{day.highlight}&rdquo;
                      </p>
                    )}

                    <div className="border-border text-muted-foreground group-hover:text-primary flex items-center justify-between border-t pt-6 text-[11px] font-black tracking-widest uppercase transition-colors">
                      <div className="flex items-center gap-2">
                        <Calendar size={12} />
                        <span>{formatDateWithWeekday(day.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/40 h-1 w-1 rounded-full" />
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
