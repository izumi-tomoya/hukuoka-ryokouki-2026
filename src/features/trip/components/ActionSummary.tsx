import type { TripEvent } from "@/features/trip/types/trip";
import { MagazineCard } from "@/components/ui/MagazineCard";
import { cn } from "@/lib/utils";
import { cleanLocationName } from "@/features/trip/utils/locationCatalog";
import {
  BadgeCheck,
  CalendarCheck2,
  Clock,
  Footprints,
  MapPin,
  Route,
  Utensils,
} from "lucide-react";

interface Props {
  events: TripEvent[];
  isAdmin?: boolean;
  locationNames?: string[];
}

function eventLabel(event: TripEvent) {
  return event.foodName || event.title || "Untitled";
}

function actionText(event: TripEvent) {
  if (event.type === "transport") return "移動";
  if (event.type === "food") return "食事";
  if (event.type === "hotel") return "ホテル";
  if (event.type === "sightseeing") return "観光";
  if (event.isYatai) return "散策";
  return "行動";
}

function hasMapPoint(event: TripEvent, locationNames: string[]) {
  const names = [
    event.title,
    event.foodName,
    ...(event.transitSteps || []).map((step) => step.station),
    ...(event.yataiStops || []).map((stop) => stop.stop),
  ].filter((n): n is string => !!n);

  return names.some(name => {
    const cleaned = cleanLocationName(name);
    return locationNames.some(masterName => {
      const cleanedMaster = cleanLocationName(masterName);
      return cleaned.includes(cleanedMaster) || cleanedMaster.includes(cleaned);
    });
  });
}

function isReserved(event: TripEvent) {
  const text = [event.tagLabel, event.desc, event.foodDesc, event.highlight].filter(Boolean).join(" ");
  return event.isConfirmed || event.type === "food" || event.type === "hotel" || /予約|Reserved|予約済み|確認済み/i.test(text);
}

export default function ActionSummary({ events, isAdmin = false, locationNames = [] }: Props) {
  const visibleEvents = events.filter((event) => isAdmin || event.tag !== "surprise");
  const mappedCount = visibleEvents.filter(ev => hasMapPoint(ev, locationNames)).length;
  const reservedCount = visibleEvents.filter(isReserved).length;

  return (
    <MagazineCard className="min-w-0 border-primary/10 bg-card">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-primary">
            <CalendarCheck2 size={13} />
            Action List
          </div>
          <h2 className="break-words font-playfair text-2xl font-black text-foreground md:text-3xl">
            今日の行動を時間順に整理
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs font-black sm:flex">
          <div className="rounded-2xl bg-secondary/50 px-4 py-3 text-center text-muted-foreground">
            地図 {mappedCount}/{visibleEvents.length}
          </div>
          <div className="rounded-2xl bg-emerald-500/10 px-4 py-3 text-center text-emerald-600">
            予約 {reservedCount}
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        {visibleEvents.map((event, index) => {
          const mapped = hasMapPoint(event, locationNames);
          const reserved = isReserved(event);
          const routeCount = event.transitSteps?.length || 0;

          return (
            <div
              key={event.id || `${event.time}-${index}`}
              className="grid gap-3 rounded-[1.5rem] border border-border bg-background/60 p-4 sm:grid-cols-[5rem_1fr] sm:p-5"
            >
              <div className="flex items-center gap-3 sm:block">
                <div className="inline-flex min-h-10 items-center gap-2 rounded-full bg-primary/10 px-3 text-xs font-black text-primary sm:mb-2">
                  <Clock size={13} />
                  {event.time}
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">
                  {actionText(event)}
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <h3 className="break-words text-base font-black text-foreground">
                      {event.tag === "surprise" && !isAdmin ? "Surprise Spot" : eventLabel(event)}
                    </h3>
                    {(event.desc || event.foodDesc) && (
                      <p className="mt-1 line-clamp-2 text-sm font-medium leading-relaxed text-muted-foreground">
                        {event.foodDesc || event.desc}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 md:justify-end">
                    <span className={cn(
                      "inline-flex min-h-8 items-center gap-1.5 rounded-full px-3 text-[10px] font-black uppercase tracking-[0.12em]",
                      reserved ? "bg-emerald-500/10 text-emerald-600" : "bg-secondary text-muted-foreground"
                    )}>
                      <BadgeCheck size={12} />
                      {reserved ? "予約済み" : "確認"}
                    </span>
                    <span className={cn(
                      "inline-flex min-h-8 items-center gap-1.5 rounded-full px-3 text-[10px] font-black uppercase tracking-[0.12em]",
                      mapped ? "bg-sky-500/10 text-sky-600" : "bg-amber-500/10 text-amber-600"
                    )}>
                      <MapPin size={12} />
                      {mapped ? "地図反映" : "地図未登録"}
                    </span>
                  </div>
                </div>

                {(routeCount > 0 || event.type === "food") && (
                  <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">
                    {routeCount > 0 && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/60 px-3 py-1.5">
                        <Route size={12} />
                        移動 {routeCount} steps
                      </span>
                    )}
                    {event.type === "food" && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1.5 text-rose-500">
                        <Utensils size={12} />
                        店舗予定
                      </span>
                    )}
                    {event.type === "sightseeing" && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/60 px-3 py-1.5">
                        <Footprints size={12} />
                        散策
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </MagazineCard>
  );
}
