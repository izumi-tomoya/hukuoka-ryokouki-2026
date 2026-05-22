"use client";

import {
  Check,
  CheckCircle2,
  Circle,
  Edit2,
  LayoutGrid,
  Loader2,
  MapPin,
  Plus,
  Search,
  Star,
  Store,
  Ticket,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { MagazineCard } from "@/components/ui/MagazineCard";
import type { Tip } from "@/features/trip/types/trip";
import { cn } from "@/lib/utils";
import { createTipAction, deleteTipAction, toggleTipConfirmation, updateTipAction } from "../../api/tripActions";

interface TipsListProps {
  initialTips: Tip[];
  tripId: string;
}

const categories = ["All", "Gourmet", "Hidden Gem", "Warning", "Transport", "Reservation"];

export default function TipsList({ initialTips, tripId }: TipsListProps) {
  const [tips, setTips] = useState<Tip[]>(initialTips);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "venue">("venue");
  const [editingTip, setEditingTip] = useState<Partial<Tip> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedTicketUrl, setSelectedTicketUrl] = useState<string | null>(null);

  // フィルタリング
  const filteredTips = useMemo(() => {
    return tips.filter((tip) => {
      const matchesSearch =
        tip.title.toLowerCase().includes(search.toLowerCase()) ||
        tip.body.toLowerCase().includes(search.toLowerCase()) ||
        tip.venue?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" ||
        (selectedCategory === "Warning"
          ? tip.isWarning
          : selectedCategory === "Reservation"
            ? tip.category === "Reservation" || tip.title.includes("予約") || !!tip.imageUrl
            : tip.category === selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [tips, search, selectedCategory]);

  const groupedByVenue = useMemo(() => {
    const groups: Record<string, Tip[]> = {};
    filteredTips.forEach((tip) => {
      const v = tip.venue || "その他";
      if (!groups[v]) groups[v] = [];
      groups[v].push(tip);
    });
    return groups;
  }, [filteredTips]);

  const handleToggleConfirm = async (id: string, current: boolean) => {
    try {
      setTips(tips.map((t) => (t.id === id ? { ...t, isConfirmed: !current } : t)));
      await toggleTipConfirmation(id, !current);
    } catch {
      setTips(tips.map((t) => (t.id === id ? { ...t, isConfirmed: current } : t)));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setEditingTip((prev) => (prev ? { ...prev, imageUrl: data.url } : null));
      }
    } catch {
      alert("アップロードに失敗しました");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTip?.title || !editingTip?.body) return;

    setIsSaving(true);
    try {
      const data = {
        title: editingTip.title,
        body: editingTip.body,
        venue: editingTip.venue || "",
        imageUrl: editingTip.imageUrl || "",
        isWarning: !!editingTip.isWarning,
        isConfirmed: !!editingTip.isConfirmed,
        category: editingTip.category || "General",
        deepLevel: editingTip.deepLevel || 1,
      };

      if (editingTip.id) {
        await updateTipAction(editingTip.id, data);
        setTips(tips.map((t) => (t.id === editingTip.id ? { ...t, ...data } : t)));
      } else {
        await createTipAction(tripId, data);
        window.location.reload();
      }
      setEditingTip(null);
    } catch {
      alert("保存に失敗しました");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("この項目を削除してもよろしいですか？")) return;
    try {
      await deleteTipAction(id);
      setTips(tips.filter((t) => t.id !== id));
    } catch {
      alert("削除に失敗しました");
    }
  };

  const TipCard = ({ tip }: { tip: Tip }) => (
    <MagazineCard
      padding="md"
      className={cn(
        "group relative flex h-full flex-col border-l-4 transition-all",
        tip.isConfirmed
          ? "border-l-emerald-500 opacity-60"
          : tip.isWarning
            ? "border-l-amber-500 shadow-amber-500/5"
            : "border-l-primary shadow-primary/5",
      )}
    >
      <div className="mb-6 flex items-start justify-between">
        <button
          type="button"
          onClick={() => tip.id && handleToggleConfirm(tip.id, !!tip.isConfirmed)}
          className={cn(
            "flex items-center gap-2 rounded-full border px-3 py-1.5 text-[9px] font-black tracking-widest uppercase transition-all",
            tip.isConfirmed
              ? "border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
              : "bg-secondary/80 text-muted-foreground border-border hover:border-primary/50",
          )}
        >
          {tip.isConfirmed ? <CheckCircle2 size={12} /> : <Circle size={12} />}
          {tip.isConfirmed ? "Confirmed" : "Pending"}
        </button>

        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            onClick={() => setEditingTip(tip)}
            className="hover:bg-secondary text-muted-foreground hover:text-primary rounded-lg p-2 transition-colors"
          >
            <Edit2 size={14} />
          </button>
          <button
            type="button"
            onClick={() => tip.id && handleDelete(tip.id)}
            className="text-muted-foreground rounded-lg p-2 transition-colors hover:bg-rose-500/10 hover:text-rose-500"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="grow">
        <h3
          className={cn(
            "mb-2 text-lg leading-tight font-bold transition-all",
            tip.isConfirmed ? "text-muted-foreground line-through decoration-2" : "text-foreground",
          )}
        >
          {tip.title}
        </h3>
        <p className="text-muted-foreground line-clamp-3 text-[13px] leading-relaxed transition-all group-hover:line-clamp-none">
          {tip.body}
        </p>

        {tip.imageUrl && (
          <button
            type="button"
            onClick={() => setSelectedTicketUrl(tip.imageUrl || null)}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-indigo-500 py-4 text-[10px] font-black tracking-[0.2em] text-white uppercase shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-95"
          >
            <Ticket size={16} /> View Boarding Pass
          </button>
        )}
      </div>

      <div className="border-border mt-6 flex items-center justify-between border-t pt-5">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((num) => (
            <Star
              key={num}
              size={10}
              className={cn(num <= (tip.deepLevel || 1) ? "fill-amber-400 text-amber-400" : "text-border")}
            />
          ))}
        </div>
        <div
          className={cn(
            "text-[9px] font-black tracking-[0.2em] uppercase",
            tip.isWarning ? "text-amber-500" : "text-primary/60",
          )}
        >
          {tip.category}
        </div>
      </div>
    </MagazineCard>
  );

  return (
    <div className="space-y-8 md:space-y-10">
      {/* ─── Controls ─── */}
      <div className="bg-card border-border flex min-w-0 flex-col gap-5 rounded-[1.75rem] border p-4 shadow-sm sm:gap-6 sm:rounded-[2.5rem] sm:p-6">
        <div className="flex flex-col items-stretch justify-between gap-4 md:flex-row md:items-center">
          <div className="relative min-w-0 flex-1 md:max-w-md">
            <Search className="text-muted-foreground absolute top-1/2 left-4 -translate-y-1/2" size={18} />
            <input
              type="text"
              placeholder="お店名、タイトル、予約情報..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-secondary/50 v2-focus min-h-12 w-full rounded-2xl border-none py-3.5 pr-4 pl-12 text-base transition-all sm:text-sm"
            />
          </div>

          <div className="bg-secondary/50 grid shrink-0 grid-cols-2 rounded-2xl p-1">
            <button
              type="button"
              onClick={() => setViewMode("venue")}
              className={cn(
                "flex min-h-10 items-center justify-center gap-2 rounded-xl px-3 py-2 text-[10px] font-black tracking-[0.12em] uppercase transition-all sm:px-4 sm:tracking-widest",
                viewMode === "venue"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Store size={14} /> Shop View
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={cn(
                "flex min-h-10 items-center justify-center gap-2 rounded-xl px-3 py-2 text-[10px] font-black tracking-[0.12em] uppercase transition-all sm:px-4 sm:tracking-widest",
                viewMode === "grid"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <LayoutGrid size={14} /> All List
            </button>
          </div>
        </div>

        <div className="border-border/50 flex flex-col items-stretch justify-between gap-4 border-t pt-2 md:flex-row md:items-center">
          <div className="no-scrollbar -mx-4 flex w-full items-center gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0 md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "min-h-10 shrink-0 rounded-full border px-4 py-2 text-[10px] font-black tracking-[0.12em] whitespace-nowrap uppercase transition-all sm:tracking-widest",
                  selectedCategory === cat
                    ? "bg-primary border-primary text-primary-foreground shadow-primary/20 shadow-lg"
                    : "bg-secondary/30 text-muted-foreground hover:bg-secondary border-transparent",
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <Button
            type="button"
            onClick={() =>
              setEditingTip({
                title: "",
                body: "",
                venue: "",
                imageUrl: "",
                isWarning: false,
                isConfirmed: false,
                category: "General",
                deepLevel: 1,
              })
            }
            className="min-h-12 w-full gap-2 rounded-2xl px-6 md:w-auto"
          >
            <Plus size={18} />
            <span>Add New Item</span>
          </Button>
        </div>
      </div>

      {/* ─── Content Area ─── */}
      {viewMode === "venue" ? (
        <div className="space-y-10 md:space-y-16">
          {Object.entries(groupedByVenue).map(([venue, venueTips]) => (
            <div key={venue} className="space-y-6">
              <div className="flex min-w-0 items-center gap-3 px-0 sm:gap-4 sm:px-2">
                <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                  <MapPin size={20} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-foreground text-xl leading-tight font-bold wrap-break-word">{venue}</h2>
                  <p className="text-muted-foreground mt-1 text-[10px] leading-relaxed font-black tracking-[0.14em] uppercase sm:tracking-[0.2em]">
                    {venueTips.length} Items for this location
                  </p>
                </div>
                <div className="bg-border ml-4 hidden h-px grow sm:block" />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {venueTips.map((tip) => (
                  <TipCard key={tip.id} tip={tip} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTips.map((tip) => (
            <TipCard key={tip.id} tip={tip} />
          ))}
        </div>
      )}

      {/* ─── Ticket Lightbox ─── */}
      {selectedTicketUrl && (
        <button
          type="button"
          aria-label="Close ticket view"
          className="animate-in fade-in fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/95 p-4 backdrop-blur-md duration-300"
          onClick={() => setSelectedTicketUrl(null)}
        >
          <div className="relative flex h-full w-full max-w-xl flex-col items-center justify-center gap-6 sm:gap-8">
            <div className="absolute top-0 right-0 min-h-12 min-w-12 p-3 text-white transition-transform hover:scale-110 sm:p-4">
              <X size={32} />
            </div>
            <div className="relative aspect-[9/16] max-h-[78vh] w-full overflow-hidden rounded-3xl border-4 border-white/10 shadow-2xl">
              <Image src={selectedTicketUrl} alt="Ticket" fill className="object-contain" />
            </div>
            <p className="rounded-full bg-white/10 px-6 py-2 text-xs font-black tracking-widest text-white/60 uppercase">
              Screen Tap to Close
            </p>
          </div>
        </button>
      )}

      {/* ─── Edit Modal ─── */}
      {editingTip && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close modal"
            className="bg-background/80 absolute inset-0 backdrop-blur-sm"
            onClick={() => setEditingTip(null)}
          />
          <MagazineCard
            padding="lg"
            className="animate-in zoom-in-95 border-primary/20 relative max-h-[90vh] w-full max-w-xl overflow-y-auto shadow-2xl duration-200"
          >
            <div className="mb-6 flex items-center justify-between gap-4 sm:mb-8">
              <h2 className="text-foreground text-2xl font-bold wrap-break-word">
                {editingTip.id ? "Edit Item" : "New Item"}
              </h2>
              <button
                type="button"
                onClick={() => setEditingTip(null)}
                className="hover:bg-secondary min-h-10 min-w-10 rounded-full p-2"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="venue-input"
                  className="text-muted-foreground ml-1 text-[10px] font-black tracking-widest uppercase"
                >
                  Location / Shop Name
                </label>
                <div className="relative">
                  <MapPin className="text-muted-foreground absolute top-1/2 left-4 -translate-y-1/2" size={16} />
                  <input
                    id="venue-input"
                    value={editingTip.venue || ""}
                    onChange={(e) => setEditingTip({ ...editingTip, venue: e.target.value })}
                    className="bg-secondary/50 border-border v2-focus min-h-12 w-full rounded-2xl border py-4 pr-5 pl-12 text-base transition-all sm:text-sm"
                    placeholder="例：福岡空港 / ヒルトン福岡"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="title-input"
                  className="text-muted-foreground ml-1 text-[10px] font-black tracking-widest uppercase"
                >
                  Title
                </label>
                <input
                  id="title-input"
                  value={editingTip.title || ""}
                  onChange={(e) => setEditingTip({ ...editingTip, title: e.target.value })}
                  className="bg-secondary/50 border-border v2-focus min-h-12 w-full rounded-2xl border px-5 py-4 text-base transition-all sm:text-sm"
                  placeholder="例：搭乗券（tomoya） / 予約番号"
                  required
                />
              </div>

              <div className="space-y-4 rounded-3xl border border-indigo-500/20 bg-indigo-500/5 p-4 sm:rounded-[2rem] sm:p-5">
                <label
                  htmlFor="file-upload"
                  className="ml-1 flex cursor-pointer items-center gap-2 text-[10px] font-black tracking-widest text-indigo-400 uppercase"
                >
                  <Ticket size={12} /> Boarding Pass / Screenshot
                </label>

                {editingTip.imageUrl ? (
                  <div className="group relative aspect-video w-full overflow-hidden rounded-2xl border-2 border-indigo-500 shadow-lg">
                    <Image src={editingTip.imageUrl} alt="Ticket preview" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => setEditingTip({ ...editingTip, imageUrl: "" })}
                      className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Trash2 size={24} className="text-white" />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="file-upload"
                    className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-indigo-500/30 bg-indigo-500/5 transition-all hover:bg-indigo-500/10"
                  >
                    {isUploading ? (
                      <Loader2 className="animate-spin text-indigo-500" size={32} />
                    ) : (
                      <>
                        <Upload size={32} className="mb-2 text-indigo-400" />
                        <span className="text-xs font-bold text-indigo-400">スクリーンショットをアップロード</span>
                      </>
                    )}
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="category-select"
                    className="text-muted-foreground ml-1 text-[10px] font-black tracking-widest uppercase"
                  >
                    Category
                  </label>
                  <select
                    id="category-select"
                    value={editingTip.category || "General"}
                    onChange={(e) => setEditingTip({ ...editingTip, category: e.target.value })}
                    className="bg-secondary/50 border-border focus:ring-primary/10 min-h-12 w-full appearance-none rounded-2xl border px-5 py-4 text-base outline-none focus:ring-4 sm:text-sm"
                  >
                    {categories
                      .filter((c) => c !== "All")
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="priority-input"
                    className="text-muted-foreground ml-1 text-[10px] font-black tracking-widest uppercase"
                  >
                    Priority
                  </label>
                  <input
                    id="priority-input"
                    type="number"
                    min="1"
                    max="5"
                    value={editingTip.deepLevel || 1}
                    onChange={(e) => setEditingTip({ ...editingTip, deepLevel: Number.parseInt(e.target.value, 10) })}
                    className="bg-secondary/50 border-border v2-focus min-h-12 w-full rounded-2xl border px-5 py-4 text-base sm:text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="details-input"
                  className="text-muted-foreground ml-1 text-[10px] font-black tracking-widest uppercase"
                >
                  Details
                </label>
                <textarea
                  id="details-input"
                  rows={3}
                  value={editingTip.body || ""}
                  onChange={(e) => setEditingTip({ ...editingTip, body: e.target.value })}
                  className="bg-secondary/50 border-border v2-focus w-full resize-none rounded-2xl border px-5 py-4 text-base transition-all sm:text-sm"
                  placeholder="予約番号や座席番号など..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-3 pt-4 sm:grid-cols-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="h-14 rounded-2xl"
                  onClick={() => setEditingTip(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving || isUploading} className="h-14 gap-2 rounded-2xl">
                  {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                  Save Item
                </Button>
              </div>
            </form>
          </MagazineCard>
        </div>
      )}
    </div>
  );
}
