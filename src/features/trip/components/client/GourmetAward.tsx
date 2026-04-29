'use client';

import { GourmetAward } from '@prisma/client';
import { MagazineCard } from '@/components/ui/MagazineCard';
import { Trophy, Quote, Trash2, Award, Star } from 'lucide-react';
import Image from 'next/image';
import { deleteGourmetAwardAction } from '../../api/tripActions';
import { useTransition } from 'react';

interface Props {
  award: GourmetAward;
  isAdmin?: boolean;
}

export default function GourmetAwardCard({ award, isAdmin }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!window.confirm('このアワードを削除しますか？')) return;
    startTransition(async () => {
      await deleteGourmetAwardAction(award.id);
    });
  };

  return (
    <MagazineCard padding="none" className="group relative overflow-hidden bg-zinc-900 border-zinc-800 text-white min-h-[400px] flex flex-col transition-all hover:scale-[1.01] hover:shadow-2xl hover:shadow-primary/20">
      {/* ─── Background Photo ─── */}
      {award.imageUrl ? (
        <div className="absolute inset-0 z-0">
          <Image src={award.imageUrl} alt={award.title} fill className="object-cover opacity-60 group-hover:scale-110 transition-transform duration-[2000ms]" />
          <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-900/40 to-transparent" />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-linear-to-br from-rose-900/40 to-indigo-950" />
      )}

      {/* ─── Award Badge ─── */}
      <div className="relative z-10 p-8 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500 text-black font-black text-[9px] uppercase tracking-widest shadow-xl">
              <Trophy size={10} /> {award.category}
            </div>
            <div className="text-[10px] font-bold text-amber-500/80 uppercase tracking-[0.3em] ml-1 mt-2">
              Award Recipient 2026
            </div>
          </div>

          {isAdmin && (
            <button 
              onClick={handleDelete}
              disabled={isPending}
              className="p-2 bg-white/10 hover:bg-rose-500/20 rounded-xl transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={16} className="text-white/60 group-hover:text-rose-400" />
            </button>
          )}
        </div>

        <div className="mt-auto pt-20">
          <div className="flex items-center gap-1 mb-4 text-amber-400">
            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
          </div>
          
          <h3 className="font-playfair text-4xl md:text-5xl font-black leading-none tracking-tighter mb-4 italic">
            {award.title}
          </h3>

          {award.comment && (
            <div className="relative pt-6 border-t border-white/10 mt-6">
              <Quote size={20} className="absolute top-4 left-0 text-amber-500/30 -translate-x-1" />
              <p className="text-sm md:text-base font-medium text-zinc-100 leading-relaxed italic pl-6">
                {award.comment}
              </p>
            </div>
          )}

          <div className="mt-10 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/40">Fukuoka Journey</span>
              <span className="text-[10px] font-bold text-white/60">Selected by Duo</span>
            </div>
            <div className="h-12 w-12 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md">
              <Award size={20} className="text-amber-500" />
            </div>
          </div>
        </div>
      </div>
    </MagazineCard>
  );
}
