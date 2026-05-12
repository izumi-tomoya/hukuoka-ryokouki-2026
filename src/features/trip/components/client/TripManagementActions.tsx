'use client';

import { useState } from 'react';
import { Settings, Plus, Loader2 } from 'lucide-react';
import { addDayAction } from '@/features/trip/api/tripActions';
import Link from 'next/link';

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
      alert('エラーが発生しました');
    } finally {
      setIsAddingDay(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <Link
        href={`/trip/${slug}/edit`}
        className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-secondary text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all border border-border"
      >
        <Settings size={14} />
        Edit Trip
      </Link>
      
      <button
        onClick={handleAddDay}
        disabled={isAddingDay}
        className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-[11px] font-black uppercase tracking-widest text-primary-foreground hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
      >
        {isAddingDay ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
        Add Day
      </button>
    </div>
  );
}
