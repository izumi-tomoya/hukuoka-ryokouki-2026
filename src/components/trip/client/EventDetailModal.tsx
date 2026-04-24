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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EditEventForm } from './EditEventForm';

export default function EventDetailModal() {
  const { isOpen, selectedEvent, closeModal } = useModalStore();
  const { getNote, setNote, getBudget, setBudget } = useEventUserStore();
  const { data: session } = useSession();
  const isAdmin = !!session?.user?.isAdmin;
  const [isEditing, setIsEditing] = useState(false);

  const [noteText, setNoteText] = useState(() => selectedEvent?.id ? getNote(selectedEvent.id) : '');
  const [budgetAmount, setBudgetAmount] = useState<string>(() =>
    selectedEvent?.id ? getBudget(selectedEvent.id, selectedEvent.budget).toString() : '0'
  );
  const [isUserEditing, setIsUserEditing] = useState(false);

  if (!selectedEvent) return null;

  const isSurprise = selectedEvent.type === 'surprise';
  const isFood = selectedEvent.type === 'food';

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
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-[94%] max-w-xl max-h-[90vh] -translate-x-1/2 -translate-y-1/2 rounded-[2.5rem] bg-white shadow-2xl overflow-hidden flex flex-col">
          
          {/* Header */}
          <div className="relative h-40 bg-stone-100 flex items-end p-8">
            <div className="absolute top-6 right-6 flex gap-2">
              {isAdmin && (
                <button onClick={() => setIsEditing(!isEditing)} className="p-2.5 rounded-full bg-white/50 backdrop-blur hover:bg-white transition-all"><Edit2 size={16} /></button>
              )}
              <Dialog.Close className="p-2.5 rounded-full bg-white/50 backdrop-blur hover:bg-white transition-all"><X size={16} /></Dialog.Close>
            </div>
            <h2 className="font-playfair text-2xl font-bold text-stone-900">{isSurprise ? 'Secret' : selectedEvent.title}</h2>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {isEditing ? (
              <EditEventForm event={selectedEvent} onSuccess={() => setIsEditing(false)} />
            ) : (
              <>                <div className="flex gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-stone-100 rounded-full text-[10px] font-black uppercase text-stone-600"><Clock size={10}/>{selectedEvent.time}</div>
                  {selectedEvent.tagLabel && <div className="px-3 py-1 bg-rose-50 rounded-full text-[10px] font-black uppercase text-rose-600">{selectedEvent.tagLabel}</div>}
                </div>

                <MagazineCard padding="sm" className="bg-stone-50 border-stone-100">
                  <p className="text-sm text-stone-600 leading-relaxed">{isSurprise ? "当日まで秘密。ふたりの特別な時間が待っているよ。" : (isFood ? selectedEvent.foodDesc : selectedEvent.desc)}</p>
                </MagazineCard>

                {/* Journal & Budget */}
                <MagazineCard padding="sm">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2 text-stone-400"><FileText size={14}/><span className="text-[10px] font-black uppercase">Journal & Budget</span></div>
                    {isAdmin && (
                      <button onClick={() => isUserEditing ? handleSaveUserData() : setIsUserEditing(true)} className="text-[10px] font-bold text-rose-500">
                        {isUserEditing ? '保存' : '編集'}
                      </button>
                    )}
                  </div>                  {isUserEditing ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                         <JapaneseYen size={14} className="text-stone-400" />
                         <input type="number" value={budgetAmount} onChange={e => setBudgetAmount(e.target.value)} className="w-full p-2 text-sm border rounded-lg" placeholder="予算額" />
                      </div>
                      <textarea value={noteText} onChange={e => setNoteText(e.target.value)} className="w-full p-2 text-sm border rounded-lg" placeholder="思い出のメモ..." />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-bold text-stone-800">
                        <JapaneseYen size={14} /> {parseInt(budgetAmount, 10).toLocaleString()}
                      </div>
                      <p className="text-sm text-stone-700 italic">"{noteText || 'メモなし'}"</p>
                    </div>
                  )}
                </MagazineCard>

                {/* Highlight */}
                {selectedEvent.highlight && (
                  <MagazineCard padding="sm" className="bg-rose-50/50 border-rose-100">
                    <div className="flex items-center gap-2 text-rose-500 mb-2"><Star size={14} /><span className="text-[10px] font-black uppercase">Pro Advice</span></div>
                    <p className="text-sm font-bold text-rose-900">{selectedEvent.highlight}</p>
                  </MagazineCard>
                )}

                {/* Access */}
                {(selectedEvent.access || selectedEvent.locationUrl) && (
                  <MagazineCard padding="sm" className="space-y-4">
                    {/* ... (access code) */}
                  </MagazineCard>
                )}

              </>
            )}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
