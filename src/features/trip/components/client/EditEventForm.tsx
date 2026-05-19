"use client";

import { Loader2, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
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
  
  const timeId = useId();
  const typeId = useId();
  const titleId = useId();
  const tagLabelId = useId();
  const isConfirmedId = useId();
  const descId = useId();
  const locationUrlId = useId();

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
    } catch (_err) {
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
    } catch (_err) {
      alert("削除に失敗しました");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor={timeId} className="text-muted-foreground ml-1 text-[10px] font-black tracking-widest uppercase">時間</label>
          <input
            id={timeId}
            {...register("time")}
            type="time"
            className="bg-secondary/30 border-border text-foreground focus:bg-background w-full rounded-xl border p-3 transition-all outline-none"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor={typeId} className="text-muted-foreground ml-1 text-[10px] font-black tracking-widest uppercase">
            カテゴリ
          </label>
          <select
            id={typeId}
            {...register("type")}
            className="bg-secondary/30 border-border text-foreground focus:bg-background w-full appearance-none rounded-xl border p-3 transition-all outline-none"
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
        <label htmlFor={titleId} className="text-muted-foreground ml-1 text-[10px] font-black tracking-widest uppercase">タイトル</label>
        <input
          id={titleId}
          {...register("title")}
          className="bg-secondary/30 border-border text-foreground focus:bg-background w-full rounded-xl border p-3 transition-all outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor={tagLabelId} className="text-muted-foreground ml-1 text-[10px] font-black tracking-widest uppercase">
            タグ表示名 (例: ランチ)
          </label>
          <input
            id={tagLabelId}
            {...register("tagLabel")}
            className="bg-secondary/30 border-border text-foreground focus:bg-background w-full rounded-xl border p-3 transition-all outline-none"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor={isConfirmedId} className="text-muted-foreground ml-1 text-[10px] font-black tracking-widest uppercase">
            確定済み
          </label>
          <div className="bg-secondary/30 border-border flex h-12 items-center rounded-xl border px-4">
            <input
              id={isConfirmedId}
              type="checkbox"
              {...register("isConfirmed")}
              className="border-border text-primary h-5 w-5 rounded"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor={descId} className="text-muted-foreground ml-1 text-[10px] font-black tracking-widest uppercase">説明</label>
        <textarea
          id={descId}
          {...register("desc")}
          className="bg-secondary/30 border-border text-foreground focus:bg-background w-full resize-none rounded-xl border p-3 transition-all outline-none"
          rows={2}
        />
      </div>

      <div className="space-y-4 rounded-2xl border border-amber-500/10 bg-amber-500/5 p-4">
        <div className="text-[10px] font-black tracking-widest text-amber-600 uppercase">Pro Advice & Food Info</div>
        <input
          {...register("highlight")}
          placeholder="✨ Highlight / アドバイス"
          className="bg-background/50 w-full rounded-xl border border-amber-500/20 p-3 text-xs"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            {...register("foodName")}
            placeholder="料理名"
            className="bg-background/50 w-full rounded-xl border border-amber-500/20 p-3 text-xs"
          />
          <input
            {...register("foodDesc")}
            placeholder="料理の説明"
            className="bg-background/50 w-full rounded-xl border border-amber-500/20 p-3 text-xs"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor={locationUrlId} className="text-muted-foreground ml-1 text-[10px] font-black tracking-widest uppercase">
          Google Maps URL
        </label>
        <input
          id={locationUrlId}
          {...register("locationUrl")}
          type="url"
          className="bg-secondary/30 border-border text-foreground focus:bg-background w-full rounded-xl border p-3 transition-all outline-none"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          variant="destructive"
          type="button"
          onClick={handleDelete}
          disabled={isDeleting || isUpdating}
          className="flex h-14 items-center justify-center gap-2 rounded-xl px-6"
        >
          {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
        </Button>
        <Button
          type="submit"
          disabled={isDeleting || isUpdating}
          className="flex h-14 flex-1 items-center justify-center gap-2 rounded-xl text-xs font-black tracking-widest uppercase"
        >
          {isUpdating ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {isUpdating ? "更新中..." : "保存する"}
        </Button>
      </div>
    </form>
  );
}
