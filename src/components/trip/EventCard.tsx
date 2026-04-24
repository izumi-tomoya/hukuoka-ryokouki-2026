import type { TripEvent } from '@/features/trip/types/trip';
import { Badge } from '@/components/ui/badge';
import AccessRow from '@/components/trip/AccessRow';
import PhotoGallery from '@/components/trip/PhotoGallery';
import WeatherStatsDisplay from '@/components/trip/WeatherStats';
import { MagazineCard } from '@/components/ui/MagazineCard';
import { cn } from '@/lib/utils';
import { MapPin, Utensils, Star, Bus, ShoppingBag, Eye, Moon, Home } from 'lucide-react';
import ClickableCard from '@/components/trip/client/ClickableCard';
import ConfirmCheckbox from '@/components/trip/client/ConfirmCheckbox';

const tagConfig: Record<string, { className: string; icon: React.ElementType }> = {
  food: { className: 'bg-memoir-rose text-memoir-roseDeep border-rose-100', icon: Utensils },
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
        'mb-4 gap-2 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap border-none',
        config.className
      )}
    >
      <Icon size={12} />
      {label}
    </Badge>
  );
}

function BasicCard({ event }: { event: TripEvent }) {
  return (
    <MagazineCard className={cn("h-full", event.isConfirmed && 'opacity-60 grayscale-[0.5]')}>
      <div className="flex justify-between items-start mb-6">
        {event.tag && event.tagLabel ? <TagBadge tag={event.tag} label={event.tagLabel} /> : <div />}
        {event.id && <ConfirmCheckbox eventId={event.id} initialConfirmed={!!event.isConfirmed} />}
      </div>

      <h3 className="font-playfair text-2xl font-bold text-memoir-stone tracking-tight leading-snug mb-3">
        {event.title}
      </h3>
      <p className="text-sm leading-relaxed text-stone-500 font-medium mb-6 line-clamp-2">
        {event.desc}
      </p>

      {event.photos && <PhotoGallery photos={event.photos} />}

      {event.locationUrl && (
        <a 
          href={event.locationUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-3 text-[11px] font-bold text-rose-500 tracking-widest uppercase transition-colors"
        >
          <MapPin size={14} /> Google Map
        </a>
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

export default function EventCard({ event }: { event: TripEvent }) {
  return <ClickableCard event={event}><BasicCard event={event} /></ClickableCard>;
}
