import {
  Bus,
  ExternalLink,
  Eye,
  Home,
  JapaneseYen,
  MapPin,
  MessageSquareQuote,
  Moon,
  Route,
  ShoppingBag,
  Star,
  Utensils,
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { MagazineCard } from "@/components/ui/MagazineCard";
import AccessRow from "@/features/trip/components/AccessRow";
import ClickableCard from "@/features/trip/components/client/ClickableCard";
import ConfirmCheckbox from "@/features/trip/components/client/ConfirmCheckbox";
import { EventActionButtons } from "@/features/trip/components/client/EventActionButtons";
import { ExternalSpotInfo } from "@/features/trip/components/client/ExternalSpotInfo";
import { SafeLink } from "@/features/trip/components/client/SafeLink";
import YataiLiveTracker from "@/features/trip/components/client/YataiLiveTracker";
import PhotoGallery from "@/features/trip/components/PhotoGallery";
import WeatherStatsDisplay from "@/features/trip/components/WeatherStats";
import type { TripEvent } from "@/features/trip/types/trip";
import { getLocationCoordinates } from "@/features/trip/utils/locationCatalog";
import { isSecretEvent, maskSecretText } from "@/features/trip/utils/tripUtils";
import { getDirectionsUrl } from "@/lib/mapUtils";
import { cn } from "@/lib/utils";

const tagConfig: Record<string, { className: string; icon: React.ElementType }> = {
  food: { className: "bg-rose-500/10 text-rose-500 border-rose-500/20", icon: Utensils },
  transport: { className: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20", icon: Bus },
  sightseeing: { className: "bg-sky-500/10 text-sky-500 border-sky-500/20", icon: Eye },
  hotel: { className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", icon: Home },
  shopping: { className: "bg-pink-500/10 text-pink-500 border-pink-500/20", icon: ShoppingBag },
  surprise: { className: "bg-purple-500/10 text-purple-500 border-purple-500/20", icon: Star },
  night: { className: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20", icon: Moon },
};

function TagBadge({ tag, label }: { tag: string; label: string }) {
  const config = tagConfig[tag] ?? tagConfig.transport;
  const Icon = config.icon;
  return (
    <Badge
      variant="outline"
      className={cn(
        "mb-4 gap-2 rounded-full border px-3 py-1 text-[10px] font-black tracking-[0.2em] whitespace-nowrap uppercase transition-colors md:px-4 md:py-1.5",
        config.className,
      )}
    >
      <Icon size={12} />
      {label}
    </Badge>
  );
}

function BasicCard({
  event,
  isAdmin,
  previousLocation,
}: {
  event: TripEvent;
  isAdmin?: boolean;
  previousLocation?: string;
}) {
  const hasMemoir = !!(event.notes || (event.actualPhotos && event.actualPhotos.length > 0));
  const isSurprise = isSecretEvent(event, !!isAdmin);
  const isFood = event.type === "food";

  const coords = getLocationCoordinates(event.foodName || event.title || "");

  const destinationName = event.foodName || event.formalName || event.title || "";
  const directionsUrl = previousLocation ? getDirectionsUrl([previousLocation, destinationName]) : null;

  return (
    <MagazineCard className={cn("relative h-full overflow-hidden transition-all duration-500")}>
      <div className="relative z-10 mb-4 flex items-start justify-between md:mb-6">
        {event.tag && event.tagLabel ? <TagBadge tag={event.tag} label={event.tagLabel} /> : <div />}
        <div className="flex gap-2">
          {event.actualExpense !== undefined && event.actualExpense > 0 && (
            <div className="bg-secondary text-muted-foreground border-border flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold">
              <JapaneseYen size={10} />
              {event.actualExpense.toLocaleString()}
            </div>
          )}
          {isAdmin && event.id && (
            <div className="flex gap-2">
              <EventActionButtons event={event} />
              <ConfirmCheckbox eventId={event.id} initialConfirmed={!!event.isConfirmed} />
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10">
        <div className="items-start md:grid md:grid-cols-[1fr_auto] md:gap-8">
          <div className="min-w-0">
            <h3 className="font-playfair text-foreground mb-3 text-xl leading-snug font-black tracking-tight md:text-3xl">
              {isSurprise ? "✨ Surprise Spot" : maskSecretText(event.title || "", !!isAdmin)}
            </h3>
            <p className="text-muted-foreground mb-6 line-clamp-3 text-[13px] leading-relaxed font-medium md:text-base">
              {isSurprise
                ? "当日までのお楽しみ。ふたりの特別な時間が待っています。"
                : maskSecretText(event.desc || "", !!isAdmin)}
            </p>
          </div>

          {event.locationUrl && (isAdmin || !isSurprise) && (
            <div className="hidden md:block">
              <SafeLink
                href={event.locationUrl}
                className="border-border bg-background text-primary hover:bg-primary flex h-12 w-12 items-center justify-center rounded-full border shadow-sm transition-all hover:text-white"
              >
                <MapPin size={20} />
              </SafeLink>
            </div>
          )}
        </div>

        {event.isYatai && event.yataiStops && event.id && (
          <div className="mb-6 md:mb-8">
            <YataiLiveTracker stops={event.yataiStops} eventId={event.id} />
          </div>
        )}

        {/* HotPepper Gourmet Integration */}
        {isFood && (isAdmin || !isSurprise) && (
          <div className="animate-in fade-in slide-in-from-top-2 mb-8 duration-700">
            <ExternalSpotInfo
              name={maskSecretText(event.foodName || event.title || "", !!isAdmin)}
              lat={coords ? coords[0] : undefined}
              lng={coords ? coords[1] : undefined}
              category={event.type}
              address={event.desc}
              locationUrl={event.locationUrl}
              compact={false}
            />
          </div>
        )}

        <div className={cn(isFood && "md:grid md:grid-cols-2 md:gap-6")}>
          <PhotoGallery photos={event.photos || []} eventId={event.id} />

          {event.highlight && (
            <div className="mt-4 flex flex-col justify-center rounded-[2rem] border border-amber-100 bg-amber-50/50 p-4 md:mt-0 md:p-6">
              <div className="mb-2 flex items-center gap-2 text-[10px] font-black tracking-widest text-amber-600 uppercase">
                <Star size={12} /> Highlight
              </div>
              <p className="text-sm leading-relaxed font-bold text-amber-900 italic">
                &ldquo;{maskSecretText(event.highlight, !!isAdmin)}&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* Memoir Section */}
        {hasMemoir && (
          <div className="border-border animate-in fade-in mt-8 border-t pt-8 duration-700">
            <div className="mb-6 flex items-center gap-2">
              <div className="bg-border h-px grow" />
              <div className="border-border bg-secondary/50 flex items-center gap-2 rounded-full border px-3 py-1">
                <MessageSquareQuote size={12} className="text-primary" />
                <span className="text-muted-foreground text-[9px] font-black tracking-[0.3em] uppercase">
                  Memory Card
                </span>
              </div>
              <div className="bg-border h-px grow" />
            </div>

            {event.notes && (
              <p className="font-playfair text-foreground mb-6 px-4 text-center text-lg leading-relaxed italic md:text-2xl">
                &ldquo;{event.notes}&rdquo;
              </p>
            )}

            {event.actualPhotos && event.actualPhotos.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                {event.actualPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="border-border group/photo relative aspect-square overflow-hidden rounded-3xl border shadow-inner"
                  >
                    <Image
                      src={photo.url}
                      alt="Memory"
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover/photo:scale-110"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="border-border mt-8 flex flex-wrap items-center justify-between gap-4 border-t pt-6">
          <div className="flex items-center gap-4">
            {directionsUrl && (isAdmin || !isSurprise) && (
              <SafeLink
                href={directionsUrl}
                className="text-primary hover:text-primary/80 inline-flex items-center gap-2 text-[10px] font-black tracking-widest uppercase transition-colors"
              >
                <Route size={14} />
                {maskSecretText(previousLocation || "", !!isAdmin)} から
              </SafeLink>
            )}
            {event.locationUrl && (isAdmin || !isSurprise) && (
              <SafeLink
                href={event.locationUrl}
                className="text-muted-foreground hover:text-primary inline-flex items-center gap-2 text-[10px] font-black tracking-widest uppercase transition-colors"
              >
                <MapPin size={14} /> Maps
              </SafeLink>
            )}
            {isFood && event.locationUrl && (isAdmin || !isSurprise) && (
              <SafeLink
                href={event.locationUrl}
                className="inline-flex items-center gap-2 text-[10px] font-black tracking-widest text-rose-500 uppercase transition-colors hover:text-rose-600"
              >
                <ExternalLink size={14} /> Restaurant Web
              </SafeLink>
            )}
          </div>
          {event.access && <AccessRow chips={event.access.map((a) => maskSecretText(a, !!isAdmin))} />}
        </div>

        {event.weatherStats && (
          <div className="mt-6 md:mt-8">
            <WeatherStatsDisplay stats={event.weatherStats} />
          </div>
        )}
      </div>
    </MagazineCard>
  );
}

export default function EventCard({
  event,
  isAdmin,
  previousLocation,
}: {
  event: TripEvent;
  isAdmin?: boolean;
  previousLocation?: string;
}) {
  return (
    <ClickableCard event={event} previousLocation={previousLocation}>
      <BasicCard event={event} isAdmin={isAdmin} previousLocation={previousLocation} />
    </ClickableCard>
  );
}
