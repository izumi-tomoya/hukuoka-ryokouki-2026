'use client';

import { createTrip } from '@/app/actions/tripActions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, MapPin, Palette } from 'lucide-react';

const labelCls = "block text-[9px] font-black tracking-[4px] text-stone-400 uppercase mb-2";
const inputCls = "w-full rounded-2xl bg-white ring-1 ring-stone-200 px-4 py-3.5 text-[14px] font-medium text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400/60 transition-all";

export default function NewTripForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    try {
      const result = await createTrip(formData);
      if (result.success) router.push(`/trip/${result.slug}`);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      <div>
        <label className={labelCls}>Trip Title</label>
        <input
          name="title"
          required
          placeholder="例: ふたりの沖縄記念日旅行"
          className={inputCls}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Location</label>
          <div className="relative">
            <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
            <input
              name="location"
              required
              placeholder="Okinawa"
              className={`${inputCls} pl-10`}
            />
          </div>
        </div>
        <div>
          <label className={labelCls}>Accent Color</label>
          <div className="relative">
            <Palette size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 z-10" />
            <input
              name="accentColor"
              type="color"
              defaultValue="#F5C842"
              className="w-full h-[50px] rounded-2xl bg-white ring-1 ring-stone-200 pl-10 pr-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400/60 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Start Date</label>
          <input name="startDate" type="date" required className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>End Date</label>
          <input name="endDate" type="date" required className={inputCls} />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-[#0D0A06] py-4 text-[13px] font-bold text-white/90 transition-all hover:bg-stone-900 active:scale-[0.98] disabled:opacity-40 shadow-lg shadow-stone-900/20 mt-2"
      >
        <Sparkles size={15} className="text-amber-400" />
        {isPending ? '作成中...' : '旅のしおりを作成する'}
      </button>
    </form>
  );
}
