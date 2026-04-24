import type { TripEvent, Tip } from '@/features/trip/types/trip';
import EventFilterWrapper from '@/components/trip/client/EventFilterWrapper';
import TipsSection from '@/components/trip/TipsSection';
import BudgetSummary from '@/components/trip/BudgetSummary';
import CategoryTabs from '@/components/trip/CategoryTabs';
import { cookies } from 'next/headers';
import { SECRET_MODE_COOKIE_NAME, DAY_CONFIG } from '@/config/constants';

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
    bg: 'from-rose-100 via-pink-50 to-rose-50',
    labelColor: 'text-rose-400/80',
    titleColor: 'text-rose-950',
    highlightBorder: 'border-rose-200',
    highlightBg: 'bg-white/70',
  },
  2: {
    bg: 'from-purple-100 via-indigo-50 to-purple-50',
    labelColor: 'text-purple-400/80',
    titleColor: 'text-purple-950',
    highlightBorder: 'border-purple-200',
    highlightBg: 'bg-white/70',
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
  const isSecretMode = cookieStore.get(SECRET_MODE_COOKIE_NAME)?.value === 'true';

  const label = dayLabel ?? config.label;
  const title = dayTitle ?? config.title;
  const highlight = dayHighlight ?? config.highlight;

  return (
    <section className="bg-stone-50 min-h-screen pb-20">
      <div className="mx-auto max-w-5xl px-6 pt-16">
        <CategoryTabs
          slug={slug}
          activePath={`/trip/${slug}/day/${dayNumber}`}
          isSecretMode={isSecretMode}
        />

        <div
          className={`relative mb-20 overflow-hidden rounded-[2.5rem] bg-linear-to-br ${theme.bg} shadow-sm ring-1 ring-rose-100/50`}
        >
          <div className="relative mx-auto px-10 py-12 md:py-16">
            <p
              className={`text-[10px] font-black tracking-[0.4em] uppercase mb-4 ${theme.labelColor}`}
            >
              {label}
            </p>
            <h2
              className={`font-playfair text-4xl md:text-5xl font-extrabold leading-tight mb-8 ${theme.titleColor}`}
            >
              {title}
            </h2>
            <div
              className={`rounded-3xl border-l-4 px-8 py-6 text-base leading-relaxed text-rose-950 font-medium bg-white/70 backdrop-blur-md shadow-sm ${theme.highlightBorder}`}
            >
              {highlight}
            </div>

            <div className="mt-10 max-w-xs">
              <BudgetSummary events={events} />
            </div>
          </div>
        </div>

        <div className="mt-20">
          <EventFilterWrapper events={events} dayNumber={dayNumber} />
        </div>

        {isSecretMode && tips && tips.length > 0 && (
          <div className="mt-24">
            <TipsSection tips={tips} dayNumber={dayNumber} />
          </div>
        )}
      </div>
    </section>
  );
}
