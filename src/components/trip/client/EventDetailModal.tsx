'use client';
import { useState } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { useModalStore } from '@/lib/store/useModalStore';
import { useEventUserStore } from '@/lib/store/useEventUserStore';
import {
  X,
  MapPin,
  Clock,
  Star,
  Info,
  Navigation,
  ExternalLink,
  ChevronRight,
  Edit2,
  FileText,
  Save,
  JapaneseYen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EditEventForm } from './EditEventForm';
import { YataiStop } from '@/features/trip/types/trip';

export default function EventDetailModal() {
  const { isOpen, selectedEvent, closeModal } = useModalStore();
  const { getNote, setNote, getBudget, setBudget } = useEventUserStore();
  const [isEditing, setIsEditing] = useState(false);

  // 初期化関数を定義
  const [noteText, setNoteText] = useState(() =>
    selectedEvent?.id ? getNote(selectedEvent.id) : ''
  );
  const [budgetAmount, setBudgetAmount] = useState<string>(() =>
    selectedEvent?.id ? getBudget(selectedEvent.id, selectedEvent.budget).toString() : '0'
  );
  const [isUserEditing, setIsUserEditing] = useState(false);

  if (!selectedEvent) return null;

  const isFood = selectedEvent.type === 'food';
  const isSurprise = selectedEvent.type === 'surprise';
  const isYatai = selectedEvent.isYatai;

  const handleSaveUserData = () => {
    if (selectedEvent.id) {
      setNote(selectedEvent.id, noteText);
      const amount = parseInt(budgetAmount, 10);
      setBudget(selectedEvent.id, isNaN(amount) ? 0 : amount);
      setIsUserEditing(false);
    }
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeModal();
          setIsEditing(false);
          setIsUserEditing(false);
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-rose-900/30 backdrop-blur-md transition-all duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 flex flex-col w-[94%] max-w-2xl max-h-[92vh] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[32px] md:rounded-[40px] bg-white/97 shadow-2xl shadow-rose-300/20 backdrop-blur-xl ring-1 ring-rose-100/60 transition-all duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] focus:outline-none">
          {/* Header Image Area */}
          <div
            className={cn(
              'relative h-48 md:h-56 w-full shrink-0 overflow-hidden transition-all',
              isFood ? 'bg-rose-400' : isSurprise ? 'bg-stone-950' : 'bg-rose-300'
            )}
          >
            <div className="absolute inset-0 z-0 bg-linear-to-b from-black/40 via-black/10 to-transparent" />

            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
              <span className="mb-3 block text-[11px] font-black tracking-[5px] text-white/50 uppercase">
                {isSurprise ? 'Top Secret' : 'Event Detail'}
              </span>
              <Dialog.Title className="font-playfair text-2xl md:text-4xl font-extrabold text-white drop-shadow-lg tracking-widest leading-tight">
                {isSurprise ? '? ? ?' : isFood ? selectedEvent.foodName : selectedEvent.title}
              </Dialog.Title>
            </div>

            <div className="absolute right-6 top-6 z-20 flex gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/25 text-white backdrop-blur-md ring-1 ring-white/30 transition-all hover:bg-white/40 hover:scale-110 active:scale-90"
              >
                <Edit2 size={18} />
              </button>
              <Dialog.Close className="flex h-10 w-10 items-center justify-center rounded-full bg-white/25 text-white backdrop-blur-md ring-1 ring-white/30 transition-all hover:bg-white/40 hover:scale-110 active:scale-90">
                <X size={20} />
              </Dialog.Close>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-5 md:p-10 pt-0">
            <div className="relative -top-6 md:-top-10">
              <div className="rounded-[24px] md:rounded-[32px] bg-white p-7 md:p-12 shadow-xl shadow-rose-100/30 border border-rose-100/50">
                {isEditing ? (
                  <EditEventForm event={selectedEvent} onSuccess={() => setIsEditing(false)} />
                ) : (
                  <>
                    <div className="mb-10 flex items-center gap-3 md:gap-6 overflow-x-auto no-scrollbar py-1">
                      <div className="flex shrink-0 items-center gap-2 text-stone-600 bg-rose-50 px-4 py-2 rounded-full ring-1 ring-rose-100 shadow-xs whitespace-nowrap">
                        <Clock size={16} className="text-rose-400" />
                        <span className="text-[13px] font-bold tabular-nums tracking-tight">
                          {selectedEvent.time}
                        </span>
                      </div>
                      {!isSurprise && selectedEvent.tagLabel && (
                        <div className="shrink-0 rounded-full bg-rose-50 px-4 py-2 text-[10px] font-black tracking-[0.15em] text-rose-500 uppercase whitespace-nowrap ring-1 ring-rose-100">
                          {selectedEvent.tagLabel}
                        </div>
                      )}
                      {isSurprise && (
                        <div className="shrink-0 rounded-full bg-stone-900 px-4 py-2 text-[10px] font-black tracking-[0.2em] text-amber-500/80 uppercase whitespace-nowrap ring-1 ring-amber-500/20">
                          Classified
                        </div>
                      )}
                    </div>

                    <div className="mb-10">
                      {isSurprise ? (
                        <div className="space-y-4">
                          <p className="mx-auto max-w-50 text-[11px] leading-relaxed text-stone-500 font-medium italic">
                            &quot;The best things in life are the ones we never saw coming.&quot;
                          </p>

                          <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-stone-800/80 px-4 py-2 ring-1 ring-white/5 backdrop-blur-sm">
                            <p className="text-[14px] md:text-[15px] leading-relaxed text-white font-bold">
                              当日まで秘密。ふたりの特別な時間が待っているよ。
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-[15px] md:text-[16px] leading-relaxed text-stone-600 font-medium whitespace-pre-wrap">
                          {isFood ? selectedEvent.foodDesc : selectedEvent.desc}
                        </p>
                      )}
                    </div>

                    {!isSurprise && (
                      <>
                        {/* User Input Section (Notes & Budget) */}
                        <div className="mb-10 overflow-hidden rounded-[28px] bg-stone-50 p-6 md:p-8 ring-1 ring-stone-100 shadow-xs">
                          <div className="mb-6 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-stone-200">
                                <FileText size={18} className="text-stone-500" />
                              </div>
                              <span className="text-[12px] font-black tracking-wider text-stone-500 uppercase">
                                Personal Journal & Budget
                              </span>
                            </div>
                            {!isUserEditing ? (
                              <button
                                onClick={() => setIsUserEditing(true)}
                                className="text-[11px] font-bold text-rose-500 hover:text-rose-600 underline underline-offset-2"
                              >
                                編集する
                              </button>
                            ) : (
                              <button
                                onClick={handleSaveUserData}
                                className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 hover:text-emerald-700"
                              >
                                <Save size={12} />
                                完了
                              </button>
                            )}
                          </div>

                          <div className="space-y-6">
                            {/* Budget Input */}
                            <div className="flex items-center gap-4 border-b border-stone-200 pb-6">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
                                <JapaneseYen size={18} />
                              </div>
                              <div className="flex-1">
                                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">
                                  Budget / Spent
                                </p>
                                {isUserEditing ? (
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold text-stone-700">¥</span>
                                    <input
                                      type="number"
                                      value={budgetAmount}
                                      onChange={(e) => setBudgetAmount(e.target.value)}
                                      className="w-full bg-white rounded-lg border border-stone-200 px-3 py-1.5 text-lg font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                                      placeholder="0"
                                    />
                                  </div>
                                ) : (
                                  <p className="text-xl font-bold text-stone-800">
                                    ¥{parseInt(budgetAmount, 10).toLocaleString()}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Note Input */}
                            <div>
                              <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 text-center md:text-left">
                                Memories & Notes
                              </p>
                              {isUserEditing ? (
                                <textarea
                                  value={noteText}
                                  onChange={(e) => setNoteText(e.target.value)}
                                  className="w-full min-h-25 p-4 rounded-xl border border-stone-200 text-[14px] leading-relaxed text-stone-700 focus:outline-none focus:ring-2 focus:ring-rose-200 resize-none bg-white"
                                  placeholder="この場所での思い出や、気づいたことをメモしよう…"
                                />
                              ) : (
                                <p
                                  className={cn(
                                    'text-[13px] md:text-[14px] leading-relaxed',
                                    noteText
                                      ? 'text-stone-700 font-medium'
                                      : 'text-stone-400 italic'
                                  )}
                                >
                                  {noteText || 'メモはまだありません。'}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {selectedEvent.highlight && (
                          <div className="mb-10 overflow-hidden rounded-[28px] bg-linear-to-br from-rose-50 to-pink-50 p-6 md:p-8 ring-1 ring-rose-100/60 shadow-sm">
                            <div className="mb-3 flex items-center gap-2.5">
                              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-100">
                                <Star size={18} className="fill-rose-400 text-rose-400" />
                              </div>
                              <span className="text-[12px] font-black tracking-wider text-rose-600 uppercase">
                                Pro Advice
                              </span>
                            </div>
                            <p className="text-[13px] md:text-[14px] leading-relaxed text-rose-900/80 font-bold">
                              {selectedEvent.highlight}
                            </p>
                          </div>
                        )}

                        {(selectedEvent.access || selectedEvent.locationUrl) && (
                          <div className="space-y-6">
                            <div className="flex items-center gap-2.5 text-stone-800 mb-2">
                              <Navigation size={18} className="text-rose-400" />
                              <span className="text-[13px] font-black uppercase tracking-wider">
                                Access & Location
                              </span>
                            </div>

                            {selectedEvent.access && (
                              <div className="flex flex-wrap items-center gap-y-4 gap-x-3 p-6 rounded-2xl bg-rose-50/50 ring-1 ring-rose-100">
                                {selectedEvent.access.map((step: string, i: number) => (
                                  <div key={i} className="flex items-center gap-3">
                                    <span className="text-[13px] font-bold text-stone-700 leading-tight">
                                      {step}
                                    </span>
                                    {i < selectedEvent.access!.length - 1 && (
                                      <ChevronRight size={14} className="text-rose-200 shrink-0" />
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            {selectedEvent.locationUrl && (
                              <a
                                href={selectedEvent.locationUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-between rounded-2xl bg-rose-50 px-6 py-5 text-rose-600 transition-all hover:bg-rose-100 hover:shadow-md active:scale-[0.98]"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm transition-transform group-hover:scale-110">
                                    <MapPin size={20} />
                                  </div>
                                  <span className="text-[14px] font-bold whitespace-nowrap tracking-tight">
                                    Google Maps で開く
                                  </span>
                                </div>
                                <ExternalLink
                                  size={16}
                                  className="opacity-40 group-hover:opacity-100 transition-opacity shrink-0 ml-2"
                                />
                              </a>
                            )}
                          </div>
                        )}

                        {isYatai && selectedEvent.yataiStops && (
                          <div className="mt-10 space-y-6 border-t border-rose-100 pt-10">
                            <div className="flex items-center gap-2.5 text-stone-800 mb-4">
                              <Info size={18} className="text-amber-500" />
                              <span className="text-[13px] font-black uppercase tracking-wider">
                                Yatai Tour Stops
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {selectedEvent.yataiStops.map((stop: YataiStop, i: number) => (
                                <div
                                  key={i}
                                  className="flex gap-4 p-4 rounded-2xl bg-rose-50 hover:bg-rose-100 transition-colors"
                                >
                                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-rose-400 text-[12px] font-black text-white shadow-sm">
                                    {i + 1}
                                  </div>
                                  <div>
                                    <p className="text-[12px] font-bold text-stone-800">
                                      {stop.time} — {stop.stop}
                                    </p>
                                    <p className="text-[13px] text-stone-500 mt-1 leading-snug">
                                      {stop.desc}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-rose-50/60 p-5 md:p-8 border-t border-rose-100 text-center shrink-0">
            <button
              onClick={closeModal}
              className="w-full rounded-xl md:rounded-2xl py-4 md:py-5 text-[15px] font-bold text-white transition-all hover:shadow-xl active:scale-95 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #D4607A 0%, #B84060 100%)' }}
            >
              閉じる
            </button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
