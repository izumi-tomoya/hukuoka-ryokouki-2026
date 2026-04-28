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
import { SafeLink } from '@/features/trip/components/client/SafeLink';
import Image from 'next/image';

const tagConfig: Record<string, { className: string; icon: React.ElementType }> = {
  food: { className: 'bg-rose-500/10 text-rose-500 border-rose-500/20', icon: Utensils },
  transport: { className: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20', icon: Bus },
  sightseeing: { className: 'bg-sky-500/10 text-sky-500 border-sky-500/20', icon: Eye },
  hotel: { className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', icon: Home },
  shopping: { className: 'bg-pink-500/10 text-pink-500 border-pink-500/20', icon: ShoppingBag },
  surprise: { className: 'bg-purple-500/10 text-purple-500 border-purple-500/20', icon: Star },
  night: { className: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20', icon: Moon },
};

function TagBadge({ tag, label }: { tag: string; label: string }) {
  const config = tagConfig[tag] ?? tagConfig.transport;
  const Icon = config.icon;
  return (
    <Badge
      variant="outline"
      className={cn(
        'mb-4 gap-2 px-3 md:px-4 py-1 md:py-1.5 text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap border rounded-full transition-colors',
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
    <MagazineCard className={cn("h-full relative overflow-hidden", event.isConfirmed && 'opacity-60 grayscale-[0.5]')}>
      <div className="flex justify-between items-start mb-4 md:mb-6 relative z-10">
        {event.tag && event.tagLabel ? <TagBadge tag={event.tag} label={event.tagLabel} /> : <div />}
        <div className="flex gap-2">
          {event.actualExpense !== undefined && event.actualExpense > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-[10px] font-bold text-muted-foreground border border-border">
              <JapaneseYen size={10} />
              {event.actualExpense.toLocaleString()}
            </div>
          )}
          {isAdmin && event.id && <ConfirmCheckbox eventId={event.id} initialConfirmed={!!event.isConfirmed} />}
        </div>
      </div>

      <div className="relative z-10">
        <h3 className="font-playfair text-lg md:text-2xl font-black text-foreground tracking-tight leading-snug mb-3">
          {(!isAdmin && isSurprise) ? "✨ Surprise Spot" : event.title}
        </h3>
        <p className="text-[13px] md:text-sm leading-relaxed text-muted-foreground font-medium mb-6 line-clamp-2">
          {(!isAdmin && isSurprise) ? "当日までのお楽しみ。ふたりの特別な時間が待っています。" : event.desc}
        </p>

        {event.isYatai && event.yataiStops && event.id && (
          <div className="mb-6 md:mb-8">
            <YataiLiveTracker stops={event.yataiStops} eventId={event.id} />
          </div>
        )}

        <PhotoGallery photos={event.photos || []} eventId={event.id} />

        {/* Memoir Section */}
        {hasMemoir && (
          <div className="mt-8 border-t border-border pt-8 animate-in fade-in duration-700">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-px grow bg-border" />
              <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-secondary/50">
                <MessageSquareQuote size={12} className="text-primary" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">Memory Card</span>
              </div>
              <div className="h-px grow bg-border" />
            </div>
            
            {event.notes && (
              <p className="font-playfair text-base md:text-lg italic text-foreground leading-relaxed mb-6 text-center px-4">
                &ldquo;{event.notes}&rdquo;
              </p>
            )}

            {event.actualPhotos && event.actualPhotos.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mt-4">
                {event.actualPhotos.map((photo, i) => (
                  <div key={i} className="aspect-square relative rounded-[1.5rem] overflow-hidden border border-border shadow-inner group/photo">
                    <Image src={photo} alt="Memory" fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-700 group-hover/photo:scale-110" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
          {event.locationUrl && (isAdmin || !isSurprise) && (
            <SafeLink 
              href={event.locationUrl} 
              className="inline-flex items-center gap-2 text-[10px] font-black text-primary hover:text-primary/80 tracking-widest uppercase transition-colors"
            >
              <MapPin size={14} /> Open Maps
            </SafeLink>
          )}
          {event.access && <AccessRow chips={event.access} />}
        </div>
        
        {event.weatherStats && (
          <div className="mt-4">
            <WeatherStatsDisplay stats={event.weatherStats} />
          </div>
        )}
      </div>
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
