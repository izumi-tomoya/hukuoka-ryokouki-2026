"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { EventFormData } from "@/lib/formvalidation/eventSchema";
import { updateEventAction } from "@/features/trip/api/tripActions";
import { TripEvent } from "@/features/trip/types/trip";
import { Button } from "@/components/ui/button";

interface Props {
  event: TripEvent;
  onSuccess: () => void;
}

export function EditEventForm({ event, onSuccess }: Props) {
  const { register, handleSubmit } = useForm<EventFormData>({
    defaultValues: {
      time: event.time,
      type: event.type,
      title: event.title ?? "",
      desc: event.desc ?? "",
      tag: event.tag,
      foodName: event.foodName ?? "",
      foodDesc: event.foodDesc ?? "",
      locationUrl: event.locationUrl ?? "",
    } as EventFormData,
  });

  const onSubmit: SubmitHandler<EventFormData> = async (data) => {
    if (!event.id) return;
    await updateEventAction(event.id, data);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">時間</label>
        <input {...register("time")} className="w-full bg-background border border-border p-3 rounded-xl text-foreground v2-focus" />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">タイトル / 料理名</label>
        <input {...register("title")} className="w-full bg-background border border-border p-3 rounded-xl text-foreground v2-focus" />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">説明</label>
        <textarea {...register("desc")} className="w-full bg-background border border-border p-3 rounded-xl text-foreground resize-none v2-focus" rows={3} />
      </div>
      {event.type === 'food' && (
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">料理の補足説明</label>
          <textarea {...register("foodDesc")} className="w-full bg-background border border-border p-3 rounded-xl text-foreground resize-none v2-focus" rows={3} />
        </div>
      )}
      <Button type="submit" className="w-full h-14 rounded-xl text-xs font-black uppercase tracking-widest">保存</Button>
    </form>
  );
}
