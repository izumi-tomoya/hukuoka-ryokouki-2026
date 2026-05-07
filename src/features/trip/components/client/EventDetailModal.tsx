'use client';
import { useState } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { useModalStore } from '@/lib/store/useModalStore';
import { useEventUserStore } from '@/lib/store/useEventUserStore';
import { useSession } from 'next-auth/react';
import { MagazineCard } from '@/components/ui/MagazineCard';
import {
  X,
  MapPin,
  Clock,
  Star,
  Edit2,
  FileText,
  JapaneseYen,
  Route,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EditEventForm } from './EditEventForm';
import TransitTimeline from '../TransitTimeline';
import PhotoGallery from '../PhotoGallery';
import { ExternalSpotInfo } from './ExternalSpotInfo';

export default function EventDetailModal() {
  const { isOpen, selectedEvent, closeModal, tripTips } = useModalStore();
  const { getNote, setNote, getBudget, setBudget } = useEventUserStore();
  const { data: session } = useSession();
  const isAdmin = !!session?.user?.isAdmin;
  const [isEditing, setIsEditing] = useState(false);

  // ステートの初期値を selectedEvent に基づくように戻す
  const [noteText, setNoteText] = useState(() => selectedEvent?.id ? getNote(selectedEvent.id) : '');
  const [budgetAmount, setBudgetAmount] = useState<string>(() =>
    selectedEvent?.id ? getBudget(selectedEvent.id, selectedEvent.budget).toString() : '0'
  );
  const [isUserEditing, setIsUserEditing] = useState(false);

  if (!selectedEvent) return null;

  const isSurpriseTag = selectedEvent.tag === 'surprise';
  const isFood = selectedEvent.type === 'food';
  const shouldShowExternalSpotInfo = ['food', 'hotel', 'sightseeing', 'shopping'].includes(selectedEvent.type);

  const handleSaveUserData = () => {
    if (selectedEvent.id) {
      setNote(selectedEvent.id, noteText);
      const amount = parseInt(budgetAmount, 10);
      setBudget(selectedEvent.id, isNaN(amount) ? 0 : amount);
      setIsUserEditing(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => { if (!open) { closeModal(); setIsEditing(false); setIsUserEditing(false); } }}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-stone-950/20 backdrop-blur-sm" />
        <Dialog.Popup 
          key={selectedEvent?.id}
          className="fixed left-1/2 top-1/2 z-50 w-[94%] max-w-xl max-h-[90vh] -translate-x-1/2 -translate-y-1/2 rounded-[2.5rem] bg-card text-card-foreground shadow-2xl overflow-hidden flex flex-col border border-border"
        >
          
          {/* Header */}
          <div className="relative h-40 bg-secondary flex items-end p-8">
            <div className="absolute top-6 right-6 flex gap-2">
              {isAdmin && (
                <button onClick={() => setIsEditing(!isEditing)} className="p-2.5 rounded-full bg-background/50 backdrop-blur hover:bg-background transition-all border border-border/50"><Edit2 size={16} /></button>
              )}
              <Dialog.Close className="p-2.5 rounded-full bg-background/50 backdrop-blur hover:bg-background transition-all border border-border/50"><X size={16} /></Dialog.Close>
            </div>
            <h2 className="font-playfair text-2xl font-bold text-foreground">
              {(!isAdmin && isSurpriseTag) ? '✨ Surprise Spot' : selectedEvent.title}
            </h2>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {isEditing ? (
              <EditEventForm event={selectedEvent} onSuccess={() => setIsEditing(false)} />
            ) : (
              <>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-secondary rounded-full text-[10px] font-black uppercase text-muted-foreground"><Clock size={10}/>{selectedEvent.time}</div>
                  {selectedEvent.tagLabel && <div className="px-3 py-1 bg-primary/10 rounded-full text-[10px] font-black uppercase text-primary border border-primary/20">{selectedEvent.tagLabel}</div>}
                </div>

                <MagazineCard padding="sm" className="bg-secondary/30 border-border">
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    {(!isAdmin && isSurpriseTag) 
                      ? "当日まで秘密。ふたりの特別な時間が待っているよ。" 
                      : (isFood ? selectedEvent.foodDesc : selectedEvent.desc)}
                  </p>
                </MagazineCard>

                {/* External / location info */}
                {shouldShowExternalSpotInfo && (selectedEvent.foodName || selectedEvent.title) && (
                  <ExternalSpotInfo
                    name={selectedEvent.foodName || selectedEvent.title || ""}
                    category={selectedEvent.type}
                    description={isFood ? selectedEvent.foodDesc || selectedEvent.desc : selectedEvent.desc}
                    locationUrl={selectedEvent.locationUrl}
                  />
                )}

                {/* Related Tips for this specific shop/event */}
                {tripTips && tripTips.length > 0 && (
                  <div className="space-y-3">
                    {tripTips.filter(tip => {
                      const eventName = (selectedEvent.foodName || selectedEvent.title || "").toLowerCase();
                      const venue = (tip.venue || "").toLowerCase();
                      const tipTitle = (tip.title || "").toLowerCase();
                      return (venue && eventName.includes(venue)) || 
                             (tipTitle && eventName.includes(tipTitle)) || 
                             (venue && venue.includes(eventName));
                    }).map((tip, idx) => (
                      <MagazineCard key={idx} padding="sm" className={cn("border-l-4", tip.isWarning ? "border-l-rose-500 bg-rose-50/10" : "border-l-amber-400 bg-amber-50/10")}>
                        <div className="flex items-start gap-3">
                          {tip.isWarning ? (
                            <AlertTriangle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                          ) : (
                            <Lightbulb size={16} className="text-amber-500 shrink-0 mt-0.5" />
                          )}
                          <div className="min-w-0">
                            <div className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1">
                              {tip.isWarning ? "Attention" : "Pro Advice"}
                            </div>
                            <div className="text-xs font-bold text-foreground mb-1">{tip.title}</div>
                            <p className="text-[11px] text-muted-foreground leading-relaxed italic">{tip.body}</p>
                          </div>
                        </div>
                      </MagazineCard>
                    ))}
                  </div>
                )}

                {/* Journal & Budget */}
                <MagazineCard padding="sm">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2 text-muted-foreground"><FileText size={14}/><span className="text-[10px] font-black uppercase tracking-widest">Journal & Budget</span></div>
                    {isAdmin && (
                      <button onClick={() => isUserEditing ? handleSaveUserData() : setIsUserEditing(true)} className="text-[10px] font-bold text-primary hover:text-primary/80 transition-colors">
                        {isUserEditing ? '保存' : '編集'}
                      </button>
                    )}
                  </div>
                  {isUserEditing ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                         <JapaneseYen size={14} className="text-muted-foreground" />
                         <input type="number" value={budgetAmount} onChange={e => setBudgetAmount(e.target.value)} className="w-full p-3 text-sm bg-background border border-border rounded-xl v2-focus" placeholder="予算額" />
                      </div>
                      <textarea value={noteText} onChange={e => setNoteText(e.target.value)} className="w-full p-3 text-sm bg-background border border-border rounded-xl resize-none v2-focus" rows={3} placeholder="思い出のメモ..." />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                        <JapaneseYen size={14} className="text-primary" /> {parseInt(budgetAmount, 10).toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground italic">&ldquo;{noteText || 'メモなし'}&rdquo;</p>
                    </div>
                  )}
                </MagazineCard>

                {/* Highlight */}
                {selectedEvent.highlight && (isAdmin || !isSurpriseTag) && (
                  <MagazineCard padding="sm" className="bg-primary/5 border-primary/20">
                    <div className="flex items-center gap-2 text-primary mb-2"><Star size={14} /><span className="text-[10px] font-black uppercase tracking-widest">Pro Advice</span></div>
                    <p className="text-sm font-bold text-foreground">{selectedEvent.highlight}</p>
                  </MagazineCard>
                )}

                {/* Transit Timeline */}
                {selectedEvent.transitSteps && selectedEvent.transitSteps.length > 0 && (isAdmin || !isSurpriseTag) && (
                  <MagazineCard padding="sm" className="bg-secondary/20 border-border">
                    <div className="flex items-center gap-2 text-muted-foreground mb-4">
                      <Route size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Transit Route</span>
                    </div>
                    <TransitTimeline steps={selectedEvent.transitSteps} isAdmin={isAdmin} />
                  </MagazineCard>
                )}

                {/* Access */}
                {(selectedEvent.access || selectedEvent.locationUrl) && (isAdmin || !isSurpriseTag) && (
                  <MagazineCard padding="sm" className="space-y-4">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <MapPin size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Access & Location</span>
                    </div>
                    {selectedEvent.access && selectedEvent.access.map((line, idx) => (
                      <p key={idx} className="text-sm text-muted-foreground">{line}</p>
                    ))}
                    {selectedEvent.locationUrl && (isAdmin || !isSurpriseTag) && (
                      <a 
                        href={selectedEvent.locationUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
                      >
                        Google Maps で見る
                        <JapaneseYen size={12} className="rotate-45" />
                      </a>
                    )}
                    </MagazineCard>
                    )}

                    {/* Photos */}
                    <div className="pt-6 border-t border-border">
                      <PhotoGallery photos={selectedEvent.photos || []} eventId={selectedEvent.id} />
                    </div>
                    </>
                    )}
                    </div>

        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
