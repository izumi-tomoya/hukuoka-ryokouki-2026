'use client';
import { Dialog } from '@base-ui/react/dialog';
import { useModalStore } from '@/lib/store/useModalStore';
import { X, MapPin, Clock, Star, Info, Navigation, ExternalLink, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function EventDetailModal() {
  const { isOpen, selectedEvent, closeModal } = useModalStore();

  if (!selectedEvent) return null;

  const isFood = selectedEvent.type === 'food';
  const isSurprise = selectedEvent.type === 'surprise';
  const isYatai = selectedEvent.isYatai;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-md transition-all duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 flex flex-col w-[94%] max-w-2xl max-h-[92vh] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[32px] md:rounded-[40px] bg-white/95 shadow-2xl backdrop-blur-xl ring-1 ring-white/20 transition-all duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] focus:outline-none">
          {/* Header Image Area - Fixed height */}
          <div
            className={cn(
              'relative h-48 md:h-56 w-full shrink-0 overflow-hidden transition-all',
              isFood ? 'bg-orange-600' : isSurprise ? 'bg-purple-900' : 'bg-stone-800'
            )}
          >
            {/* Dark overlay for readability */}
            <div className="absolute inset-0 z-0 bg-linear-to-b from-black/60 via-black/20 to-transparent" />

            {/* Background specific accents */}
            {isSurprise ? (
              <div className="absolute inset-0 bg-linear-to-br from-purple-600/30 via-indigo-900/80 to-black/90 opacity-60" />
            ) : isFood ? (
              <div className="absolute inset-0 bg-linear-to-br from-orange-400/20 to-transparent opacity-40" />
            ) : (
              <div className="absolute inset-0 bg-linear-to-br from-stone-400/10 to-transparent opacity-30" />
            )}

            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
              <span className="mb-3 block text-[11px] font-black tracking-[5px] text-white/60 uppercase">
                Event Detail
              </span>
              <Dialog.Title className="font-playfair text-2xl md:text-4xl font-extrabold text-white drop-shadow-2xl tracking-tight leading-tight">
                {isFood ? selectedEvent.foodName : selectedEvent.title || 'Surprise Event'}
              </Dialog.Title>
            </div>

            <Dialog.Close className="absolute right-6 top-6 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md ring-1 ring-white/20 transition-all hover:bg-white/20 hover:scale-110 active:scale-90">
              <X size={20} />
            </Dialog.Close>
          </div>

          {/* Content Area - Scrollable */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-5 md:p-10 pt-0">
            <div className="relative -top-6 md:-top-10">
              <div className="rounded-[24px] md:rounded-[32px] bg-white p-7 md:p-12 shadow-2xl shadow-stone-200/40 border border-stone-100">
                {/* Meta info */}
                <div className="mb-10 flex items-center gap-3 md:gap-6 overflow-x-auto no-scrollbar py-1">
                  <div className="flex shrink-0 items-center gap-2 text-stone-600 bg-stone-50 px-4 py-2 rounded-full ring-1 ring-stone-100 shadow-xs whitespace-nowrap">
                    <Clock size={16} className="text-amber-500" />
                    <span className="text-[13px] font-bold tabular-nums tracking-tight">{selectedEvent.time}</span>
                  </div>
                  {selectedEvent.tagLabel && (
                    <div className="shrink-0 rounded-full bg-stone-100/80 px-4 py-2 text-[10px] font-black tracking-[0.15em] text-stone-500 uppercase whitespace-nowrap">
                      {selectedEvent.tagLabel}
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="mb-10 text-[15px] md:text-[16px] leading-relaxed text-stone-600 font-medium whitespace-pre-wrap">
                  {isFood ? selectedEvent.foodDesc : selectedEvent.desc}
                </p>

                {/* Highlight/Tip Section */}
                {selectedEvent.highlight && (
                  <div className="mb-10 overflow-hidden rounded-[28px] bg-linear-to-br from-amber-50 to-orange-50 p-6 md:p-8 ring-1 ring-amber-100/50 shadow-sm">
                    <div className="mb-3 flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-400/20">
                        <Star size={18} className="fill-amber-500 text-amber-500" />
                      </div>
                      <span className="text-[12px] font-black tracking-wider text-amber-700 uppercase">
                        Pro Advice
                      </span>
                    </div>
                    <p className="text-[13px] md:text-[14px] leading-relaxed text-amber-900/90 font-bold">
                      {selectedEvent.highlight}
                    </p>
                  </div>
                )}

                {/* Access / Navigation Section */}
                {(selectedEvent.access || selectedEvent.locationUrl) && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2.5 text-stone-800 mb-2">
                      <Navigation size={18} className="text-sky-500" />
                      <span className="text-[13px] font-black uppercase tracking-wider">
                        Access & Location
                      </span>
                    </div>

                    {selectedEvent.access && (
                      <div className="flex flex-wrap items-center gap-y-4 gap-x-3 p-6 rounded-2xl bg-stone-50/50 ring-1 ring-stone-100">
                        {selectedEvent.access.map((step, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <span className="text-[13px] font-bold text-stone-700 leading-tight">
                              {step}
                            </span>
                            {i < selectedEvent.access!.length - 1 && (
                              <ChevronRight size={14} className="text-stone-300 shrink-0" />
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
                        className="group flex items-center justify-between rounded-2xl bg-sky-50 px-6 py-5 text-sky-700 transition-all hover:bg-sky-100 hover:shadow-md active:scale-[0.98]"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm transition-transform group-hover:scale-110">
                            <MapPin size={20} />
                          </div>
                          <span className="text-[14px] font-bold whitespace-nowrap tracking-tight">Google Maps で開く</span>
                        </div>
                        <ExternalLink size={16} className="opacity-40 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                      </a>
                    )}
                  </div>
                )}

                {/* Yatai Stops */}
                {isYatai && selectedEvent.yataiStops && (
                  <div className="mt-10 space-y-6 border-t border-stone-100 pt-10">
                    <div className="flex items-center gap-2.5 text-stone-800 mb-4">
                      <Info size={18} className="text-amber-500" />
                      <span className="text-[13px] font-black uppercase tracking-wider">
                        Yatai Tour Stops
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedEvent.yataiStops.map((stop, i) => (
                        <div
                          key={i}
                          className="flex gap-4 p-4 rounded-2xl bg-stone-50 hover:bg-stone-100 transition-colors"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-[12px] font-black text-white shadow-sm">
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
              </div>
            </div>
          </div>

          {/* Footer Area - Fixed at bottom */}
          <div className="bg-stone-50/80 p-5 md:p-8 border-t border-stone-100 text-center shrink-0">
            <button
              onClick={closeModal}
              className="w-full rounded-xl md:rounded-2xl bg-stone-900 py-4 md:py-5 text-[15px] font-bold text-white transition-all hover:bg-black hover:shadow-xl active:scale-95 shadow-lg"
            >
              閉じる
            </button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
