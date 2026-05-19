"use client";

import { Camera, Check, Loader2, Star, Trophy, Upload, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MagazineCard } from "@/components/ui/MagazineCard";
import { addGourmetAwardAction } from "../../api/tripActions";

interface Props {
  tripId: string;
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  "Best Ramen",
  "Best Yatai",
  "Best Street Food",
  "Best Dessert",
  "Best Atmosphere",
  "Most Memorable",
  "Special Mention",
];

export default function AddAwardModal({ tripId, isOpen, onClose }: Props) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [comment, setComment] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isPending, setIsPending] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) setImageUrl(data.url);
    } catch {
      alert("アップロードに失敗しました");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      const res = await addGourmetAwardAction(tripId, {
        title,
        category,
        comment,
        imageUrl,
      });
      if (res.success) {
        onClose();
        setTitle("");
        setComment("");
        setImageUrl("");
      } else {
        alert(res.error);
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal"
        className="bg-background/80 animate-in fade-in absolute inset-0 cursor-default backdrop-blur-md duration-300"
        onClick={onClose}
      />

      <MagazineCard
        padding="lg"
        className="animate-in zoom-in-95 border-primary/20 relative max-h-[90vh] w-full max-w-2xl overflow-y-auto shadow-2xl duration-300"
      >
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 text-black">
              <Trophy size={20} />
            </div>
            <h2 className="text-foreground text-2xl font-black">New Gourmet Award</h2>
          </div>
          <button type="button" onClick={onClose} className="hover:bg-secondary rounded-full p-2 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="award-title"
                className="text-muted-foreground ml-1 text-[10px] font-black tracking-widest uppercase"
              >
                Award Title / Shop Name
              </label>
              <input
                id="award-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground/50 v2-focus w-full rounded-2xl border px-5 py-4 transition-all"
                placeholder="例：博多一双 / 元祖長浜屋"
                required
              />
            </div>
            <div className="relative space-y-2">
              <label
                htmlFor="award-category"
                className="text-muted-foreground ml-1 text-[10px] font-black tracking-widest uppercase"
              >
                Category
              </label>
              <select
                id="award-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-secondary/50 border-border text-foreground dark:bg-card v2-focus w-full appearance-none rounded-2xl border px-5 py-4"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-card text-foreground">
                    {c}
                  </option>
                ))}
              </select>
              <div className="text-muted-foreground pointer-events-none absolute right-5 bottom-4">
                <Star size={16} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="award-comment"
              className="text-muted-foreground ml-1 text-[10px] font-black tracking-widest uppercase"
            >
              Comments
            </label>
            <textarea
              id="award-comment"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground/50 v2-focus w-full resize-none rounded-2xl border px-5 py-4 transition-all"
              placeholder="なぜこのお店が最高だったのか、二人の感想をメモしましょう..."
            />
          </div>

          {/* Photo Upload Area */}
          <div className="space-y-4">
            <label
              htmlFor="photo-upload"
              className="text-muted-foreground ml-1 flex items-center gap-2 text-[10px] font-black tracking-widest uppercase"
            >
              <Camera size={12} /> Award Photo
            </label>

            {imageUrl ? (
              <div className="border-primary group relative aspect-video w-full overflow-hidden rounded-2xl border-2 shadow-xl">
                <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X size={32} className="text-white" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="photo-upload"
                className="border-border bg-secondary/20 hover:bg-secondary/40 flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed transition-all"
              >
                {isUploading ? (
                  <Loader2 className="text-primary animate-spin" size={32} />
                ) : (
                  <>
                    <Upload size={32} className="text-muted-foreground mb-3" />
                    <span className="text-muted-foreground text-xs font-bold">最高の1枚をアップロード</span>
                  </>
                )}
                <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="secondary"
              className="h-16 flex-1 rounded-2xl text-xs font-black tracking-widest uppercase"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || isUploading || !title}
              className="h-16 flex-1 gap-3 rounded-2xl text-xs font-black tracking-widest uppercase"
            >
              {isPending ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
              Confirm Award
            </Button>
          </div>
        </form>
      </MagazineCard>
    </div>
  );
}
