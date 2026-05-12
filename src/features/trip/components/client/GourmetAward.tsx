"use client";

import type { GourmetAward } from "@prisma/client";
import { Award, Quote, Star, Trash2, Trophy } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { MagazineCard } from "@/components/ui/MagazineCard";
import { maskSecretText } from "@/features/trip/utils/tripUtils";
import { deleteGourmetAwardAction } from "../../api/tripActions";

interface Props {
  award: GourmetAward;
  isAdmin?: boolean;
}

export default function GourmetAwardCard({ award, isAdmin }: Props) {
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("このアワードを削除しますか？")) return;
    setIsPending(true);
    try {
      await deleteGourmetAwardAction(award.id);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <MagazineCard
      padding="none"
      className="group hover:shadow-primary/20 relative flex min-h-[400px] flex-col overflow-hidden border-zinc-800 bg-zinc-900 text-white transition-all hover:scale-[1.01] hover:shadow-2xl"
    >
      {/* ─── Background Photo ─── */}
      {award.imageUrl ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={award.imageUrl}
            alt={award.title}
            fill
            className="object-cover opacity-60 transition-transform duration-[2000ms] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-900/40 to-transparent" />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-linear-to-br from-rose-900/40 to-indigo-950" />
      )}

      {/* ─── Award Badge ─── */}
      <div className="relative z-10 flex h-full flex-col justify-between p-8">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-3 py-1 text-[9px] font-black tracking-widest text-black uppercase shadow-xl">
              <Trophy size={10} /> {award.category}
            </div>
            <div className="mt-2 ml-1 text-[10px] font-bold tracking-[0.3em] text-amber-500/80 uppercase">
              Award Recipient 2026
            </div>
          </div>

          {isAdmin && (
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="v2-focus rounded-xl bg-white/10 p-2 opacity-0 transition-all group-hover:opacity-100 hover:bg-rose-500/20"
            >
              <Trash2 size={16} className="text-white/60 group-hover:text-rose-400" />
            </button>
          )}
        </div>

        <div className="mt-auto pt-20">
          <div className="mb-4 flex items-center gap-1 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} fill="currentColor" />
            ))}
          </div>

          <h3 className="font-playfair mb-4 text-4xl leading-none font-black tracking-tighter italic md:text-5xl">
            {maskSecretText(award.title, !!isAdmin)}
          </h3>

          {award.comment && (
            <div className="relative mt-6 border-t border-white/10 pt-6">
              <Quote size={20} className="absolute top-4 left-0 -translate-x-1 text-amber-500/30" />
              <p className="pl-6 text-sm leading-relaxed font-medium text-zinc-100 italic md:text-base">
                {maskSecretText(award.comment, !!isAdmin)}
              </p>
            </div>
          )}

          <div className="mt-10 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[8px] font-black tracking-[0.4em] text-white/40 uppercase">Fukuoka Journey</span>
              <span className="text-[10px] font-bold text-white/60">Selected by Duo</span>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 backdrop-blur-md">
              <Award size={20} className="text-amber-500" />
            </div>
          </div>
        </div>
      </div>
    </MagazineCard>
  );
}
