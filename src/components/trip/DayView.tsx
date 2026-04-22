import type { TripEvent, Tip } from "@/types/trip";
import Timeline from "@/components/trip/Timeline";
import TipsSection from "@/components/trip/TipsSection";
import CategoryTabs from "@/components/trip/CategoryTabs";
import { cookies } from "next/headers";
import { SECRET_MODE_COOKIE_NAME, DAY_CONFIG } from "@/config/constants";

interface DayViewProps {
  events: TripEvent[];
  dayNumber: 1 | 2;
  dayLabel?: string;
  dayTitle?: string;
  dayHighlight?: string;
  tips?: Tip[];
  slug: string;
}


const dayTheme = {
  1: {
    bg: "from-rose-100 via-pink-50 to-rose-50",
    labelColor: "text-rose-400/80",
    titleColor: "text-rose-900",
    highlightBorder: "border-rose-200",
    highlightBg: "bg-white/60",
    orb1: "bg-rose-200/40",
    orb2: "bg-pink-200/30",
  },
  2: {
    bg: "from-purple-100 via-indigo-50 to-purple-50",
    labelColor: "text-purple-400/80",
    titleColor: "text-purple-900",
    highlightBorder: "border-purple-200",
    highlightBg: "bg-white/60",
    orb1: "bg-purple-200/40",
    orb2: "bg-indigo-200/30",
  },
} as const;

export default async function DayView({
  events,
  dayNumber,
  dayLabel,
  dayTitle,
  dayHighlight,
  tips,
  slug,
}: DayViewProps) {
  const config = DAY_CONFIG[dayNumber];
  const theme = dayTheme[dayNumber];
  const cookieStore = await cookies();
  const isSecretMode = cookieStore.get(SECRET_MODE_COOKIE_NAME)?.value === "true";

  const label = dayLabel ?? config.label;
  const title = dayTitle ?? config.title;
  const highlight = dayHighlight ?? config.highlight;

  return (
    <section className="bg-stone-50 min-h-screen">
      <div className="mx-auto max-w-5xl px-6 pt-12">
        <CategoryTabs slug={slug} activePath={`/trip/${slug}/day/${dayNumber}`} isSecretMode={isSecretMode} />

        <div className={`relative mb-10 overflow-hidden rounded-[2rem] bg-gradient-to-br ${theme.bg}`}>
          <div className="relative mx-auto px-8 py-10">
            <p className={`text-[10px] font-black tracking-[0.3em] uppercase mb-3 ${theme.labelColor}`}>
              {label}
            </p>
            <h2 className={`font-playfair text-3xl md:text-4xl font-bold leading-tight mb-6 ${theme.titleColor}`}>
              {title}
            </h2>
            <div className={`rounded-2xl border-l-4 px-6 py-4 text-sm leading-relaxed text-rose-900/80 font-medium bg-white/60 backdrop-blur-sm ${theme.highlightBorder}`}>
              {highlight}
            </div>
          </div>
        </div>

        <Timeline events={events} dayNumber={dayNumber} />


        {isSecretMode && tips && tips.length > 0 && (
          <div className="px-6 md:px-12 pb-20">
            <TipsSection tips={tips} dayNumber={dayNumber} />
          </div>
        )}
      </div>
    </section>
  );
}
