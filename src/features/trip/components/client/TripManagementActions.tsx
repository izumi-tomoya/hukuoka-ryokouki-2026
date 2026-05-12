"use client";

import { Loader2, Plus, Settings } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { addDayAction } from "@/features/trip/api/tripActions";

interface Props {
  tripId: string;
  slug: string;
}

export function TripManagementActions({ tripId, slug }: Props) {
  const [isAddingDay, setIsAddingDay] = useState(false);

  const handleAddDay = async () => {
    setIsAddingDay(true);
    try {
      const result = await addDayAction(tripId);
      if (!result.success) {
        alert(result.error);
      }
    } catch (error) {
      console.error(error);
      alert("エラーが発生しました");
    } finally {
      setIsAddingDay(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Link
        href={`/trip/${slug}/edit`}
        className="bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary border-border flex items-center gap-2 rounded-full border px-6 py-2.5 text-[11px] font-black tracking-widest uppercase transition-all"
      >
        <Settings size={14} />
        Edit Trip
      </Link>

      <button
        onClick={handleAddDay}
        disabled={isAddingDay}
        className="bg-primary text-primary-foreground shadow-primary/20 flex items-center gap-2 rounded-full px-6 py-2.5 text-[11px] font-black tracking-widest uppercase shadow-lg transition-all hover:opacity-90 disabled:opacity-50"
      >
        {isAddingDay ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
        Add Day
      </button>
    </div>
  );
}
