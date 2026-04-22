import Hero from "@/components/trip/Hero";
import Link from "next/link";
import { cookies } from "next/headers";
import { SECRET_MODE_COOKIE_NAME, TRIP_STATS } from "@/config/constants";
import { 
  ChevronRight, 
  Calendar, 
  Cloud, 
  Thermometer, 
  Sparkles, 
  LucideIcon 
} from "lucide-react";

// --- Constants ---

const TRIP_START_DATE = "2026-05-24T09:00:00+09:00";

// --- Types ---

interface WeatherData {
  temp: string | number;
  status: string;
}

// --- Data Fetching & Logic ---

async function getFukuokaWeather(): Promise<WeatherData> {
  try {
    const res = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=33.5904&longitude=130.4017&current=temperature_2m,weather_code&timezone=Asia%2FTokyo",
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    const temp = Math.round(data.current.temperature_2m);
    const code = data.current.weather_code;

    const weatherMap: Record<number, string> = {
      0: "快晴",
      1: "晴れ", 2: "晴れ", 3: "時々曇り",
      45: "霧", 48: "霧",
      51: "小雨", 53: "雨", 55: "雨",
      61: "雨", 63: "強い雨", 65: "激しい雨",
      80: "にわか雨", 81: "強いにわか雨", 82: "激しいにわか雨",
      95: "雷雨",
    };

    return { temp, status: weatherMap[code] || "晴れ" };
  } catch {
    return { temp: "--", status: "取得エラー" };
  }
}

function getCountdown(targetDateStr: string) {
  const targetDate = new Date(targetDateStr);
  const now = new Date();
  const diffTime = targetDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return {
    days: diffDays,
    text: diffDays > 0 ? `あと ${diffDays} 日` : "ついに当日！"
  };
}

// --- UI Components ---

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div className="h-px flex-1 bg-linear-to-r from-stone-200 to-transparent" />
      <span className="text-[9px] font-black tracking-[5px] text-stone-400 uppercase">{title}</span>
      <div className="h-px flex-1 bg-linear-to-l from-stone-200 to-transparent" />
    </div>
  );
}

function Day1Card() {
  return (
    <Link
      href="/day/1"
      className="group relative block overflow-hidden rounded-[28px] transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-200/60"
    >
      <div className="absolute inset-0 bg-linear-to-br from-[#FFF8F2] via-[#FFF3E8] to-[#FDECD5]" />
      <div className="absolute inset-0 bg-linear-to-t from-orange-100/30 via-transparent to-transparent" />
      <div className="absolute right-0 top-0 h-full w-1/2 bg-linear-to-l from-orange-100/20 to-transparent" />

      <div
        className="absolute -bottom-4 right-3 pointer-events-none select-none text-orange-200/50 font-playfair font-black"
        style={{ fontSize: "120px", lineHeight: 1 }}
      >
        01
      </div>

      <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r-full bg-linear-to-b from-orange-400 to-amber-500" />
      <div className="absolute inset-0 rounded-[28px] ring-1 ring-orange-200/70" />

      <div className="relative p-6 pl-7">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[9px] font-black tracking-[5px] text-orange-500 uppercase mb-2">Day 01</p>
            <h3 className="font-playfair text-[22px] font-bold text-stone-900 leading-[1.15] tracking-tight">
              太宰府 &<br />屋台の夜
            </h3>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/35 transition-all group-hover:scale-110">
            <ChevronRight size={18} strokeWidth={2.5} />
          </div>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <span className="text-[10px] font-bold text-stone-400">2026.05.24 (SUN)</span>
          <div className="h-0.75 w-0.75 rounded-full bg-stone-300" />
          <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-[9px] font-bold text-orange-600">
            15 Events
          </span>
        </div>

        <div className="flex gap-1">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="h-1.5 flex-1 rounded-full bg-orange-200/70 transition-all group-hover:bg-orange-300" />
          ))}
        </div>
      </div>
    </Link>
  );
}

function Day2Card() {
  const stars = [
    { top: "20%", right: "20%", size: 2 },
    { top: "40%", right: "35%", size: 1.5 },
    { top: "15%", right: "50%", size: 1 },
    { top: "55%", right: "25%", size: 2.5 },
    { top: "30%", right: "60%", size: 1.5 },
  ];

  return (
    <Link
      href="/day/2"
      className="group relative block overflow-hidden rounded-[28px] transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-stone-900/30"
    >
      <div className="absolute inset-0 bg-[#1A1410]" />
      <div className="absolute inset-0 bg-linear-to-br from-[#2D1B10]/80 via-[#1A1410] to-[#0F1520]" />
      <div className="absolute -top-10 left-1/3 h-48 w-48 rounded-full bg-rose-600/15 blur-[60px]" />
      <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-amber-600/10 blur-[50px]" />

      <div
        className="absolute -bottom-4 right-3 pointer-events-none select-none text-white/4 font-playfair font-black"
        style={{ fontSize: "120px", lineHeight: 1 }}
      >
        02
      </div>

      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white opacity-30"
          style={{
            top: star.top,
            right: star.right,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animation: `star-twinkle ${2 + i * 0.7}s ease-in-out infinite`,
            animationDelay: `${i * 400}ms`,
          }}
        />
      ))}

      <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r-full bg-linear-to-b from-rose-400 to-pink-600" />
      <div className="absolute inset-0 rounded-[28px] ring-1 ring-white/[0.07]" />

      <div className="relative p-6 pl-7">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[9px] font-black tracking-[5px] text-rose-400/80 uppercase mb-2">Day 02</p>
            <h3 className="font-playfair text-[22px] font-bold text-white leading-[1.15] tracking-tight">
              水炊き &<br />
              <span className="italic text-rose-300">サプライズ</span>
            </h3>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-lg shadow-rose-600/30 transition-all group-hover:scale-110">
            <ChevronRight size={18} strokeWidth={2.5} />
          </div>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <span className="text-[10px] font-bold text-white/30">2026.05.25 (MON)</span>
          <div className="h-0.75 w-0.75 rounded-full bg-white/20" />
          <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[9px] font-bold text-rose-300">
            14 Events
          </span>
        </div>

        <div className="flex gap-1">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="h-1.5 flex-1 rounded-full bg-white/10 transition-all group-hover:bg-rose-500/40" />
          ))}
        </div>
      </div>
    </Link>
  );
}

function SecretGuideCard() {
  return (
    <Link
      href="/tips"
      className="group relative flex items-center gap-5 overflow-hidden rounded-[28px] bg-stone-950 p-7 shadow-2xl transition-all hover:-translate-y-1"
    >
      <div className="absolute inset-0 bg-linear-to-br from-amber-600/15 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="absolute inset-0 rounded-[28px] ring-white/6" />

      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/10 text-3xl backdrop-blur-sm">
        🧭
      </div>
      <div className="relative">
        <p className="text-[8px] font-black tracking-[5px] text-amber-400/70 uppercase mb-1">Secret Guide</p>
        <h3 className="text-[17px] font-bold text-white tracking-tight">Escort Tips</h3>
      </div>
      <div className="relative ml-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-white/6 transition-all group-hover:bg-amber-400/10">
        <ChevronRight size={18} className="text-white/50 group-hover:text-amber-400 transition-colors" />
      </div>
    </Link>
  );
}

interface StatCardProps {
  icon: LucideIcon;
  iconColor: string;
  label: string;
  value: string | number;
  subValue?: string;
  className?: string;
}

function StatCard({ icon: Icon, iconColor, label, value, subValue, className }: StatCardProps) {
  return (
    <div className={`rounded-[24px] bg-white/3 p-5 ring-1 ring-white/10 backdrop-blur-md ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon size={11} className={iconColor} />
        <p className="text-[9px] font-black uppercase tracking-widest text-white/40">{label}</p>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-[20px] font-bold text-white tracking-tight leading-none">{value}</p>
        {subValue && <p className="text-[10px] font-bold text-white/60 ml-1">{subValue}</p>}
      </div>
    </div>
  );
}

// --- Main Page Component ---

export default async function Dashboard() {
  const cookieStore = await cookies();
  const isSecretMode = cookieStore.get(SECRET_MODE_COOKIE_NAME)?.value === "true";
  
  const weather = await getFukuokaWeather();
  const countdown = getCountdown(TRIP_START_DATE);

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-stone-900">
      <Hero />

      <main className="px-5 pt-8 pb-6">
        <SectionHeader title="Itinerary" />

        <div className="space-y-4">
          <Day1Card />
          <Day2Card />
          {isSecretMode && <SecretGuideCard />}
        </div>
      </main>

      {/* Trip Stats Section */}
      <section className="px-5 pb-24">
        <div className="relative overflow-hidden rounded-[32px] bg-[#050B17] p-7 shadow-2xl">
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-blue-600/10 blur-[60px]" />
          <div className="absolute -left-12 -bottom-12 h-48 w-48 rounded-full bg-indigo-600/10 blur-[60px]" />
          <div className="absolute inset-0 ring-1 ring-white/10 rounded-[32px]" />

          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-400/10 ring-1 ring-amber-400/20">
                  <Sparkles size={14} className="text-amber-400" />
                </div>
                <span className="text-[10px] font-black tracking-[4px] text-white/90 uppercase">
                  Trip Stats
                </span>
              </div>
              <span className="flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3.5 py-1.5 text-[9px] font-black text-blue-300 ring-1 ring-blue-400/30">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
                LIVE UPDATES
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <StatCard 
                icon={Calendar} 
                iconColor="text-amber-400/70" 
                label="Countdown" 
                value={countdown.text} 
              />
              <StatCard 
                icon={Cloud} 
                iconColor="text-blue-400/70" 
                label="Fukuoka" 
                value={`${weather.temp}°C`} 
                subValue={weather.status}
              />
              
              <div className="col-span-2 rounded-[24px] bg-white/3 p-5 ring-1 ring-white/10 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Thermometer size={11} className="text-rose-400/70" />
                      <p className="text-[9px] font-black uppercase tracking-widest text-white/40">
                        Estimated Budget
                      </p>
                    </div>
                    <p className="text-[22px] font-bold text-white tracking-tight leading-none">
                      {TRIP_STATS.BUDGET}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold text-white/30 uppercase mb-1 tracking-tighter">per person</p>
                    <div className="h-1 w-12 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-amber-400/50" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
