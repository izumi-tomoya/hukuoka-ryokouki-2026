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
    return <Sun className="text-amber-500" size={32} />;
  if (c.includes("rain") || c.includes("drizzle") || c.includes("🌧️"))
    return <CloudRain className="text-sky-500" size={32} />;
  if (c.includes("thunder") || c.includes("⛈️")) return <CloudLightning className="text-purple-500" size={32} />;
  return <Cloud className="text-stone-400" size={32} />;
};

export function DayForecast({ location, date }: { location: string; date: string }) {
  const [forecast, setForecast] = useState<ForecastDay | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/weather?location=${encodeURIComponent(location)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error && Array.isArray(data)) {
          // Find the forecast for the specific date
          const targetDate = new Date(date).toISOString().split("T")[0];
          const dayForecast = data.find((d: ForecastDay) => d.date.startsWith(targetDate));
          setForecast(dayForecast || data[0]); // Fallback to first day if not found
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [location, date]);

  if (loading) return <div className="h-48 w-full animate-pulse rounded-article bg-secondary/50" />;
  if (!forecast) return null;

  return (
    <MagazineCard padding="lg" className="border-border/50 bg-secondary/5 dark:bg-card/50 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Umbrella size={120} className="text-primary" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <div className="flex flex-col items-center text-center px-6">
          <div className="mb-4 p-4 rounded-3xl bg-background shadow-inner">{getIcon(forecast.condition)}</div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">Forecast</p>
          <p className="text-sm font-bold text-muted-foreground">{forecast.condition}</p>
        </div>

        <div className="h-px w-full md:h-24 md:w-px bg-border" />

        <div className="grow grid grid-cols-2 md:grid-cols-4 gap-8 w-full">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-2">Temperature</p>
            <p className="text-3xl font-black text-foreground tracking-tight">
              {forecast.temp.max}°
              <span className="text-lg font-medium text-muted-foreground">/{forecast.temp.min}°</span>
            </p>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-sky-500 mb-2">Rain Chance</p>
            <p className="text-3xl font-black text-foreground tracking-tight flex items-center gap-2">
              <Umbrella size={24} className="text-sky-400" />
              {forecast.rainChance}%
            </p>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-2">UV Index</p>
            <p className="text-3xl font-black text-foreground tracking-tight flex items-center gap-2">
              <Sun size={24} className="text-amber-400" />
              {forecast.uvIndex}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-2">Wind Speed</p>
            <p className="text-3xl font-black text-foreground tracking-tight flex items-center gap-2">
              <Wind size={24} className="text-stone-400" />
              {forecast.windSpeed}m/s
            </p>
          </div>
        </div>
      </div>
    </MagazineCard>
  );
}
