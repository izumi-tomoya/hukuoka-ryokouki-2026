import type { TripEvent } from "@/types/trip";
import Timeline from "@/components/trip/Timeline";
import TipsSection from "@/components/trip/TipsSection";
import { day1Tips, day2Tips } from "@/data/tripData";
import { cookies } from "next/headers";
import { SECRET_MODE_COOKIE_NAME, DAY_CONFIG } from "@/config/constants";

interface DayViewProps {
  events: TripEvent[];
  dayNumber: 1 | 2;
}

const dayTheme = {
  1: {
    bg: "from-[#3D1007] via-[#7A2E0A] to-[#C45A10]",
    labelColor: "text-amber-400/80",
    titleColor: "text-white",
    highlightBorder: "border-amber-400",
    highlightBg: "bg-white/10",
    orb1: "bg-orange-500/20",
    orb2: "bg-amber-400/15",
  },
  2: {
    bg: "from-[#0D0818] via-[#1A0D2E] to-[#2D1645]",
    labelColor: "text-rose-400/80",
    titleColor: "text-white",
    highlightBorder: "border-rose-400",
    highlightBg: "bg-white/10",
    orb1: "bg-rose-600/15",
    orb2: "bg-purple-600/10",
  },
} as const;

export default async function DayView({ events, dayNumber }: DayViewProps) {
  const config = DAY_CONFIG[dayNumber];
  const theme = dayTheme[dayNumber];
  const cookieStore = await cookies();
  const isSecretMode = cookieStore.get(SECRET_MODE_COOKIE_NAME)?.value === "true";

  return (
    <section className="bg-white">
      {/* Day header */}
      <div className={`relative -mb-4 overflow-hidden bg-linear-to-br ${theme.bg}`}>
        {/* Decorative background elements */}
        <div className={`absolute -left-10 -top-10 h-64 w-64 md:h-96 md:w-96 rounded-full blur-[80px] opacity-60 ${theme.orb1}`} />
        <div className={`absolute -right-8 bottom-0 h-64 w-64 md:h-96 md:w-96 rounded-full blur-[80px] opacity-60 ${theme.orb2}`} />

        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-6 md:px-12 pb-14 pt-8 md:pt-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-6 bg-white/30" />
            <p className={`text-[10px] font-black tracking-[6px] uppercase ${theme.labelColor}`}>
              {config.label}
            </p>
          </div>

          <h2 className={`font-playfair mb-6 text-[28px] md:text-[36px] font-bold leading-tight ${theme.titleColor}`}>
            {config.title}
          </h2>

          <div
            className={`max-w-3xl rounded-[24px] border-l-4 px-6 py-4 text-[13px] md:text-[14px] leading-relaxed text-white/90 font-medium backdrop-blur-md shadow-2xl ${theme.highlightBorder} ${theme.highlightBg}`}
          >
            {config.highlight}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl">
        <Timeline events={events} dayNumber={dayNumber} />

        {isSecretMode && (
          <div className="px-6 md:px-12 pb-20">
            <TipsSection
              tips={dayNumber === 1 ? day1Tips : day2Tips}
              dayNumber={dayNumber}
            />
          </div>
        )}
      </div>
    </section>
  );
}
