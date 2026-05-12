'use client';

import { useState } from 'react';
import { Edit2, Trash2, Loader2 } from 'lucide-react';
import { deleteEventAction } from '@/features/trip/api/tripActions';
import { useModalStore } from '@/lib/store/useModalStore';
import { TripEvent } from '@/features/trip/types/trip';

interface Props {
  event: TripEvent;
}

export function EventActionButtons({ event }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const openModal = useModalStore((s) => s.openModal);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!event.id || !confirm('この予定を削除してもよろしいですか？')) return;
    
    setIsDeleting(true);
    try {
      const result = await deleteEventAction(event.id);
      if (!result.success) {
        alert(result.error);
      }
    } catch (error) {
      console.error(error);
      alert('削除に失敗しました');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal(event);
    // Note: DetailModal usually starts in view mode. 
    // If we want it to start in Edit mode, we'd need to adjust ModalStore or use a different trigger.
    // For now, clicking Edit will open the detail modal where the user can click Edit.
  };

  return (
    <div className="flex gap-1.5">
      <button
        onClick={handleEdit}
        className="p-2 rounded-full bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all border border-border"
        title="編集"
      >
        <Edit2 size={12} />
      </button>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-2 rounded-full bg-secondary text-muted-foreground hover:bg-rose-50 hover:text-rose-500 transition-all border border-border disabled:opacity-50"
        title="削除"
      >
        {isDeleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
      </button>
    </div>
  );
}
