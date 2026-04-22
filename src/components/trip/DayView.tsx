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
    <section>
      {/* Day header */}
      <div className={`relative -mb-4 overflow-hidden bg-linear-to-br ${theme.bg} px-5 pb-10 pt-6`}>
        {/* Glow orbs */}
        <div className={`absolute -left-10 -top-10 h-48 w-48 rounded-full blur-[60px] ${theme.orb1}`} />
        <div className={`absolute -right-8 bottom-0 h-40 w-40 rounded-full blur-[50px] ${theme.orb2}`} />

        {/* Gold/accent top rule */}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px w-5 bg-white/25" />
            <p className={`text-[9px] font-black tracking-[5px] uppercase ${theme.labelColor}`}>
              {config.label}
            </p>
          </div>

          <h2 className={`font-playfair mb-4 text-[20px] font-bold leading-snug ${theme.titleColor}`}>
            {config.title}
          </h2>

          <div
            className={`rounded-2xl border-l-4 px-4 py-3 text-[11px] leading-relaxed text-white/85 font-medium backdrop-blur-sm ${theme.highlightBorder} ${theme.highlightBg}`}
          >
            {config.highlight}
          </div>
        </div>
      </div>

      <Timeline events={events} dayNumber={dayNumber} />

      {isSecretMode && (
        <TipsSection
          tips={dayNumber === 1 ? day1Tips : day2Tips}
          dayNumber={dayNumber}
        />
      )}
    </section>
  );
}
