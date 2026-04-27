'use client';
import { useEffect, useState } from 'react';
import { MagazineCard } from '@/components/ui/MagazineCard';
import { Sun, Cloud, CloudRain, CloudLightning, Droplets, Umbrella } from 'lucide-react';
import TripWeatherSummarySkeleton from './TripWeatherSummarySkeleton';

interface ForecastDay {
  date: string;
  temp: { max: number; min: number };
  condition: string;
  humidity: number;
  rainChance: number;
}

const getIcon = (condition: string) => {
  const c = condition.toLowerCase();
  if (c.includes("sunny") || c.includes("clear")) return <Sun className="text-amber-500" size={24} />;
  if (c.includes("rain") || c.includes("drizzle")) return <CloudRain className="text-sky-500" size={24} />;
  if (c.includes("thunder")) return <CloudLightning className="text-purple-500" size={24} />;
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      {forecast.map((day) => (
        <MagazineCard key={day.date} padding="sm" className="bg-stone-50/50 border-stone-100 flex flex-col items-center text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-rose-400 mb-4">
            {new Date(day.date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
          </p>
          
          <div className="mb-4">{getIcon(day.condition)}</div>
          
          <p className="text-2xl font-bold text-stone-900 tracking-tight mb-4">
            {day.temp.max}°<span className="text-stone-400 text-sm font-medium">/{day.temp.min}°</span>
          </p>

          <div className="w-full pt-4 border-t border-stone-100 flex justify-between items-center text-[10px] font-bold text-stone-400 uppercase tracking-widest">
            <span className="flex items-center gap-1"><Umbrella size={12} /> {day.rainChance}%</span>
            <span className="flex items-center gap-1"><Droplets size={12} /> {day.humidity}%</span>
          </div>
        </MagazineCard>
      ))}
    </div>
  );
}
