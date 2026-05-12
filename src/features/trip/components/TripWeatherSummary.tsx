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

export default function TripWeatherSummary({ location }: { location: string }) {
  const [forecast, setForecast] = useState<ForecastDay[] | null>(null);

  useEffect(() => {
    fetch(`/api/weather?location=${encodeURIComponent(location)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setForecast(data);
      })
      .catch(() => {});
  }, [location]);

  if (!forecast) return <TripWeatherSummarySkeleton />;

  return (
    <div className="relative mt-8">
      {/* Mobile: Horizontal Scroll, Desktop: Grid */}
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        {forecast.map((day) => (
          <MagazineCard
            key={day.date}
            padding="sm"
            className="flex min-w-37.5 flex-col items-center border-border/50 bg-secondary/15 text-center transition-colors dark:border-border dark:bg-background sm:min-w-0"
          >
            <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-rose-400 dark:text-rose-500">
              {new Date(day.date).toLocaleDateString("ja-JP", { month: "short", day: "numeric", weekday: "short" })}
            </p>

            <div className="mb-4">{getIcon(day.condition)}</div>

            <p className="mb-1 tracking-tight text-2xl font-bold text-stone-900 dark:text-foreground">
              {day.temp.max}°
              <span className="text-sm font-medium text-stone-400 dark:text-muted-foreground">/{day.temp.min}°</span>
            </p>
            <p className="mb-4 text-[10px] font-bold text-muted-foreground">{day.condition}</p>

            <div className="w-full space-y-2 border-t border-border/50 pt-4 dark:border-border">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-stone-400 dark:text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Umbrella size={12} className="text-sky-500" /> {day.rainChance}%
                </span>
                <span className="flex items-center gap-1">
                  <Sun size={12} className="text-amber-500" /> {day.uvIndex}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-stone-400 dark:text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Wind size={12} className="text-stone-400" /> {day.windSpeed}m/s
                </span>
                <span className="text-[9px]">{day.sunrise}</span>
              </div>
            </div>
          </MagazineCard>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-linear-to-l from-background to-transparent sm:hidden" />
    </div>
  );
}
