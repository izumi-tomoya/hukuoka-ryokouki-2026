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

export function DayForecast({ location, date, endDate }: { location: string; date: string; endDate?: string }) {
  const [forecast, setForecast] = useState<ForecastDay | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const url = new URL("/api/weather", window.location.origin);
    url.searchParams.set("location", location);
    if (endDate) url.searchParams.set("endDate", endDate);

    fetch(url.toString())
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
  }, [location, date, endDate]);

  if (loading) return <div className="rounded-article bg-secondary/50 h-48 w-full animate-pulse" />;
  if (!forecast) return null;

  return (
    <MagazineCard padding="lg" className="border-border/50 bg-secondary/5 dark:bg-card/50 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Umbrella size={120} className="text-primary" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 md:flex-row md:gap-12">
        <div className="flex flex-col items-center px-6 text-center">
          <div className="bg-background mb-4 rounded-3xl p-4 shadow-inner">{getIcon(forecast.condition)}</div>
          <p className="text-primary mb-1 text-[10px] font-black tracking-[0.2em] uppercase">Forecast</p>
          <p className="text-muted-foreground text-sm font-bold">{forecast.condition}</p>
        </div>

        <div className="bg-border h-px w-full md:h-24 md:w-px" />

        <div className="grid w-full grow grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <p className="mb-2 text-[10px] font-black tracking-widest text-rose-500 uppercase">Temperature</p>
            <p className="text-foreground text-3xl font-black tracking-tight">
              {forecast.temp.max}°
              <span className="text-muted-foreground text-lg font-medium">/{forecast.temp.min}°</span>
            </p>
          </div>

          <div>
            <p className="mb-2 text-[10px] font-black tracking-widest text-sky-500 uppercase">Rain Chance</p>
            <p className="text-foreground flex items-center gap-2 text-3xl font-black tracking-tight">
              <Umbrella size={24} className="text-sky-400" />
              {forecast.rainChance}%
            </p>
          </div>

          <div>
            <p className="mb-2 text-[10px] font-black tracking-widest text-amber-500 uppercase">UV Index</p>
            <p className="text-foreground flex items-center gap-2 text-3xl font-black tracking-tight">
              <Sun size={24} className="text-amber-400" />
              {forecast.uvIndex}
            </p>
          </div>

          <div>
            <p className="mb-2 text-[10px] font-black tracking-widest text-stone-500 uppercase">Wind Speed</p>
            <p className="text-foreground flex items-center gap-2 text-3xl font-black tracking-tight">
              <Wind size={24} className="text-stone-400" />
              {forecast.windSpeed}m/s
            </p>
          </div>
        </div>
      </div>
    </MagazineCard>
  );
}
