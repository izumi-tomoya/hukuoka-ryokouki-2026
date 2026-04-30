'use client';

import { useState, useTransition } from 'react';
import { Camera, MessageSquare, X, Send, Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { MagazineCard } from '@/components/ui/MagazineCard';
import { cn } from '@/lib/utils';
import { addPhotoToEvent } from '@/features/trip/api/tripActions';
import { TripEvent } from '@/features/trip/types/trip';

interface Props {
  events: TripEvent[];
}

export default function QuickCapturePanel({ events }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');
  const [note, setNote] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId || (!note && !imageUrl)) return;

    startTransition(async () => {
      // 本来は画像アップロード後にURLを取得しますが、ここではデモ的にURLを直接入れるか、
      // 既存のActionを呼び出します（既存のActionに合わせて調整が必要な場合があります）
      await addPhotoToEvent(selectedEventId, imageUrl || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb');
      setNote('');
      setImageUrl('');
      setIsOpen(false);
    });
  };

  return (
    <>
      {/* ─── Floating Action Button ─── */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 h-16 w-16 rounded-full bg-zinc-900 text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group border border-white/10"
      >
        <div className="absolute inset-0 rounded-full bg-primary opacity-0 group-hover:opacity-20 transition-opacity animate-ping" />
        <PlusIcon className={cn("transition-transform duration-500", isOpen ? "rotate-45" : "rotate-0")} />
      </button>

      {/* ─── Backdrop ─── */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ─── Panel ─── */}
      <div className={cn(
        "fixed inset-x-4 bottom-8 md:inset-x-auto md:right-8 md:w-[400px] z-[70] transition-all duration-500 ease-out",
        isOpen ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
      )}>
        <MagazineCard padding="lg" className="shadow-3xl border-white/10 bg-zinc-900 text-white overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Quick Memoir</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Selector */}
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-white/40">Which moment?</label>
              <select 
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:ring-1 focus:ring-primary transition-all"
              >
                {events.map(event => (
                  <option key={event.id} value={event.id} className="bg-zinc-900">
                    {event.time} - {event.title || event.foodName}
                  </option>
                ))}
              </select>
            </div>

            {/* Note Input */}
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-white/40">What happened?</label>
              <div className="relative">
                <textarea 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="今の気持ちを一言で..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-sm placeholder:text-white/20 focus:outline-hidden focus:ring-1 focus:ring-primary transition-all resize-none"
                />
                <MessageSquare size={14} className="absolute bottom-4 right-4 text-white/20" />
              </div>
            </div>

            {/* Photo Preview (Placeholder) */}
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-white/40">Add Photo</label>
              <div className="flex gap-3">
                <button 
                  type="button"
                  className="flex-1 flex flex-col items-center justify-center gap-2 py-6 rounded-2xl border-2 border-dashed border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50 transition-all text-white/60"
                >
                  <Camera size={24} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Camera</span>
                </button>
                <button 
                  type="button"
                  className="flex-1 flex flex-col items-center justify-center gap-2 py-6 rounded-2xl border-2 border-dashed border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50 transition-all text-white/60"
                >
                  <ImageIcon size={24} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Gallery</span>
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isPending || (!note && !imageUrl)}
              className="w-full h-14 rounded-2xl bg-primary text-black font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-98 disabled:opacity-30 disabled:scale-100 transition-all"
            >
              {isPending ? <Loader2 size={18} className="animate-spin" /> : <><Send size={16} /> Record Memory</>}
            </button>
          </form>
        </MagazineCard>
      </div>
    </>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
