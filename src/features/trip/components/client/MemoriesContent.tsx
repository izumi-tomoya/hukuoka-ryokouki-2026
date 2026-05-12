"use client";

import type { GourmetAward } from "@prisma/client";
import { Camera, Film, Heart, Images, Play, Plus, Sparkles, Trophy } from "lucide-react";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { MagazineCard } from "@/components/ui/MagazineCard";
import BudgetDashboard from "@/features/trip/components/BudgetDashboard";
import GourmetAwardCard from "@/features/trip/components/client/GourmetAward";
import PhotoUploadButton from "@/features/trip/components/client/PhotoUploadButton";
import PhotoGallery from "@/features/trip/components/PhotoGallery";
import type { TripEvent } from "@/features/trip/types/trip";
import type { InsightEvent } from "@/features/trip/utils/tripInsights";
import { maskSecretText } from "@/features/trip/utils/tripUtils";
import type { BudgetStats } from "@/features/trip/utils/tripUtils";
import AddAwardModal from "./AddAwardModal";
import MemoryReel, { type MemoryReelPhoto } from "./MemoryReel";
import SettlementPanel from "./SettlementPanel";
import TemperatureTimeline from "./TemperatureTimeline";
import TravelReportPanel from "./TravelReportPanel";

interface Props {
  tripId: string;
  tripSlug: string;
  awards: GourmetAward[];
  budgetStats: BudgetStats;
  eventsWithPhotos: TripEvent[];
  allEvents: TripEvent[];
  insightEvents: InsightEvent[];
  albumPhotos: MemoryReelPhoto[];
  isAdmin: boolean;
}

export default function MemoriesContent({
  tripId,
  tripSlug,
  awards,
  budgetStats,
  eventsWithPhotos,
  allEvents,
  insightEvents,
  albumPhotos,
  isAdmin,
}: Props) {
  const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);
  const [isReelOpen, setIsReelOpen] = useState(false);

  return (
    <Container className="pb-24 space-y-16 md:space-y-24 lg:space-y-32">
      <section className="animate-in fade-in slide-in-from-bottom-6 duration-1000 space-y-6">
        <BudgetDashboard stats={budgetStats} />

        {albumPhotos.length > 0 && (
          <MagazineCard
            padding="lg"
            className="overflow-hidden border-amber-500/20 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.18),transparent_32%),linear-gradient(135deg,rgba(24,24,27,1),rgba(39,39,42,0.92))] text-white"
          >
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_340px] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-amber-200">
                  <Film size={12} />
                  Financial Overview Bonus
                </div>
                <h3 className="mt-5 font-playfair text-4xl font-black italic leading-none tracking-tight md:text-5xl">
                  旅のハイライトをそのまま流せる
                  <br />
                  Memory Reel
                </h3>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
                  お金の記録だけで終わらせず、その日どこで何をしたかを写真とキャプションで振り返れるスライドショーに戻した。
                  ここから全画面で再生できる。
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white/55">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2">
                    <Images size={14} /> {albumPhotos.length} Frames
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2">
                    <Sparkles size={14} /> Date / Place / Story
                  </span>
                </div>

                <button
                  onClick={() => setIsReelOpen(true)}
                  className="mt-8 inline-flex min-h-12 items-center gap-4 rounded-full bg-white px-6 py-3 text-black shadow-xl transition-all hover:scale-[1.02] active:scale-95"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-black">
                    <Play size={14} fill="currentColor" />
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.22em]">Play Memory Reel</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
                {albumPhotos.slice(0, 4).map((photo, index) => (
                  <div
                    key={`${photo.url}-${index}`}
                    className={`group relative overflow-hidden rounded-[1.75rem] border border-white/10 ${index === 0 ? "col-span-2 aspect-[16/10]" : "aspect-[4/5]"}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.url}
                      alt={photo.title || "Memory preview"}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-3">
                      <p className="truncate text-[9px] font-black uppercase tracking-[0.18em] text-amber-200">
                        {photo.dayLabel || photo.dateLabel || "Moment"}
                      </p>
                      <p className="mt-1 line-clamp-2 text-sm font-semibold text-white">
                        {photo.title || photo.location || "Travel Memory"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </MagazineCard>
        )}
      </section>

      <section className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
        <SettlementPanel tripId={tripId} events={insightEvents} />
      </section>

      <section className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
        <TemperatureTimeline tripId={tripId} />
      </section>

      <section className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
        <TravelReportPanel
          tripId={tripId}
          tripSlug={tripSlug}
          awards={awards}
          budgetStats={budgetStats}
          allEvents={allEvents}
          photoCount={albumPhotos.length}
        />
      </section>

      <section>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 md:mb-12 px-0 sm:px-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 rounded-2xl bg-amber-500 flex items-center justify-center text-black shadow-lg shadow-amber-500/20">
              <Trophy size={22} />
            </div>
            <div className="min-w-0">
              <h2 className="text-2xl font-black text-foreground leading-none tracking-tight">Gourmet Awards</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.14em] sm:tracking-[0.2em] text-muted-foreground mt-1 leading-relaxed">
                Best Culinary Experiences
              </p>
            </div>
          </div>
          {isAdmin && (
            <button
              onClick={() => setIsAwardModalOpen(true)}
              className="group flex min-h-12 w-full items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-card border border-border text-[10px] font-black uppercase tracking-[0.14em] hover:border-primary hover:text-primary transition-all shadow-sm sm:w-auto sm:tracking-widest"
            >
              <Plus size={14} /> Add Award
            </button>
          )}
        </div>

        {awards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {awards.map((award) => (
              <GourmetAwardCard key={award.id} award={award} isAdmin={isAdmin} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-border rounded-[3rem] bg-secondary/10">
            <Heart size={40} className="mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground font-medium italic">
              まだアワードが登録されていません。
              <br />
              旅の終わりに、最高のお店を選びましょう。
            </p>
          </div>
        )}
      </section>

      <section>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-8 md:mb-12 px-0 sm:px-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 rounded-2xl bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
              <Camera size={22} />
            </div>
            <div className="min-w-0">
              <h2 className="text-2xl font-black text-foreground leading-none tracking-tight">Photo Collection</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.14em] sm:tracking-[0.2em] text-muted-foreground mt-1">
                Captured Moments
              </p>
            </div>
          </div>

          {albumPhotos.length > 0 && (
            <button
              onClick={() => setIsReelOpen(true)}
              className="group flex min-h-12 w-full items-center justify-center gap-4 rounded-2xl bg-zinc-900 px-6 py-3 text-white shadow-xl transition-all hover:scale-[1.02] active:scale-95 sm:w-auto border border-white/10"
            >
              <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-white group-hover:rotate-12 transition-transform">
                <Play size={14} fill="currentColor" />
              </div>
              <span className="text-[10px] font-black tracking-widest uppercase">Start Memory Reel</span>
            </button>
          )}
        </div>

        <div className="space-y-14 md:space-y-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allEvents.map((event) => (
              <MagazineCard
                key={event.id}
                padding="sm"
                className="flex flex-col justify-between border-primary/10 hover:border-primary/30 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary/60">
                      {event.time}
                    </span>
                    <Sparkles size={12} className="text-primary/20 group-hover:text-primary/40 transition-colors" />
                  </div>
                  <h3 className="font-bold text-foreground mb-6 line-clamp-1">
                    {maskSecretText(event.title || event.foodName || "", isAdmin)}
                  </h3>
                </div>
                <PhotoUploadButton eventId={event.id || ""} />
              </MagazineCard>
            ))}
          </div>

          {eventsWithPhotos.length > 0 && (
            <div className="space-y-20 pt-10 border-t border-border">
              {eventsWithPhotos.map((event) => (
                <div key={event.id} className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-4 mb-6 md:mb-8">
                    <h3 className="break-words font-playfair text-2xl font-black text-foreground italic">
                      {maskSecretText(event.title || event.foodName || "", isAdmin)}
                    </h3>
                    <div className="h-px grow bg-border/50" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      {event.time}
                    </span>
                  </div>
                  <PhotoGallery photos={event.photos || []} eventId={event.id} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <AddAwardModal tripId={tripId} isOpen={isAwardModalOpen} onClose={() => setIsAwardModalOpen(false)} />
      {isReelOpen && <MemoryReel photos={albumPhotos} isOpen={isReelOpen} onClose={() => setIsReelOpen(false)} />}
    </Container>
  );
}
