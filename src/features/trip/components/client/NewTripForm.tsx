'use client';

import { createTrip } from '@/features/trip/api/tripActions';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, MapPin, Palette } from 'lucide-react';

const labelCls = 'block text-[9px] font-black tracking-[4px] text-muted-foreground uppercase mb-2 ml-1';
const inputCls =
  'w-full rounded-2xl bg-card border border-border px-4 py-3.5 text-[14px] font-medium text-foreground placeholder:text-muted-foreground/30 transition-all v2-focus';

export default function NewTripForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createTrip(formData);
      if (result.success) {
        router.push(`/trip/${result.slug}`);
      } else {
        alert(result.error);
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div>
        <label className={labelCls}>Trip Title</label>
        <input
          name="title"
          required
          placeholder="例: ふたりの沖縄記念日旅行"
          className={inputCls}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelCls}>Location</label>
          <div className="relative">
            <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
            <input name="location" required placeholder="Okinawa" className={`${inputCls} pl-11`} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Accent Color</label>
          <div className="relative">
            <Palette
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 z-10"
            />
            <input
              name="accentColor"
              type="color"
              defaultValue="#F5C842"
              className="w-full h-[54px] rounded-2xl bg-card border border-border pl-11 pr-3 cursor-pointer focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Start Date</label>
          <input name="startDate" type="date" required className={cn(inputCls, "appearance-none")} />
        </div>
        <div>
          <label className={labelCls}>End Date</label>
          <input name="endDate" type="date" required className={cn(inputCls, "appearance-none")} />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-foreground text-background py-5 text-[13px] font-black uppercase tracking-widest transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 shadow-xl shadow-foreground/10 mt-2 v2-focus"
      >
        <Sparkles size={16} className="text-amber-400" />
        {isPending ? 'CREATING...' : 'Create Your Story'}
      </button>
    </form>
  );
}
