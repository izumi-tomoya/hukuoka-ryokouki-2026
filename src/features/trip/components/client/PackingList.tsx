"use client";

import type { PackingItem } from "@prisma/client";
import { Briefcase, CheckCircle2, Circle, ExternalLink, Loader2, Package, Plus, Shirt, Smartphone, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { MagazineCard } from "@/components/ui/MagazineCard";
import { cn } from "@/lib/utils";
import { addPackingItemAction, deletePackingItemAction, togglePackingItemAction } from "../../api/tripActions";

interface Props {
  initialItems: PackingItem[];
  tripId: string;
}

const CATEGORIES = [
  { id: "Essential", label: "必需品", icon: Package },
  { id: "Clothing", label: "衣類", icon: Shirt },
  { id: "Gadget", label: "ガジェット", icon: Smartphone },
  { id: "Other", label: "その他", icon: Briefcase },
];

export default function PackingList({ initialItems, tripId }: Props) {
  const params = useParams();
  const slug = params?.slug as string;
  const [items, setItems] = useState(initialItems);
  const [activeTab, setActiveTab] = useState("Essential");
  const [newItemName, setNewItemName] = useState("");
  const [isPending, setIsPending] = useState(false);

  const filteredItems = items.filter((item) => item.category === activeTab);
  const totalCount = items.length;
  const packedCount = items.filter((item) => item.isPacked).length;
  const progress = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;

  const handleToggle = async (id: string, currentStatus: boolean) => {
    // 楽観的アップデート
    setItems(items.map((item) => (item.id === id ? { ...item, isPacked: !currentStatus } : item)));

    setIsPending(true);
    try {
      await togglePackingItemAction(id, !currentStatus);
    } finally {
      setIsPending(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || isPending) return;

    const tempId = `temp-${Date.now()}`;
    const newItem = {
      id: tempId,
      tripId,
      name: newItemName,
      category: activeTab,
      isPacked: false,
      order: 0,
    };

    setItems([...items, newItem]);
    setNewItemName("");

    setIsPending(true);
    try {
      await addPackingItemAction(tripId, newItemName, activeTab);
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async (id: string) => {
    setItems(items.filter((item) => item.id !== id));
    setIsPending(true);
    try {
      await deletePackingItemAction(id);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-700 md:space-y-8">
      {/* ─── Progress Overview ─── */}
      <MagazineCard padding="lg" className="from-primary/5 border-primary/10 min-w-0 bg-linear-to-br to-transparent">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="min-w-0">
            <h2 className="text-foreground mb-2 text-2xl font-black wrap-break-word">Packing Progress</h2>
            <p className="text-muted-foreground text-sm">忘れ物はありませんか？準備を整えましょう。</p>
          </div>
          <div className="flex w-full flex-col items-center gap-2 md:w-auto md:items-end">
            <div className="font-playfair text-primary text-4xl font-black">{progress}%</div>
            <div className="bg-secondary border-border h-2 w-full max-w-48 overflow-hidden rounded-full border">
              <div
                className="bg-primary h-full shadow-[0_0_12px_rgba(var(--primary),0.5)] transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-muted-foreground mt-1 text-center text-[10px] font-black tracking-[0.14em] uppercase sm:tracking-widest">
              {packedCount} / {totalCount} items packed
            </span>
          </div>
        </div>
      </MagazineCard>

      {/* ─── Tabs ─── */}
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const count = items.filter((i) => i.category === cat.id).length;
          const isPackedAll = count > 0 && items.filter((i) => i.category === cat.id && i.isPacked).length === count;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={cn(
                "relative flex min-h-12 shrink-0 items-center gap-3 rounded-3xl border px-5 py-3.5 whitespace-nowrap transition-all sm:px-6 sm:py-4",
                activeTab === cat.id
                  ? "bg-primary border-primary text-primary-foreground shadow-primary/20 shadow-lg"
                  : "bg-card border-border text-muted-foreground hover:border-primary/50",
              )}
            >
              <Icon size={18} />
              <span className="text-xs font-black tracking-widest uppercase">{cat.label}</span>
              {count > 0 && (
                <span
                  className={cn(
                    "ml-1 rounded-full px-2 py-0.5 text-[10px] font-black",
                    activeTab === cat.id ? "bg-white/20" : "bg-secondary text-muted-foreground",
                  )}
                >
                  {count}
                </span>
              )}
              {isPackedAll && (
                <CheckCircle2
                  size={12}
                  className="absolute -top-1 -right-1 fill-white text-emerald-500 dark:fill-zinc-950"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ─── List Area ─── */}
      <div className="grid gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={cn(
              "group md:rounded-article flex min-w-0 items-center gap-3 rounded-3xl border p-4 transition-all duration-300 sm:gap-4 sm:p-5",
              item.isPacked
                ? "bg-secondary/30 border-transparent opacity-60"
                : "bg-card border-border hover:border-primary/30 hover:shadow-primary/5 hover:shadow-xl",
            )}
          >
            <button
              onClick={() => handleToggle(item.id, item.isPacked)}
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all",
                item.isPacked
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                  : "bg-secondary text-muted-foreground border-border hover:border-primary/50 border",
              )}
            >
              {item.isPacked ? <CheckCircle2 size={16} /> : <Circle size={16} />}
            </button>

            <span
              className={cn(
                "min-w-0 flex-1 text-sm font-bold wrap-break-word transition-all",
                item.isPacked ? "text-muted-foreground line-through decoration-2" : "text-foreground",
              )}
            >
              {item.name}
            </span>

            <button
              onClick={() => handleDelete(item.id)}
              className="text-muted-foreground min-h-10 min-w-10 p-2 opacity-100 transition-opacity group-hover:opacity-100 hover:text-rose-500 sm:opacity-0"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        {/* ─── Add New ─── */}
        <form onSubmit={handleAdd} className="mt-4">
          <div className="group relative">
            <input
              type="text"
              placeholder={`${activeTab === "Gadget" ? "充電器、カメラなど..." : "持ち物を追加..."}`}
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="bg-secondary/50 focus:bg-card focus:border-primary/30 v2-focus min-h-14 w-full rounded-3xl border border-transparent py-4 pr-16 pl-5 text-base transition-all sm:rounded-[2rem] sm:py-5 sm:pl-6 sm:text-sm"
            />
            <button
              type="submit"
              disabled={!newItemName.trim() || isPending}
              className="bg-primary text-primary-foreground shadow-primary/20 absolute top-1/2 right-2.5 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-30 sm:right-3"
            >
              {isPending ? <Loader2 size={18} className="animate-spin" /> : <Plus size={20} />}
            </button>
          </div>
        </form>

        {filteredItems.length === 0 && !newItemName && (
          <div className="border-border bg-secondary/10 rounded-[1.75rem] border-2 border-dashed px-4 py-12 text-center sm:rounded-[2.5rem] sm:py-16">
            <Package size={40} className="text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">このカテゴリーの持ち物はまだありません</p>
          </div>
        )}

        <div className="mt-4 flex justify-center">
          <Link
            href={`/trip/${slug}/checklist/${activeTab.toLowerCase()}`}
            className="text-primary hover:text-primary/80 inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase transition-colors"
          >
            <ExternalLink size={14} />
            {activeTab} チェックリストを詳しく見る
          </Link>
        </div>
      </div>
    </div>
  );
}
