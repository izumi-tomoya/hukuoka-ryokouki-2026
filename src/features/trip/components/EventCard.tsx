import type { TripEvent } from '@/features/trip/types/trip';
import { Badge } from '@/components/ui/badge';
import AccessRow from '@/features/trip/components/AccessRow';
import PhotoGallery from '@/features/trip/components/PhotoGallery';
import WeatherStatsDisplay from '@/features/trip/components/WeatherStats';
import { MagazineCard } from '@/components/ui/MagazineCard';
import { cn } from '@/lib/utils';
import { MapPin, Utensils, Star, Bus, ShoppingBag, Eye, Moon, Home, MessageSquareQuote, JapaneseYen } from 'lucide-react';
import ClickableCard from '@/features/trip/components/client/ClickableCard';
import ConfirmCheckbox from '@/features/trip/components/client/ConfirmCheckbox';
import YataiLiveTracker from '@/features/trip/components/client/YataiLiveTracker';
import TransitTimeline from '@/features/trip/components/TransitTimeline';
import { SafeLink } from '@/features/trip/components/client/SafeLink';
import Image from 'next/image';

const tagConfig: Record<string, { className: string; icon: React.ElementType }> = {
  food: { className: 'bg-rose-100 text-rose-900 border-rose-200', icon: Utensils },
  transport: { className: 'bg-stone-100 text-stone-500 border-stone-200', icon: Bus },
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
        'mb-4 gap-2 px-3 md:px-4 py-1 md:py-1.5 text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap border-none',
        config.className
      )}
    >
      <Icon size={12} />
      {label}
    </Badge>
  );
}

function BasicCard({ event, isAdmin }: { event: TripEvent, isAdmin?: boolean }) {
  const hasMemoir = !!(event.notes || (event.actualPhotos && event.actualPhotos.length > 0));
  const isSurprise = event.tag === 'surprise';

  return (
    <MagazineCard className={cn("h-full", event.isConfirmed && 'opacity-60 grayscale-[0.5]')}>
      <div className="flex justify-between items-start mb-4 md:mb-6">
        {event.tag && event.tagLabel ? <TagBadge tag={event.tag} label={event.tagLabel} /> : <div />}
        <div className="flex gap-2">
          {event.actualExpense !== undefined && event.actualExpense > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-[10px] font-bold text-stone-600">
              <JapaneseYen size={10} />
              {event.actualExpense.toLocaleString()}
            </div>
          )}
          {isAdmin && event.id && <ConfirmCheckbox eventId={event.id} initialConfirmed={!!event.isConfirmed} />}
        </div>
      </div>

      <h3 className="font-playfair text-lg md:text-2xl font-bold text-stone-900 tracking-tight leading-snug mb-3">
        {(!isAdmin && isSurprise) ? "✨ Surprise Spot" : event.title}
      </h3>
      <p className="text-[13px] md:text-sm leading-relaxed text-stone-500 font-medium mb-4 md:mb-6 line-clamp-2">
        {(!isAdmin && isSurprise) ? "当日までのお楽しみ。ふたりの特別な時間が待っています。" : event.desc}
      </p>

      {event.isYatai && event.yataiStops && event.id && (
        <div className="mb-6 md:mb-8">
          <YataiLiveTracker stops={event.yataiStops} eventId={event.id} />
        </div>
      )}

      <PhotoGallery photos={event.photos || []} eventId={event.id} />

      {/* Memoir Section (The Journey's Memory) */}
      {hasMemoir && (
        <div className="mt-8 border-t border-stone-100 pt-8 animate-in fade-in duration-700">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquareQuote size={14} className="text-rose-400" />
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">Memory Card</h4>
          </div>
          
          {event.notes && (
            <p className="font-playfair text-base md:text-lg italic text-stone-600 leading-relaxed mb-6">
              &ldquo;{event.notes}&rdquo;
            </p>
          )}

          {event.actualPhotos && event.actualPhotos.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-4">
              {event.actualPhotos.map((photo, i) => (
                <div key={i} className="aspect-square relative rounded-2xl overflow-hidden border border-stone-100">
                  <Image src={photo} alt="Memory" fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {event.locationUrl && (isAdmin || !isSurprise) && (
        <SafeLink 
          href={event.locationUrl} 
          className="mt-6 inline-flex items-center gap-3 text-[11px] font-bold text-rose-500 tracking-widest uppercase transition-colors"
        >
          <MapPin size={14} /> Google Map
        </SafeLink>
      )}
      {event.access && (
        <div className="mt-6 border-t border-stone-100 pt-6">
          <AccessRow chips={event.access} />
        </div>
      )}
      {event.weatherStats && <WeatherStatsDisplay stats={event.weatherStats} />}
    </MagazineCard>
  );
}

export default function EventCard({ event, isAdmin }: { event: TripEvent, isAdmin?: boolean }) {
  return (
    <ClickableCard event={event}>
      <BasicCard event={event} isAdmin={isAdmin} />
    </ClickableCard>
  );
}
