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
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-md transition-all duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-[92%] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[32px] bg-white/90 shadow-2xl backdrop-blur-xl ring-1 ring-white/20 transition-all duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          {/* Header Image Area */}
          <div
            className={cn(
              'relative h-48 w-full overflow-hidden',
              isFood ? 'bg-orange-100' : isSurprise ? 'bg-purple-900' : 'bg-stone-100'
            )}
          >
            {/* Background pattern/glow */}
            {isSurprise ? (
              <div className="absolute inset-0 bg-linear-to-br from-purple-600/30 via-indigo-900/80 to-black/90" />
            ) : (
              <div className="absolute inset-0 bg-linear-to-br from-white/20 to-transparent" />
            )}

            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <span className="mb-2 block text-[10px] font-black tracking-[4px] text-white/50 uppercase">
                Event Detail
              </span>
              <Dialog.Title className="font-playfair text-2xl font-bold text-white drop-shadow-md">
                {isFood ? selectedEvent.foodName : selectedEvent.title || 'Surprise Event'}
              </Dialog.Title>
            </div>

            <Dialog.Close className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/10 text-white backdrop-blur-md transition-transform hover:scale-110 active:scale-90">
              <X size={20} />
            </Dialog.Close>
          </div>

          {/* Content Area */}
          <div className="max-h-[60vh] overflow-y-auto p-7 pt-0">
            <div className="relative -top-6">
              <div className="rounded-[24px] bg-white p-6 shadow-xl shadow-stone-200/40 border border-stone-50">
                {/* Meta info */}
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-stone-400">
                    <Clock size={14} />
                    <span className="text-[11px] font-bold tabular-nums">{selectedEvent.time}</span>
                  </div>
                  {selectedEvent.tagLabel && (
                    <div className="rounded-full bg-stone-100 px-3 py-1 text-[9px] font-black tracking-wider text-stone-500 uppercase">
                      {selectedEvent.tagLabel}
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="mb-8 text-[14px] leading-relaxed text-stone-600 font-medium">
                  {isFood ? selectedEvent.foodDesc : selectedEvent.desc}
                </p>

                {/* Highlight/Tip Section */}
                {selectedEvent.highlight && (
                  <div className="mb-8 overflow-hidden rounded-[20px] bg-linear-to-br from-amber-50 to-orange-50 p-5 ring-1 ring-amber-100">
                    <div className="mb-2 flex items-center gap-2">
                      <Star size={16} className="fill-amber-400 text-amber-400" />
                      <span className="text-[11px] font-black tracking-wider text-amber-700 uppercase">
                        Pro Advice
                      </span>
                    </div>
                    <p className="text-[12px] leading-relaxed text-amber-800/90 font-medium">
                      {selectedEvent.highlight}
                    </p>
                  </div>
                )}

                {/* Access / Navigation Section */}
                {(selectedEvent.access || selectedEvent.locationUrl) && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-stone-800 mb-1">
                      <Navigation size={15} />
                      <span className="text-[12px] font-bold">Access & Location</span>
                    </div>

                    {selectedEvent.access && (
                      <div className="flex flex-wrap items-center gap-2">
                        {selectedEvent.access.map((step, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="text-[11px] font-medium text-stone-500">{step}</span>
                            {i < selectedEvent.access!.length - 1 && (
                              <ChevronRight size={12} className="text-stone-300" />
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
                        className="flex items-center justify-between rounded-2xl bg-sky-50 px-5 py-4 text-sky-700 transition-all hover:bg-sky-100"
                      >
                        <div className="flex items-center gap-3">
                          <MapPin size={18} />
                          <span className="text-[13px] font-bold">Google Maps で開く</span>
                        </div>
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                )}

                {/* Yatai Stops */}
                {isYatai && selectedEvent.yataiStops && (
                  <div className="mt-6 space-y-4 border-t border-stone-100 pt-6">
                    <div className="flex items-center gap-2 text-stone-800 mb-3">
                      <Info size={15} />
                      <span className="text-[12px] font-bold">Yatai Tour Stops</span>
                    </div>
                    <div className="space-y-4">
                      {selectedEvent.yataiStops.map((stop, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-[10px] font-bold text-stone-500">
                            {i + 1}
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-stone-800">
                              {stop.time} — {stop.stop}
                            </p>
                            <p className="text-[12px] text-stone-500">{stop.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Area */}
          <div className="bg-stone-50/50 p-6 pt-0 text-center">
            <button
              onClick={closeModal}
              className="w-full rounded-2xl bg-stone-900 py-4 text-[14px] font-bold text-white transition-all hover:bg-stone-800 active:scale-95"
            >
              閉じる
            </button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
