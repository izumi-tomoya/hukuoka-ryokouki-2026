import { Droplets, Sun, Thermometer } from "lucide-react";
import type { WeatherStats } from "@/features/trip/types/trip";

export default function WeatherStatsDisplay({ stats }: { stats: WeatherStats }) {
  return (
    <div className="mt-5 rounded-[2rem] bg-linear-to-br from-rose-50 to-pink-50 p-6 shadow-inner ring-1 ring-rose-100">
      <div className="mb-4 flex items-center gap-3 text-xs font-bold tracking-[0.2em] text-rose-400 uppercase">
        <div className="h-1 w-8 rounded-full bg-rose-300" />
        Comfort Guide
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Thermometer, val: `${stats.temp}°C`, label: "Temp" },
          { icon: Sun, val: `UV ${stats.uvIndex}`, label: "UV" },
          { icon: Droplets, val: `${stats.humidity}%`, label: "Humid" },
        ].map((item, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center rounded-3xl border border-white bg-white/80 p-4 shadow-sm"
          >
            <item.icon size={18} className="mb-2 text-rose-300" />
            <span className="text-base font-bold text-rose-900">{item.val}</span>
            <span className="text-[9px] font-black tracking-widest text-rose-300 uppercase">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
