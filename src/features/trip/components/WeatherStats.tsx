import { Sun, Droplets, Thermometer } from 'lucide-react';
import { type WeatherStats } from '@/features/trip/types/trip';

export default function WeatherStatsDisplay({ stats }: { stats: WeatherStats }) {
  return (
    <div className="mt-5 rounded-[2rem] bg-linear-to-br from-rose-50 to-pink-50 p-6 shadow-inner ring-1 ring-rose-100">
      <div className="mb-4 flex items-center gap-3 text-xs font-bold text-rose-400 uppercase tracking-[0.2em]">
        <div className="h-1 w-8 bg-rose-300 rounded-full" />
        Comfort Guide
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Thermometer, val: `${stats.temp}°C`, label: 'Temp' },
          { icon: Sun, val: `UV ${stats.uvIndex}`, label: 'UV' },
          { icon: Droplets, val: `${stats.humidity}%`, label: 'Humid' },
        ].map((item, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center rounded-[1.5rem] bg-white/80 p-4 border border-white shadow-sm"
          >
            <item.icon size={18} className="mb-2 text-rose-300" />
            <span className="text-base font-bold text-rose-900">{item.val}</span>
            <span className="text-[9px] font-black text-rose-300 uppercase tracking-widest">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
