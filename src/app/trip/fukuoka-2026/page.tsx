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
    <div className="mb-8 flex items-center gap-4">
      <div className="h-px flex-1 bg-linear-to-r from-stone-200 to-transparent" />
      <span className="text-[11px] font-black tracking-[8px] text-stone-400 uppercase ml-2">{title}</span>
      <div className="h-px flex-1 bg-linear-to-l from-stone-200 to-transparent" />
    </div>
  );
}

function Day1Card() {
  return (
    <Link
      href="/day/1"
      className="group relative block overflow-hidden rounded-[32px] transition-all hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-orange-200/60"
    >
      <div className="absolute inset-0 bg-linear-to-br from-[#FFF8F2] via-[#FFF3E8] to-[#FDECD5]" />
      <div className="absolute inset-0 bg-linear-to-t from-orange-100/30 via-transparent to-transparent" />
      
      <div
        className="absolute -bottom-6 -right-2 pointer-events-none select-none text-orange-200/40 font-playfair font-black transition-transform group-hover:scale-110"
        style={{ fontSize: "160px", lineHeight: 1 }}
      >
        01
      </div>

      <div className="absolute left-0 top-8 bottom-8 w-1.5 rounded-r-full bg-linear-to-b from-orange-400 to-amber-500" />
      <div className="absolute inset-0 rounded-[32px] ring-1 ring-orange-200/70" />

      <div className="relative p-8 lg:p-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-[10px] font-black tracking-[6px] text-orange-500 uppercase mb-3">Day 01</p>
            <h3 className="font-playfair text-[26px] md:text-[30px] font-bold text-stone-900 leading-[1.1] tracking-tight">
              太宰府 &<br />屋台の夜
            </h3>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-orange-500 text-white shadow-xl shadow-orange-500/30 transition-all group-hover:scale-110 group-hover:rotate-6">
            <ChevronRight size={24} strokeWidth={2.5} />
          </div>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <span className="text-[12px] font-bold text-stone-500 bg-white/50 px-3 py-1 rounded-full">2026.05.24 (SUN)</span>
          <div className="h-1 w-1 rounded-full bg-stone-300" />
          <span className="rounded-full bg-orange-500 text-white px-3 py-1 text-[10px] font-black uppercase tracking-wider">
            15 Events
          </span>
        </div>

        <div className="flex gap-1.5">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="h-2 flex-1 rounded-full bg-orange-200/60 transition-all group-hover:bg-orange-400/60" />
          ))}
        </div>
      </div>
    </Link>
  );
}

function Day2Card() {
  const stars = [
    { top: "20%", right: "20%", size: 3 },
    { top: "40%", right: "35%", size: 2 },
    { top: "15%", right: "50%", size: 1.5 },
    { top: "55%", right: "25%", size: 4 },
    { top: "30%", right: "60%", size: 2.5 },
  ];

  return (
    <Link
      href="/day/2"
      className="group relative block overflow-hidden rounded-[32px] transition-all hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-stone-900/40"
    >
      <div className="absolute inset-0 bg-[#1A1410]" />
      <div className="absolute inset-0 bg-linear-to-br from-[#2D1B10]/90 via-[#1A1410] to-[#0F1520]" />
      <div className="absolute -top-20 left-1/4 h-80 w-80 rounded-full bg-rose-600/15 blur-[100px]" />
      <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-amber-600/10 blur-[100px]" />

      <div
        className="absolute -bottom-6 -right-2 pointer-events-none select-none text-white/4 font-playfair font-black transition-transform group-hover:scale-110"
        style={{ fontSize: "160px", lineHeight: 1 }}
      >
        02
      </div>

      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white opacity-40"
          style={{
            top: star.top,
            right: star.right,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animation: `star-twinkle ${3 + i * 0.8}s ease-in-out infinite`,
            animationDelay: `${i * 500}ms`,
          }}
        />
      ))}

      <div className="absolute left-0 top-8 bottom-8 w-1.5 rounded-r-full bg-linear-to-b from-rose-400 to-pink-600" />
      <div className="absolute inset-0 rounded-[32px] ring-1 ring-white/8" />

      <div className="relative p-8 lg:p-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-[10px] font-black tracking-[6px] text-rose-400 uppercase mb-3">Day 02</p>
            <h3 className="font-playfair text-[26px] md:text-[30px] font-bold text-white leading-[1.1] tracking-tight">
              水炊き &<br />
              <span className="italic text-rose-300">サプライズ</span>
            </h3>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-rose-500 text-white shadow-xl shadow-rose-600/30 transition-all group-hover:scale-110 group-hover:-rotate-6">
            <ChevronRight size={24} strokeWidth={2.5} />
          </div>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <span className="text-[12px] font-bold text-white/40 bg-white/5 px-3 py-1 rounded-full">2026.05.25 (MON)</span>
          <div className="h-1 w-1 rounded-full bg-white/10" />
          <span className="rounded-full bg-rose-500 text-white px-3 py-1 text-[10px] font-black uppercase tracking-wider">
            14 Events
          </span>
        </div>

        <div className="flex gap-1.5">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="h-2 flex-1 rounded-full bg-white/10 transition-all group-hover:bg-rose-500/40" />
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
      className="group relative flex items-center gap-6 overflow-hidden rounded-[32px] bg-stone-950 p-8 md:p-10 shadow-2xl transition-all hover:-translate-y-1.5 hover:shadow-amber-950/20"
    >
      <div className="absolute inset-0 bg-linear-to-br from-amber-600/15 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="absolute inset-0 rounded-[32px] ring-white/6" />

      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-[24px] border border-amber-400/20 bg-amber-400/10 text-4xl backdrop-blur-sm transition-transform group-hover:scale-110 group-hover:rotate-3">
        🧭
      </div>
      <div className="relative">
        <p className="text-[10px] font-black tracking-[6px] text-amber-400/70 uppercase mb-1.5">Secret Guide</p>
        <h3 className="text-[20px] font-bold text-white tracking-tight">Escort Tips</h3>
        <p className="text-[12px] text-white/30 mt-1">裏方として完璧な旅をプロデュース</p>
      </div>
      <div className="relative ml-auto flex h-12 w-12 items-center justify-center rounded-[18px] bg-white/5 transition-all group-hover:bg-amber-400/10">
        <ChevronRight size={22} className="text-white/40 group-hover:text-amber-400 transition-colors" />
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
    <div className={`rounded-[28px] bg-white/3 p-6 ring-1 ring-white/10 backdrop-blur-md transition-all hover:bg-white/5 ${className}`}>
      <div className="flex items-center gap-2.5 mb-3">
        <Icon size={14} className={iconColor} />
        <p className="text-[10px] font-black uppercase tracking-[2px] text-white/40">{label}</p>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-[24px] font-bold text-white tracking-tight leading-none">{value}</p>
        {subValue && <p className="text-[12px] font-bold text-white/60 ml-1">{subValue}</p>}
      </div>
    </div>
  );
}

// --- Table of Contents ---

const TOC_DATA = [
  {
    day: 1, label: "Day 01", date: "5.24 SUN", href: "/day/1",
    accent: "orange",
    events: [
      { time: "04:15", title: "お家を出発", type: "transport" },
      { time: "09:25", title: "福岡空港 到着", type: "sightseeing" },
      { time: "10:00", title: "ホテルオークラ 荷物預け", type: "hotel" },
      { time: "11:00", title: "太宰府天満宮へ出発", type: "sightseeing" },
      { time: "12:00", title: "和牛めんたい 神楽", type: "food" },
      { time: "13:30", title: "九州国立博物館", type: "sightseeing" },
      { time: "16:00", title: "ホテルチェックイン", type: "hotel" },
      { time: "17:30", title: "キャナルシティ 噴水ショー", type: "shopping" },
      { time: "18:30", title: "はじめの一歩 海鮮居酒屋", type: "food" },
      { time: "20:00", title: "博多屋台ハシゴツアー 🏮", type: "special" },
    ],
  },
  {
    day: 2, label: "Day 02", date: "5.25 MON", href: "/day/2",
    accent: "rose",
    events: [
      { time: "07:00", title: "起床 — 那珂川の朝景色", type: "hotel" },
      { time: "08:00", title: "朝食ビュッフェ（フレンチトースト）", type: "food" },
      { time: "11:00", title: "チェックアウト", type: "hotel" },
      { time: "12:00", title: "水たき 長野（老舗水炊き）", type: "food" },
      { time: "14:00", title: "大濠公園 お散歩", type: "sightseeing" },
      { time: "15:30", title: "💝 とっておきのサプライズ", type: "surprise" },
      { time: "18:30", title: "牧のうどん 空港店", type: "food" },
      { time: "19:15", title: "福岡空港 お土産タイム", type: "shopping" },
      { time: "20:45", title: "福岡空港 出発 ✈️", type: "transport" },
    ],
  },
] as const;

const tocDotColor: Record<string, string> = {
  food:        "bg-orange-400",
  transport:   "bg-stone-400",
  sightseeing: "bg-sky-400",
  hotel:       "bg-emerald-400",
  shopping:    "bg-violet-400",
  surprise:    "bg-rose-500",
  special:     "bg-amber-400",
};

function TableOfContents() {
  return (
    <section className="mx-auto max-w-7xl px-6 md:px-12 pb-16">
      <SectionHeader title="Schedule" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {TOC_DATA.map((d) => (
          <Link key={d.day} href={d.href} className="group block">
            <div
              className={`relative overflow-hidden rounded-[32px] p-7 lg:p-8 ring-1 transition-all hover:-translate-y-1 hover:shadow-2xl ${
                d.accent === "orange"
                  ? "ring-orange-200/70 hover:shadow-orange-100/80"
                  : "ring-rose-200/50 bg-[#120B0B] hover:shadow-rose-900/30"
              }`}
              style={d.accent === "orange" ? { background: "linear-gradient(145deg, #FFFCF8 0%, #FFF8EE 100%)" } : {}}
            >
              {/* Watermark number */}
              <div
                className={`absolute -bottom-3 right-2 pointer-events-none select-none font-playfair font-black leading-none ${
                  d.accent === "orange" ? "text-orange-200/40" : "text-white/4"
                }`}
                style={{ fontSize: "100px" }}
              >
                0{d.day}
              </div>

              {/* Header */}
              <div className="relative flex items-center justify-between mb-5">
                <div>
                  <p className={`text-[9px] font-black tracking-[5px] uppercase mb-1 ${d.accent === "orange" ? "text-orange-500" : "text-rose-400"}`}>
                    {d.label}
                  </p>
                  <p className={`text-[12px] font-bold ${d.accent === "orange" ? "text-stone-400" : "text-white/30"}`}>
                    {d.date}
                  </p>
                </div>
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-md transition-all group-hover:scale-110 ${d.accent === "orange" ? "bg-orange-500 shadow-orange-400/30" : "bg-rose-500 shadow-rose-600/30"}`}>
                  <ChevronRight size={16} strokeWidth={2.5} />
                </div>
              </div>

              {/* Event list */}
              <div className="relative space-y-2.5">
                {/* Vertical line */}
                <div className={`absolute left-1.25 top-2 bottom-2 w-px ${d.accent === "orange" ? "bg-orange-200/60" : "bg-white/10"}`} />

                {d.events.map((ev, i) => (
                  <div key={i} className="relative flex items-center gap-3 pl-4">
                    <div className={`absolute left-0 h-2.75 w-2.75 rounded-full border-2 border-white shadow-sm ${tocDotColor[ev.type] ?? "bg-stone-400"}`} />
                    <span className={`text-[10px] font-bold tabular-nums shrink-0 ${d.accent === "orange" ? "text-stone-400" : "text-white/30"}`}>
                      {ev.time}
                    </span>
                    <span className={`text-[12px] font-medium truncate ${d.accent === "orange" ? "text-stone-700" : "text-white/70"}`}>
                      {ev.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// --- Main Page Component ---
export default async function Dashboard() {
  const cookieStore = await cookies();
  const isSecretMode = cookieStore.get(SECRET_MODE_COOKIE_NAME)?.value === "true";
  
  const weather = await getFukuokaWeather();
  const countdown = getCountdown(TRIP_START_DATE);

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-stone-900 selection:bg-amber-100">
      <Hero />

      <main className="mx-auto max-w-7xl px-6 md:px-12 pt-12 pb-16">
        <SectionHeader title="Itinerary" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <div className="md:col-span-1">
            <Day1Card />
          </div>
          <div className="md:col-span-1">
            <Day2Card />
          </div>
          {isSecretMode && (
            <div className="md:col-span-2">
              <SecretGuideCard />
            </div>
          )}
        </div>
      </main>

      <TableOfContents />

      {/* Trip Stats Section */}
      <section className="mx-auto max-w-7xl px-6 md:px-12 pb-32">
        <div className="relative overflow-hidden rounded-[40px] bg-[#050B17] p-10 md:p-12 shadow-2xl">
          {/* Decorative background elements */}
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />
          <div className="absolute -left-24 -bottom-24 h-96 w-96 rounded-full bg-indigo-600/10 blur-[120px]" />
          <div className="absolute inset-0 ring-1 ring-white/10 rounded-[40px]" />

          <div className="relative">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 ring-1 ring-amber-400/20">
                  <Sparkles size={18} className="text-amber-400" />
                </div>
                <span className="text-[12px] font-black tracking-[6px] text-white/90 uppercase">
                  Trip Stats
                </span>
              </div>
              <span className="flex items-center gap-2.5 rounded-full bg-blue-500/10 px-5 py-2 text-[10px] font-black text-blue-300 ring-1 ring-blue-400/20">
                <div className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />
                LIVE UPDATES
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
              
              <div className="sm:col-span-2 lg:col-span-1 rounded-[28px] bg-white/3 p-6 ring-1 ring-white/10 backdrop-blur-md transition-all hover:bg-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2.5 mb-3">
                      <Thermometer size={14} className="text-rose-400/70" />
                      <p className="text-[10px] font-black uppercase tracking-[2px] text-white/40">
                        Budget Est.
                      </p>
                    </div>
                    <p className="text-[26px] font-bold text-white tracking-tight leading-none">
                      {TRIP_STATS.BUDGET}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-[10px] font-bold text-white/20 uppercase mb-2 tracking-tighter italic">per person</p>
                    <div className="h-1.5 w-16 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-linear-to-r from-amber-500/40 to-amber-300/40" />
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
