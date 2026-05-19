"use client";
import { Dialog } from "@base-ui/react/dialog";
import { AlertTriangle, Clock, Edit2, FileText, JapaneseYen, Lightbulb, MapPin, Route, Star, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { MagazineCard } from "@/components/ui/MagazineCard";
import { getLocationCoordinates } from "@/features/trip/utils/locationCatalog";
import { isSecretEvent, maskSecretText } from "@/features/trip/utils/tripUtils";
import { getDirectionsUrl } from "@/lib/mapUtils";
import { useEventUserStore } from "@/lib/store/useEventUserStore";
import { useModalStore } from "@/lib/store/useModalStore";
import { cn } from "@/lib/utils";
import PhotoGallery from "../PhotoGallery";
import TransitTimeline from "../TransitTimeline";
import { EditEventForm } from "./EditEventForm";
import { ExternalSpotInfo } from "./ExternalSpotInfo";

export default function EventDetailModal() {
  const { isOpen, selectedEvent, closeModal, tripTips, previousLocation } = useModalStore();
  const { getNote, setNote, getBudget, setBudget } = useEventUserStore();
  const { data: session } = useSession();
  const isAdmin = !!session?.user?.isAdmin;
  const [isEditing, setIsEditing] = useState(false);

  // ステートの初期値を selectedEvent に基づくように戻す
  const [noteText, setNoteText] = useState(() => (selectedEvent?.id ? getNote(selectedEvent.id) : ""));
  const [budgetAmount, setBudgetAmount] = useState<string>(() =>
    selectedEvent?.id ? getBudget(selectedEvent.id, selectedEvent.budget).toString() : "0",
  );
  const [isUserEditing, setIsUserEditing] = useState(false);

  if (!selectedEvent) return null;

  const isSurprise = isSecretEvent(selectedEvent, isAdmin);
  const isFood = selectedEvent.type === "food";
  const shouldShowExternalSpotInfo = ["food", "hotel", "sightseeing", "shopping"].includes(selectedEvent.type);
  const coords = getLocationCoordinates(selectedEvent.foodName || selectedEvent.title || "");

  const destinationName = selectedEvent.foodName || selectedEvent.formalName || selectedEvent.title || "";
  const directionsUrl = previousLocation ? getDirectionsUrl([previousLocation, destinationName]) : null;

  // Google Maps Iframe URL
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const locationName = selectedEvent.foodName || selectedEvent.title || "";
  const mapSearchUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(locationName)}`;

  const handleSaveUserData = () => {
    if (selectedEvent.id) {
      setNote(selectedEvent.id, noteText);
      const amount = parseInt(budgetAmount, 10);
      setBudget(selectedEvent.id, Number.isNaN(amount) ? 0 : amount);
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
        <Dialog.Backdrop className="fixed inset-0 z-[1000] bg-stone-950/20 backdrop-blur-sm" />
        <Dialog.Popup
          key={selectedEvent?.id}
          className="bg-card text-card-foreground border-border fixed top-1/2 left-1/2 z-[1001] flex max-h-[90vh] w-[94%] max-w-xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[2.5rem] border shadow-2xl"
        >
          {/* Header */}
          <div className="bg-secondary relative flex h-40 items-end p-8">
            <div className="absolute top-6 right-6 flex gap-2">
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-background/50 hover:bg-background border-border/50 rounded-full border p-2.5 backdrop-blur transition-all"
                >
                  <Edit2 size={16} />
                </button>
              )}
              <Dialog.Close className="bg-background/50 hover:bg-background border-border/50 rounded-full border p-2.5 backdrop-blur transition-all">
                <X size={16} />
              </Dialog.Close>
            </div>
            <h2 className="font-playfair text-foreground text-2xl font-bold">
              {!isAdmin && isSurprise ? "✨ Surprise Spot" : maskSecretText(selectedEvent.title || "", isAdmin)}
            </h2>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-6 overflow-y-auto p-6">
            {isEditing ? (
              <EditEventForm event={selectedEvent} onSuccess={() => setIsEditing(false)} />
            ) : (
              <>
                <div className="flex gap-2">
                  <div className="bg-secondary text-muted-foreground flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase">
                    <Clock size={10} />
                    {selectedEvent.time}
                  </div>
                  {selectedEvent.tagLabel && (
                    <div className="bg-primary/10 text-primary border-primary/20 rounded-full border px-3 py-1 text-[10px] font-black uppercase">
                      {selectedEvent.tagLabel}
                    </div>
                  )}
                </div>

                <MagazineCard padding="sm" className="bg-secondary/30 border-border">
                  <p className="text-muted-foreground text-sm leading-relaxed italic">
                    {!isAdmin && isSurprise
                      ? "当日まで秘密。ふたりの特別な時間が待っているよ。"
                      : maskSecretText(isFood ? selectedEvent.foodDesc || "" : selectedEvent.desc || "", isAdmin)}
                  </p>
                </MagazineCard>

                {/* External / location info */}
                {shouldShowExternalSpotInfo &&
                  (isAdmin || !isSurprise) &&
                  (selectedEvent.foodName || selectedEvent.title) && (
                    <ExternalSpotInfo
                      name={maskSecretText(selectedEvent.foodName || selectedEvent.title || "", isAdmin)}
                      lat={coords ? coords[0] : undefined}
                      lng={coords ? coords[1] : undefined}
                      category={selectedEvent.type}
                      description={maskSecretText(
                        isFood ? selectedEvent.foodDesc || selectedEvent.desc || "" : selectedEvent.desc || "",
                        isAdmin,
                      )}
                      locationUrl={selectedEvent.locationUrl}
                    />
                  )}

                {/* Related Tips for this specific shop/event */}
                {tripTips && tripTips.length > 0 && (
                  <div className="space-y-3">
                    {tripTips
                      .filter((tip) => {
                        const eventName = (selectedEvent.foodName || selectedEvent.title || "").toLowerCase();
                        const venue = (tip.venue || "").toLowerCase();
                        const tipTitle = (tip.title || "").toLowerCase();
                        return (
                          (venue && eventName.includes(venue)) ||
                          (tipTitle && eventName.includes(tipTitle)) ||
                          venue?.includes(eventName)
                        );
                      })
                      .map((tip) => (
                        <MagazineCard
                          key={tip.id}
                          padding="sm"
                          className={cn(
                            "border-l-4",
                            tip.isWarning ? "border-l-rose-500 bg-rose-50/10" : "border-l-amber-400 bg-amber-50/10",
                          )}
                        >
                          <div className="flex items-start gap-3">
                            {tip.isWarning ? (
                              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-rose-500" />
                            ) : (
                              <Lightbulb size={16} className="mt-0.5 shrink-0 text-amber-500" />
                            )}
                            <div className="min-w-0">
                              <div className="text-muted-foreground mb-1 text-[10px] font-black tracking-wider uppercase">
                                {tip.isWarning ? "Attention" : "Pro Advice"}
                              </div>
                              <div className="text-foreground mb-1 text-xs font-bold">{tip.title}</div>
                              <p className="text-muted-foreground text-[11px] leading-relaxed italic">{tip.body}</p>
                            </div>
                          </div>
                        </MagazineCard>
                      ))}
                  </div>
                )}

                {/* Journal & Budget */}
                <MagazineCard padding="sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="text-muted-foreground flex items-center gap-2">
                      <FileText size={14} />
                      <span className="text-[10px] font-black tracking-widest uppercase">Journal & Budget</span>
                    </div>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => (isUserEditing ? handleSaveUserData() : setIsUserEditing(true))}
                        className="text-primary hover:text-primary/80 text-[10px] font-bold transition-colors"
                      >
                        {isUserEditing ? "保存" : "編集"}
                      </button>
                    )}
                  </div>
                  {isUserEditing ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <JapaneseYen size={14} className="text-muted-foreground" />
                        <input
                          type="number"
                          value={budgetAmount}
                          onChange={(e) => setBudgetAmount(e.target.value)}
                          className="bg-background border-border v2-focus w-full rounded-xl border p-3 text-sm"
                          placeholder="予算額"
                        />
                      </div>
                      <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        className="bg-background border-border v2-focus w-full resize-none rounded-xl border p-3 text-sm"
                        rows={3}
                        placeholder="思い出のメモ..."
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-foreground flex items-center gap-2 text-sm font-bold">
                        <JapaneseYen size={14} className="text-primary" /> {parseInt(budgetAmount, 10).toLocaleString()}
                      </div>
                      <p className="text-muted-foreground text-sm italic">&ldquo;{noteText || "メモなし"}&rdquo;</p>
                    </div>
                  )}
                </MagazineCard>

                {/* Highlight */}
                {selectedEvent.highlight && (isAdmin || !isSurprise) && (
                  <MagazineCard padding="sm" className="bg-primary/5 border-primary/20">
                    <div className="text-primary mb-2 flex items-center gap-2">
                      <Star size={14} />
                      <span className="text-[10px] font-black tracking-widest uppercase">Pro Advice</span>
                    </div>
                    <p className="text-foreground text-sm font-bold">{selectedEvent.highlight}</p>
                  </MagazineCard>
                )}

                {/* Transit Timeline */}
                {selectedEvent.transitSteps && selectedEvent.transitSteps.length > 0 && (
                  <MagazineCard padding="sm" className="bg-secondary/20 border-border">
                    <div className="text-muted-foreground mb-4 flex items-center gap-2">
                      <Route size={14} />
                      <span className="text-[10px] font-black tracking-widest uppercase">Transit Route</span>
                    </div>
                    <TransitTimeline steps={selectedEvent.transitSteps} isAdmin={isAdmin} />
                  </MagazineCard>
                )}

                {/* Map Preview */}
                {(isAdmin || !isSurprise) && selectedEvent.locationUrl && (
                  <div className="space-y-3">
                    <div className="text-muted-foreground flex items-center gap-2">
                      <MapPin size={14} />
                      <span className="text-[10px] font-black tracking-widest uppercase">Location Map</span>
                    </div>
                    {apiKey ? (
                      <div className="aspect-video w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
                        <iframe
                          title="Location Map"
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          loading="lazy"
                          allowFullScreen
                          src={mapSearchUrl}
                        />
                      </div>
                    ) : (
                      <div className="bg-secondary/50 flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-stone-200">
                        <MapPin size={24} className="text-stone-300" />
                        <div className="px-6 text-center">
                          <p className="text-xs font-bold text-stone-500">Google Maps API キーが設定されていません</p>
                          <p className="mt-1 text-[10px] text-stone-400">
                            .env に NEXT_PUBLIC_GOOGLE_MAPS_API_KEY を設定してください
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Access */}
                {(selectedEvent.access || selectedEvent.locationUrl || directionsUrl) && (isAdmin || !isSurprise) && (
                  <MagazineCard padding="sm" className="space-y-4">
                    <div className="text-muted-foreground mb-2 flex items-center gap-2">
                      <MapPin size={14} />
                      <span className="text-[10px] font-black tracking-widest uppercase">Access & Location</span>
                    </div>
                    {selectedEvent.access?.map((line, idx) => (
                      <p
                        // biome-ignore lint/suspicious/noArrayIndexKey: access lines are static descriptions
                        key={`access-${line}-${idx}`}
                        className="text-muted-foreground text-sm"
                      >
                        {maskSecretText(line, isAdmin)}
                      </p>
                    ))}

                    <div className="flex flex-col gap-3 pt-2">
                      {directionsUrl && (
                        <a
                          href={directionsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary inline-flex items-center gap-2 text-sm font-bold hover:underline"
                        >
                          <Route size={14} className="text-primary" />
                          {maskSecretText(previousLocation || "", isAdmin)} からの経路
                        </a>
                      )}
                      {selectedEvent.locationUrl && (
                        <a
                          href={selectedEvent.locationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary inline-flex items-center gap-2 text-sm font-bold hover:underline"
                        >
                          <MapPin size={14} />
                          Google Maps で見る
                        </a>
                      )}
                    </div>
                  </MagazineCard>
                )}

                {/* Photos */}
                <div className="border-border border-t pt-6">
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
