"use client";
import { Cloud, CloudLightning, CloudRain, Sun, Umbrella, Wind } from "lucide-react";
import { useEffect, useState } from "react";
import { MagazineCard } from "@/components/ui/MagazineCard";
import TripWeatherSummarySkeleton from "./TripWeatherSummarySkeleton";

interface ForecastDay {
  date: string;
  temp: { max: number; min: number };
  condition: string;
  humidity: number;
  rainChance: number;
  windSpeed?: number;
  uvIndex?: number;
  sunrise?: string;
  sunset?: string;
}

const getIcon = (condition: string) => {
  const c = condition.toLowerCase();
  if (c.includes("sunny") || c.includes("clear") || c.includes("☀️"))
    return <Sun className="text-amber-500" size={24} />;
  if (c.includes("rain") || c.includes("drizzle") || c.includes("🌧️"))
    return <CloudRain className="text-sky-500" size={24} />;
  if (c.includes("thunder") || c.includes("⛈️")) return <CloudLightning className="text-purple-500" size={24} />;
  return <Cloud className="text-stone-400" size={24} />;
};

export default function TripWeatherSummary({ location, endDate }: { location: string; endDate?: string }) {
  const [forecast, setForecast] = useState<ForecastDay[] | null>(null);

  useEffect(() => {
    const url = new URL("/api/weather", window.location.origin);
    url.searchParams.set("location", location);
    if (endDate) url.searchParams.set("endDate", endDate);

    fetch(url.toString())
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setForecast(data);
      })
      .catch(() => {});
  }, [location, endDate]);

  if (!forecast) return <TripWeatherSummarySkeleton />;

  return (
    <div className="relative mt-8">
      {/* Mobile: Horizontal Scroll, Desktop: Grid */}
      <div className="no-scrollbar flex gap-4 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        {forecast.map((day) => (
          <MagazineCard
            key={day.date}
            padding="sm"
            className="border-border/50 bg-secondary/15 dark:border-border dark:bg-background flex min-w-37.5 flex-col items-center text-center transition-colors sm:min-w-0"
          >
            <p className="mb-4 text-[10px] font-black tracking-widest text-rose-400 uppercase dark:text-rose-500">
              {new Date(day.date).toLocaleDateString("ja-JP", { month: "short", day: "numeric", weekday: "short" })}
            </p>

            <div className="mb-4">{getIcon(day.condition)}</div>

            <p className="dark:text-foreground mb-1 text-2xl font-bold tracking-tight text-stone-900">
              {day.temp.max}°
              <span className="dark:text-muted-foreground text-sm font-medium text-stone-400">/{day.temp.min}°</span>
            </p>
            <p className="text-muted-foreground mb-4 text-[10px] font-bold">{day.condition}</p>

            <div className="border-border/50 dark:border-border w-full space-y-2 border-t pt-4">
              <div className="dark:text-muted-foreground flex items-center justify-between text-[10px] font-bold tracking-widest text-stone-400 uppercase">
                <span className="flex items-center gap-1">
                  <Umbrella size={12} className="text-sky-500" /> {day.rainChance}%
                </span>
                <span className="flex items-center gap-1">
                  <Sun size={12} className="text-amber-500" /> {day.uvIndex}
                </span>
              </div>
              <div className="dark:text-muted-foreground flex items-center justify-between text-[10px] font-bold tracking-widest text-stone-400 uppercase">
                <span className="flex items-center gap-1">
                  <Wind size={12} className="text-stone-400" /> {day.windSpeed}m/s
                </span>
                <span className="text-[9px]">{day.sunrise}</span>
              </div>
            </div>
          </MagazineCard>
        ))}
      </div>
      <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-12 bg-linear-to-l to-transparent sm:hidden" />
    </div>
  );
}
