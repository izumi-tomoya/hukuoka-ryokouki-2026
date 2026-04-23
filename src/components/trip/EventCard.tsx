import type { TripEvent } from '@/features/trip/types/trip';
import { Badge } from '@/components/ui/badge';
import AccessRow from '@/components/trip/AccessRow';
import PhotoGallery from '@/components/trip/PhotoGallery';
import { cn } from '@/lib/utils';
import { MapPin, Utensils, Star, Bus, ShoppingBag, Eye, Moon, Home, Lock } from 'lucide-react';
import ClickableCard from '@/components/trip/client/ClickableCard';
import ConfirmCheckbox from '@/components/trip/client/ConfirmCheckbox';
import FavoriteToggle from '@/components/trip/client/FavoriteToggle';
import MapLink from '@/components/trip/client/MapLink';
import WeatherStatsDisplay from '@/components/trip/WeatherStats';

const tagConfig: Record<string, { className: string; icon: React.ElementType }> = {
  food: { className: 'bg-rose-50 text-rose-600 border-rose-100', icon: Utensils },
  transport: { className: 'bg-stone-50 text-stone-500 border-stone-100', icon: Bus },
  sightseeing: { className: 'bg-sky-50 text-sky-600 border-sky-100', icon: Eye },
  hotel: { className: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: Home },
  shopping: { className: 'bg-pink-50 text-pink-600 border-pink-100', icon: ShoppingBag },
  surprise: { className: 'bg-purple-50 text-purple-600 border-purple-100', icon: Star },
  night: { className: 'bg-rose-900 text-rose-200 border-rose-800', icon: Moon },
};

function TagBadge({ tag, label }: { tag: string; label: string }) {
  const config = tagConfig[tag] ?? tagConfig.transport;
  const Icon = config.icon;
  return (
    <Badge
      variant="outline"
      className={cn(
        'mb-3 gap-1.5 px-2 py-0.5 text-[10px] md:text-xs font-bold uppercase tracking-wider whitespace-nowrap',
        config.className
      )}
    >
      <Icon size={10} />
      {label}
    </Badge>
  );
}

// ---------- Basic card ----------
function BasicCard({ event }: { event: TripEvent }) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-[22px] border border-rose-100/70 bg-white p-4 md:p-6 shadow-lg shadow-rose-100/40 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-rose-200/50',
        event.isConfirmed && 'opacity-75 grayscale-[0.3]'
      )}
    >
      <div className="absolute right-0 top-0 h-20 w-20 bg-linear-to-br from-rose-50/60 to-transparent opacity-60" />

      <div className="flex justify-between items-start mb-1">
        {event.tag && event.tagLabel ? (
          <TagBadge tag={event.tag} label={event.tagLabel} />
        ) : (
          <div />
        )}
        {event.id && (
          <div className="flex gap-2">
            <FavoriteToggle eventId={event.id} />
            <ConfirmCheckbox eventId={event.id} initialConfirmed={!!event.isConfirmed} />
          </div>
        )}
      </div>

      <h3
        className={cn(
          'text-[15px] md:text-[16px] font-bold text-stone-800 tracking-tighter leading-snug',
          event.isConfirmed && 'line-through decoration-stone-400/50 text-stone-400'
        )}
      >
        {event.title}
      </h3>
      <p className="mt-2 text-[12px] md:text-[13px] leading-relaxed text-stone-500/90 font-medium line-clamp-2">
        {event.desc}
      </p>

      {event.photos && <div className="mt-3"><PhotoGallery photos={event.photos} /></div>}

      {event.locationUrl && <MapLink url={event.locationUrl} />}

      {event.access && (
        <div className="mt-4 border-t border-rose-50 pt-4">
          <AccessRow chips={event.access} />
        </div>
      )}
      {event.weatherStats && <WeatherStatsDisplay stats={event.weatherStats} />}
    </div>
  );
}

// ---------- Food card ----------
function FoodCard({ event }: { event: TripEvent }) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-[26px] transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-rose-200/50',
        event.isConfirmed && 'opacity-75 grayscale-[0.2]'
      )}
    >
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(145deg, #FFFCFB 0%, #FFF5F7 40%, #FFECF0 100%)',
        }}
      />
      <div className="absolute inset-0 rounded-[26px] ring-2 ring-rose-200/50" />
      <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-rose-200/25 blur-3xl" />

      {/* Left accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-[26px] bg-linear-to-b from-rose-400 via-pink-400 to-rose-300" />

      <div className="relative p-5 pl-6 md:p-6 md:pl-7">
        <div className="flex justify-between items-start mb-2">
          <TagBadge tag="food" label="Premium Gourmet" />
          {event.id && (
            <div className="flex gap-2">
              <FavoriteToggle eventId={event.id} />
              <ConfirmCheckbox eventId={event.id} initialConfirmed={!!event.isConfirmed} />
            </div>
          )}
        </div>

        <p
          className={cn(
            'mb-2 text-[18px] md:text-[19px] font-bold leading-tight text-stone-900 tracking-tighter',
            event.isConfirmed && 'line-through decoration-stone-400/50 text-stone-400'
          )}
        >
          {event.foodName}
        </p>
        <p className="mb-4 text-[12px] md:text-[13px] leading-relaxed text-stone-500 font-medium line-clamp-2">
          {event.foodDesc}
        </p>

        {event.highlight && (
          <div
            className="mb-4 rounded-2xl p-4 text-[11px] font-bold leading-relaxed text-rose-900 ring-1 ring-rose-200/60"
            style={{ background: 'rgba(255, 240, 245, 0.7)' }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Star size={11} className="fill-rose-400 text-rose-400 shrink-0" />
              <span className="text-[10px] font-black tracking-[2px] text-rose-500 uppercase">
                Master Tips
              </span>
            </div>
            {event.highlight}
          </div>
        )}

        {event.photos && <div className="mt-3"><PhotoGallery photos={event.photos} /></div>}

        {event.locationUrl && <MapLink url={event.locationUrl} label="お店の詳細・地図を見る" />}

        {event.access && (
          <div className="mt-4 border-t border-rose-100/60 pt-4">
            <AccessRow chips={event.access} />
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Surprise card ----------
function SurpriseCard() {
  return (
    <div className="group relative overflow-hidden rounded-[28px] text-center shadow-2xl shadow-stone-900/20">
      <div className="absolute inset-0 bg-[#1A1A1A]" />
      <div className="absolute inset-0 bg-linear-to-br from-stone-800 via-stone-900 to-black" />
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/5 blur-[80px] animate-pulse" />
      <div className="absolute left-4 top-4 h-8 w-8 border-l border-t border-stone-700/50 rounded-tl-xl" />
      <div className="absolute right-4 top-4 h-8 w-8 border-r border-t border-stone-700/50 rounded-tr-xl" />
      <div className="absolute left-4 bottom-4 h-8 w-8 border-l border-b border-stone-700/50 rounded-bl-xl" />
      <div className="absolute right-4 bottom-4 h-8 w-8 border-r border-b border-stone-700/50 rounded-br-xl" />
      <div className="relative z-10 flex flex-col items-center justify-center p-8 md:p-10 py-16">
        <div className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full border border-white/5 bg-white/5 backdrop-blur-xl shadow-2xl transition-transform group-hover:scale-110">
          <Lock size={28} className="text-stone-600/50" />
        </div>
      </div>
    </div>
  );
}

// ---------- Yatai card ----------
function YataiCard({
  stops,
  eventId,
  isConfirmed,
}: {
  stops: NonNullable<TripEvent['yataiStops']>;
  eventId?: string;
  isConfirmed?: boolean;
}) {
  return (
    <div className="group relative overflow-hidden rounded-[26px] shadow-xl shadow-amber-200/40 transition-all hover:-translate-y-1">
      <div
        className="relative"
        style={{
          background: 'linear-gradient(160deg, #3A1A08 0%, #2C1406 50%, #221006 100%)',
        }}
      >
        <div className="relative p-5 md:p-6">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-amber-400/15 ring-1 ring-amber-400/25 text-lg">
                🏮
              </div>
              <div>
                <p className="text-[8px] font-black tracking-[1px] text-amber-400/60 uppercase mb-0.5">
                  Night Tour
                </p>
                <h3 className="text-[14px] font-bold text-amber-200 tracking-tighter">
                  博多屋台ハシゴツアー
                </h3>
              </div>
            </div>
            {eventId && (
              <div className="flex gap-2">
                <FavoriteToggle eventId={eventId} />
                <ConfirmCheckbox eventId={eventId} initialConfirmed={!!isConfirmed} />
              </div>
            )}
          </div>

          <div className="relative space-y-4">
            <div className="absolute left-[18px] top-1 h-[calc(100%-16px)] w-px bg-linear-to-b from-amber-600/50 via-amber-700/30 to-transparent" />
            {stops.map((s, i) => (
              <div key={i} className="relative flex items-start gap-4">
                <div className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-amber-600/40 bg-amber-400/12 text-[10px] font-bold text-amber-300">
                  {i + 1}
                </div>
                <div className="flex-1 pb-1">
                  <p className="text-[10px] font-bold text-amber-400/80 mb-0.5">
                    {s.time} — {s.stop}
                  </p>
                  <p className="text-[11px] leading-relaxed text-stone-400 font-medium">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Main export ----------
export default function EventCard({ event }: { event: TripEvent }) {
  let content: React.ReactNode;
  if (event.type === 'food') content = <FoodCard event={event} />;
  else if (event.type === 'surprise') content = <SurpriseCard />;
  else if (event.isYatai && event.yataiStops)
    content = (
      <YataiCard stops={event.yataiStops} eventId={event.id} isConfirmed={!!event.isConfirmed} />
    );
  else content = <BasicCard event={event} />;

  return <ClickableCard event={event}>{content}</ClickableCard>;
}
