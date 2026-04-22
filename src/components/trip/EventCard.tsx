import type { TripEvent } from '@/types/trip';
import { Badge } from '@/components/ui/badge';
import AccessRow from '@/components/trip/AccessRow';
import PhotoGallery from '@/components/trip/PhotoGallery';
import { cn } from '@/lib/utils';
import {
  MapPin,
  Utensils,
  Star,
  Bus,
  ShoppingBag,
  Eye,
  Moon,
  Home,
} from 'lucide-react';
import ClickableCard from '@/components/trip/client/ClickableCard';

const tagConfig: Record<string, { className: string; icon: React.ElementType }> = {
  food: { className: 'bg-orange-50 text-orange-600 border-orange-100', icon: Utensils },
  transport: { className: 'bg-stone-50 text-stone-500 border-stone-100', icon: Bus },
  sightseeing: { className: 'bg-sky-50 text-sky-600 border-sky-100', icon: Eye },
  hotel: { className: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: Home },
  shopping: { className: 'bg-purple-50 text-purple-600 border-purple-100', icon: ShoppingBag },
  surprise: { className: 'bg-amber-50 text-orange-600 border-amber-100', icon: Star },
  night: { className: 'bg-slate-900 text-purple-300 border-slate-800', icon: Moon },
};

function TagBadge({ tag, label }: { tag: string; label: string }) {
  const config = tagConfig[tag] ?? tagConfig.transport;
  const Icon = config.icon;
  return (
    <Badge
      variant="outline"
      className={cn(
        'mb-3 gap-1.5 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider',
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
    <div className="group relative overflow-hidden rounded-[22px] border border-stone-100 bg-white p-5 shadow-lg shadow-stone-200/50 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-stone-200/60">
      <div className="absolute right-0 top-0 h-20 w-20 bg-linear-to-br from-stone-50 to-transparent opacity-60" />

      {event.tag && event.tagLabel && <TagBadge tag={event.tag} label={event.tagLabel} />}
      <h3 className="text-[15px] font-bold text-stone-800 tracking-tight leading-snug">
        {event.title}
      </h3>
      <p className="mt-1.5 text-[12px] leading-relaxed text-stone-500/90 font-medium">
        {event.desc}
      </p>

      {event.photos && <PhotoGallery photos={event.photos} />}

      {event.locationUrl && (
        <a
          href={event.locationUrl}
          target="_blank"
          rel="noopener noreferrer"
          suppressHydrationWarning
          className="mt-4 inline-flex items-center gap-2 text-[10px] font-bold text-sky-600 transition-all hover:gap-3"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-50">
            <MapPin size={11} />
          </div>
          Google Map で見る
        </a>
      )}
      {event.access && (
        <div className="mt-4 border-t border-stone-50 pt-4">
          <AccessRow chips={event.access} />
        </div>
      )}
    </div>
  );
}

// ---------- Food card ----------
function FoodCard({ event }: { event: TripEvent }) {
  return (
    <div className="group relative overflow-hidden rounded-[26px] transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-200/50">
      {/* Warm paper background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(145deg, #FFFCF8 0%, #FFF8EE 40%, #FFF3E2 100%)',
        }}
      />
      <div className="absolute inset-0 rounded-[26px] ring-2 ring-orange-200/60" />
      <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-orange-200/25 blur-3xl" />

      {/* Left accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-[26px] bg-linear-to-b from-orange-400 via-amber-500 to-orange-300" />

      <div className="relative p-6 pl-7">
        <TagBadge tag="food" label="Premium Gourmet" />

        <p className="mb-2 text-[19px] font-bold leading-tight text-stone-900 tracking-tight">
          {event.foodName}
        </p>
        <p className="mb-4 text-[12px] leading-relaxed text-stone-500 font-medium">
          {event.foodDesc}
        </p>

        {event.highlight && (
          <div
            className="mb-4 rounded-2xl p-4 text-[11px] font-bold leading-relaxed text-amber-900 ring-1 ring-amber-200/70"
            style={{ background: 'rgba(255, 237, 200, 0.5)' }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Star size={11} className="fill-amber-500 text-amber-500 shrink-0" />
              <span className="text-[9px] font-black tracking-[3px] text-amber-600 uppercase">
                Master Tips
              </span>
            </div>
            {event.highlight}
          </div>
        )}

        {event.photos && <PhotoGallery photos={event.photos} />}

        {event.locationUrl && (
          <a
            href={event.locationUrl}
            target="_blank"
            rel="noopener noreferrer"
            suppressHydrationWarning
            className="mt-3 inline-flex items-center gap-2 text-[10px] font-bold text-orange-600 transition-all hover:gap-3"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100">
              <Utensils size={11} />
            </div>
            お店の詳細・地図を見る
          </a>
        )}
        {event.access && (
          <div className="mt-4 border-t border-orange-100/60 pt-4">
            <AccessRow chips={event.access} />
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Surprise card ----------
function SurpriseCard() {
  const starPositions: Array<{
    top: string;
    left?: string;
    right?: string;
    size: number;
    delay: number;
  }> = [
    { top: "15%", left: "8%", size: 2.5, delay: 0 },
    { top: "25%", right: "12%", size: 2, delay: 500 },
    { top: "55%", left: "5%", size: 1.5, delay: 900 },
    { top: "70%", right: "8%", size: 2, delay: 300 },
    { top: "40%", left: "15%", size: 1.5, delay: 700 },
    { top: "65%", left: "35%", size: 1, delay: 1200 },
    { top: "20%", right: "30%", size: 1.5, delay: 600 },
    { top: "80%", right: "25%", size: 2.5, delay: 200 },
  ];

  return (
    <div className="group relative overflow-hidden rounded-[28px] text-center shadow-2xl shadow-purple-950/30">
      {/* Deep cosmic background */}
      <div className="absolute inset-0 bg-[#080612]" />
      <div className="absolute inset-0 bg-linear-to-br from-[#1A0830]/90 via-[#0A0618] to-[#0F0A20]/80" />

      {/* Aurora glows */}
      <div className="absolute -left-12 -top-12 h-56 w-56 rounded-full bg-purple-700/20 blur-17.5 animate-pulse" />
      <div
        className="absolute -right-12 -bottom-12 h-56 w-56 rounded-full bg-indigo-600/15 blur-17.5 animate-pulse"
        style={{ animationDelay: '800ms' }}
      />
      <div
        className="absolute left-1/3 bottom-0 h-40 w-40 rounded-full bg-rose-600/10 blur-12.5 animate-pulse"
        style={{ animationDelay: '400ms' }}
      />

      {/* Ring border */}
      <div className="absolute inset-0 rounded-[28px] ring-1 ring-purple-500/15" />

      {/* Star field */}
      {starPositions.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            top: star.top,
            left: 'left' in star ? star.left : undefined,
            right: 'right' in star ? star.right : undefined,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animation: `star-twinkle ${2.5 + i * 0.4}s ease-in-out infinite`,
            animationDelay: `${star.delay}ms`,
          }}
          aria-hidden="true"
        />
      ))}

      <div className="relative z-10 p-8">
        <div className="mx-auto mb-5 flex h-15 w-15 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/10 backdrop-blur-sm">
          <Star size={24} className="fill-amber-400 text-amber-400" />
        </div>

        <p className="mb-2 text-[9px] font-black tracking-[6px] text-purple-400/80 uppercase">
          Secret Event
        </p>
        <h3 className="font-playfair mb-5 text-[24px] font-bold italic leading-tight text-white drop-shadow-lg">
          とっておきの
          <br />
          サプライズ！
          <span className="not-italic">💝</span>
        </h3>

        <div className="mx-auto mb-5 flex items-center gap-2 justify-center">
          <div className="h-px w-6 bg-purple-400/30" />
          <div className="h-0.75 w-0.75 rounded-full bg-purple-400/50" />
          <div className="h-px w-6 bg-purple-400/30" />
        </div>

        <p className="text-[12px] leading-relaxed text-slate-300/80 font-medium">
          ここだけは、お楽しみ。💕
          <br />
          君のためにこっそり計画してた
          <br />
          <strong className="text-white font-bold">最高の時間が待ってるよ✨</strong>
        </p>
      </div>
    </div>
  );
}

// ---------- Yatai card ----------
function YataiCard({
  stops,
}: {
  stops: NonNullable<TripEvent['yataiStops']>;
}) {
  return (
    <div className="group relative overflow-hidden rounded-[26px] shadow-2xl shadow-stone-900/50 transition-all hover:-translate-y-1">
      {/* Deep night background */}
      <div className="absolute" style={{ display: 'none' }} />
      <div
        className="relative"
        style={{
          background: 'linear-gradient(160deg, #1C0E06 0%, #140B04 50%, #0D0806 100%)',
        }}
      >
        {/* Warm glow from lanterns */}
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-amber-600/10 blur-12.5" />
        <div className="absolute -left-4 bottom-0 h-32 w-32 rounded-full bg-orange-700/10 blur-10" />
        <div className="absolute inset-0 ring-1 ring-amber-900/40 rounded-[26px]" />

        <div className="relative p-6">
          {/* Header */}
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-amber-400/10 ring-1 ring-amber-400/20 text-xl">
              🏮
            </div>
            <div>
              <p className="text-[8px] font-black tracking-[4px] text-amber-500/60 uppercase mb-0.5">
                Local Night Tour
              </p>
              <h3 className="text-[15px] font-bold text-amber-300 tracking-tight">
                博多屋台ハシゴツアー
              </h3>
            </div>
          </div>

          {/* Stops */}
          <div className="relative space-y-5">
            {/* Vertical line */}
            <div className="absolute left-4 top-2 h-[calc(100%-16px)] w-px bg-linear-to-b from-amber-700/60 via-amber-800/40 to-transparent" />

            {stops.map((s, i) => (
              <div key={i} className="relative flex items-start gap-4">
                {/* Numbered circle */}
                <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-amber-700/50 bg-amber-400/10 text-[11px] font-bold text-amber-400">
                  {i + 1}
                </div>
                <div className="flex-1 pb-1">
                  <p className="text-[10px] font-bold text-amber-500/80 mb-1">
                    {s.time} — {s.stop}
                  </p>
                  <p className="text-[12px] leading-relaxed text-stone-400 font-medium">{s.desc}</p>
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
  else if (event.isYatai && event.yataiStops) content = <YataiCard stops={event.yataiStops} />;
  else content = <BasicCard event={event} />;

  return <ClickableCard event={event}>{content}</ClickableCard>;
}
