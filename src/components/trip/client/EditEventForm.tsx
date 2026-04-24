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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      <div>
        <label className="block text-sm font-medium text-stone-700">時間</label>
        <input {...register("time")} className="w-full border p-2 rounded" />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700">タイトル / 料理名</label>
        <input {...register("title")} className="w-full border p-2 rounded" />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700">説明</label>
        <textarea {...register("desc")} className="w-full border p-2 rounded" rows={3} />
      </div>
      {event.type === 'food' && (
        <div>
          <label className="block text-sm font-medium text-stone-700">料理の補足説明</label>
          <textarea {...register("foodDesc")} className="w-full border p-2 rounded" rows={3} />
        </div>
      )}
      <Button type="submit" className="w-full">保存</Button>
    </form>
  );
}
