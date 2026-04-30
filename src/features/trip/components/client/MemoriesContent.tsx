'use client';

import { useState } from 'react';
import { GourmetAward } from '@prisma/client';
import { Container } from '@/components/ui/Container';
import { MagazineCard } from '@/components/ui/MagazineCard';
import PhotoUploadButton from '@/features/trip/components/client/PhotoUploadButton';
import PhotoGallery from '@/features/trip/components/PhotoGallery';
import GourmetAwardCard from '@/features/trip/components/client/GourmetAward';
import BudgetDashboard from '@/features/trip/components/BudgetDashboard';
import AddAwardModal from './AddAwardModal';
import MemoryReel from './MemoryReel';
import TravelReportPanel from './TravelReportPanel';
import { Camera, Sparkles, Trophy, Play, Plus, Heart } from 'lucide-react';
import { BudgetStats } from '@/features/trip/utils/tripUtils';
import type { TripEvent } from '@/features/trip/types/trip';

interface Props {
  tripId: string;
  awards: GourmetAward[];
  budgetStats: BudgetStats;
  eventsWithPhotos: TripEvent[];
  allEvents: TripEvent[];
  isAdmin: boolean;
}

export default function MemoriesContent({ 
  tripId, 
  awards, 
  budgetStats, 
  eventsWithPhotos, 
  allEvents, 
  isAdmin 
}: Props) {
  const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);
  const [isReelOpen, setIsReelOpen] = useState(false);

  // 全ての写真をフラットな配列にする
  const allPhotos = eventsWithPhotos.flatMap(event => 
    (event.photos || []).map((p) => ({
      url: p.url,
      title: event.title || event.foodName,
      time: event.time
    }))
  );

  return (
    <Container className="pb-24 space-y-16 md:space-y-24 lg:space-y-32">
      {/* ─── Slideshow Trigger ─── */}
      {allPhotos.length > 0 && (
        <div className="flex justify-center md:-mb-12 lg:-mb-20">
          <button 
            onClick={() => setIsReelOpen(true)}
            className="group flex min-h-16 w-full max-w-sm items-center justify-center gap-4 rounded-full bg-zinc-900 px-5 py-4 text-white shadow-2xl transition-all hover:scale-105 active:scale-95 sm:w-auto sm:px-10 sm:py-6 border border-white/10"
          >
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white group-hover:rotate-12 transition-transform">
              <Play size={20} fill="currentColor" />
            </div>
            <div className="text-left">
              <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/50 mb-0.5">Experience</span>
              <span className="block text-sm font-black tracking-widest uppercase">Start Memory Reel</span>
            </div>
          </button>
        </div>
      )}

      {/* ─── Financial Dashboard ─── */}
      <section className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
        <BudgetDashboard stats={budgetStats} />
      </section>

      <section className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
        <TravelReportPanel
          awards={awards}
          budgetStats={budgetStats}
          allEvents={allEvents}
          photoCount={allPhotos.length}
        />
      </section>

      {/* ─── Gourmet Awards ─── */}
      <section>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 md:mb-12 px-0 sm:px-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 rounded-2xl bg-amber-500 flex items-center justify-center text-black shadow-lg shadow-amber-500/20">
              <Trophy size={22} />
            </div>
            <div className="min-w-0">
              <h2 className="text-2xl font-black text-foreground leading-none tracking-tight">Gourmet Awards</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.14em] sm:tracking-[0.2em] text-muted-foreground mt-1 leading-relaxed">Best Culinary Experiences</p>
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
            {awards.map(award => (
              <GourmetAwardCard key={award.id} award={award} isAdmin={isAdmin} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-border rounded-[3rem] bg-secondary/10">
            <Heart size={40} className="mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground font-medium italic">まだアワードが登録されていません。<br />旅の終わりに、最高のお店を選びましょう。</p>
          </div>
        )}
      </section>

      {/* ─── Photo Collection ─── */}
      <section>
        <div className="flex items-center gap-3 mb-8 md:mb-12 px-0 sm:px-2">
          <div className="h-10 w-10 shrink-0 rounded-2xl bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
            <Camera size={22} />
          </div>
          <div className="min-w-0">
            <h2 className="text-2xl font-black text-foreground leading-none tracking-tight">Photo Collection</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] sm:tracking-[0.2em] text-muted-foreground mt-1">Captured Moments</p>
          </div>
        </div>

        <div className="space-y-14 md:space-y-24">
          {/* Upload Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allEvents.map((event) => (
              <MagazineCard key={event.id} padding="sm" className="flex flex-col justify-between border-primary/10 hover:border-primary/30 transition-all group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary/60">{event.time}</span>
                    <Sparkles size={12} className="text-primary/20 group-hover:text-primary/40 transition-colors" />
                  </div>
                  <h3 className="font-bold text-foreground mb-6 line-clamp-1">{event.title || event.foodName}</h3>
                </div>
                <PhotoUploadButton eventId={event.id || ""} />
              </MagazineCard>
            ))}
          </div>

          {/* Gallery Display */}
          {eventsWithPhotos.length > 0 && (
            <div className="space-y-20 pt-10 border-t border-border">
              {eventsWithPhotos.map((event) => (
                <div key={event.id} className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-4 mb-6 md:mb-8">
                    <h3 className="break-words font-playfair text-2xl font-black text-foreground italic">{event.title || event.foodName}</h3>
                    <div className="h-px grow bg-border/50" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{event.time}</span>
                  </div>
                  <PhotoGallery photos={(event.photos || [])} eventId={event.id} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- Modals --- */}
      <AddAwardModal 
        tripId={tripId} 
        isOpen={isAwardModalOpen} 
        onClose={() => setIsAwardModalOpen(false)} 
      />
      <MemoryReel 
        photos={allPhotos} 
        isOpen={isReelOpen} 
        onClose={() => setIsReelOpen(false)} 
      />
    </Container>
  );
}
