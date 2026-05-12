"use client";

import { Loader2, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { deleteEventAction, updateEventAction } from "@/features/trip/api/tripActions";
import type { TripEvent } from "@/features/trip/types/trip";
import type { EventFormData } from "@/lib/formvalidation/eventSchema";

interface Props {
  event: TripEvent;
  onSuccess: () => void;
}

const EVENT_TYPES = [
  { value: "sightseeing", label: "観光" },
  { value: "food", label: "食事" },
  { value: "transport", label: "移動" },
  { value: "shopping", label: "買い物" },
  { value: "hotel", label: "ホテル" },
  { value: "surprise", label: "サプライズ" },
  { value: "basic", label: "その他" },
];

export function EditEventForm({ event, onSuccess }: Props) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const { register, handleSubmit } = useForm<EventFormData>({
    defaultValues: {
      time: event.time,
      type: event.type,
      title: event.title ?? "",
      desc: event.desc ?? "",
      tag: event.tag,
      tagLabel: event.tagLabel ?? "",
      foodName: event.foodName ?? "",
      foodDesc: event.foodDesc ?? "",
      locationUrl: event.locationUrl ?? "",
    } as EventFormData,
  });

  const onSubmit: SubmitHandler<EventFormData> = async (data) => {
    if (!event.id) return;
    setIsUpdating(true);
    try {
      await updateEventAction(event.id, data);
      onSuccess();
      router.refresh();
    } catch (err) {
      alert("更新に失敗しました");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!event.id || !confirm("この予定を削除してもよろしいですか？")) return;
    setIsDeleting(true);
    try {
      await deleteEventAction(event.id);
      onSuccess();
      router.refresh();
    } catch (err) {
      alert("削除に失敗しました");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">時間</label>
          <input
            {...register("time")}
            type="time"
            className="w-full bg-secondary/30 border border-border p-3 rounded-xl text-foreground focus:bg-background outline-none transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
            カテゴリ
          </label>
          <select
            {...register("type")}
            className="w-full bg-secondary/30 border border-border p-3 rounded-xl text-foreground focus:bg-background outline-none transition-all appearance-none"
          >
            {EVENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">タイトル</label>
        <input
          {...register("title")}
          className="w-full bg-secondary/30 border border-border p-3 rounded-xl text-foreground focus:bg-background outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
            タグ表示名 (例: ランチ)
          </label>
          <input
            {...register("tagLabel")}
            className="w-full bg-secondary/30 border border-border p-3 rounded-xl text-foreground focus:bg-background outline-none transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
            確定済み
          </label>
          <div className="flex items-center h-12 px-4 bg-secondary/30 border border-border rounded-xl">
            <input
              type="checkbox"
              {...register("isConfirmed")}
              className="h-5 w-5 rounded border-border text-primary"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">説明</label>
        <textarea
          {...register("desc")}
          className="w-full bg-secondary/30 border border-border p-3 rounded-xl text-foreground focus:bg-background outline-none transition-all resize-none"
          rows={2}
        />
      </div>

      <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 space-y-4">
        <div className="text-[10px] font-black uppercase tracking-widest text-amber-600">Pro Advice & Food Info</div>
        <input
          {...register("highlight")}
          placeholder="✨ Highlight / アドバイス"
          className="w-full bg-background/50 border border-amber-500/20 p-3 rounded-xl text-xs"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            {...register("foodName")}
            placeholder="料理名"
            className="w-full bg-background/50 border border-amber-500/20 p-3 rounded-xl text-xs"
          />
          <input
            {...register("foodDesc")}
            placeholder="料理の説明"
            className="w-full bg-background/50 border border-amber-500/20 p-3 rounded-xl text-xs"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
          Google Maps URL
        </label>
        <input
          {...register("locationUrl")}
          type="url"
          className="w-full bg-secondary/30 border border-border p-3 rounded-xl text-foreground focus:bg-background outline-none transition-all"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          variant="destructive"
          type="button"
          onClick={handleDelete}
          disabled={isDeleting || isUpdating}
          className="h-14 px-6 rounded-xl flex items-center justify-center gap-2"
        >
          {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
        </Button>
        <Button
          type="submit"
          disabled={isDeleting || isUpdating}
          className="flex-1 h-14 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2"
        >
          {isUpdating ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {isUpdating ? "更新中..." : "保存する"}
        </Button>
      </div>
    </form>
  );
}
