'use client';

import { useState, useTransition } from 'react';
import { PackingItem } from '@prisma/client';
import { MagazineCard } from '@/components/ui/MagazineCard';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Package, 
  Shirt, 
  Smartphone, 
  Briefcase,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { addPackingItemAction, togglePackingItemAction, deletePackingItemAction } from '../../api/tripActions';

interface Props {
  initialItems: PackingItem[];
  tripId: string;
}

const CATEGORIES = [
  { id: 'Essential', label: '必需品', icon: Package },
  { id: 'Clothing', label: '衣類', icon: Shirt },
  { id: 'Gadget', label: 'ガジェット', icon: Smartphone },
  { id: 'Other', label: 'その他', icon: Briefcase },
];

export default function PackingList({ initialItems, tripId }: Props) {
  const [items, setItems] = useState(initialItems);
  const [activeTab, setActiveTab] = useState('Essential');
  const [newItemName, setNewItemName] = useState('');
  const [isPending, startTransition] = useTransition();

  const filteredItems = items.filter(item => item.category === activeTab);
  const totalCount = items.length;
  const packedCount = items.filter(item => item.isPacked).length;
  const progress = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;

  const handleToggle = async (id: string, currentStatus: boolean) => {
    // 楽観的アップデート
    setItems(items.map(item => item.id === id ? { ...item, isPacked: !currentStatus } : item));
    
    startTransition(async () => {
      await togglePackingItemAction(id, !currentStatus);
    });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const tempId = `temp-${Date.now()}`;
    const newItem = {
      id: tempId,
      tripId,
      name: newItemName,
      category: activeTab,
      isPacked: false,
      order: 0
    };

    setItems([...items, newItem]);
    setNewItemName('');

    startTransition(async () => {
      await addPackingItemAction(tripId, newItemName, activeTab);
    });
  };

  const handleDelete = async (id: string) => {
    setItems(items.filter(item => item.id !== id));
    startTransition(async () => {
      await deletePackingItemAction(id);
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* ─── Progress Overview ─── */}
      <MagazineCard padding="lg" className="bg-linear-to-br from-primary/5 to-transparent border-primary/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black text-foreground mb-2">Packing Progress</h2>
            <p className="text-sm text-muted-foreground">忘れ物はありませんか？準備を整えましょう。</p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="text-4xl font-playfair font-black text-primary">{progress}%</div>
            <div className="w-48 h-2 bg-secondary rounded-full overflow-hidden border border-border">
              <div 
                className="h-full bg-primary transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(var(--primary),0.5)]" 
                style={{ width: `${progress}%` }} 
              />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">
              {packedCount} / {totalCount} items packed
            </span>
          </div>
        </div>
      </MagazineCard>

      {/* ─── Tabs ─── */}
      <div className="flex flex-wrap gap-2 overflow-x-auto no-scrollbar pb-2">
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const count = items.filter(i => i.category === cat.id).length;
          const isPackedAll = count > 0 && items.filter(i => i.category === cat.id && i.isPacked).length === count;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={cn(
                "flex items-center gap-3 px-6 py-4 rounded-3xl border transition-all whitespace-nowrap relative",
                activeTab === cat.id 
                  ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "bg-card border-border text-muted-foreground hover:border-primary/50"
              )}
            >
              <Icon size={18} />
              <span className="text-xs font-black uppercase tracking-widest">{cat.label}</span>
              {count > 0 && (
                <span className={cn(
                  "ml-1 px-2 py-0.5 rounded-full text-[10px] font-black",
                  activeTab === cat.id ? "bg-white/20" : "bg-secondary text-muted-foreground"
                )}>
                  {count}
                </span>
              )}
              {isPackedAll && (
                <CheckCircle2 size={12} className="absolute -top-1 -right-1 text-emerald-500 fill-white dark:fill-zinc-950" />
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
              "group flex items-center gap-4 p-5 rounded-article border transition-all duration-300",
              item.isPacked 
                ? "bg-secondary/30 border-transparent opacity-60" 
                : "bg-card border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
            )}
          >
            <button 
              onClick={() => handleToggle(item.id, item.isPacked)}
              className={cn(
                "h-7 w-7 rounded-xl flex items-center justify-center transition-all",
                item.isPacked 
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                  : "bg-secondary text-muted-foreground border border-border hover:border-primary/50"
              )}
            >
              {item.isPacked ? <CheckCircle2 size={16} /> : <Circle size={16} />}
            </button>

            <span className={cn(
              "flex-1 text-sm font-bold transition-all",
              item.isPacked ? "text-muted-foreground line-through decoration-2" : "text-foreground"
            )}>
              {item.name}
            </span>

            <button 
              onClick={() => handleDelete(item.id)}
              className="p-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-rose-500"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        {/* ─── Add New ─── */}
        <form onSubmit={handleAdd} className="mt-4">
          <div className="relative group">
            <input 
              type="text"
              placeholder={`${activeTab === 'Gadget' ? '充電器、カメラなど...' : '持ち物を追加...'}`}
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="w-full pl-6 pr-16 py-5 bg-secondary/50 border border-transparent rounded-[2rem] text-sm focus:ring-4 focus:ring-primary/10 focus:bg-card focus:border-primary/30 transition-all outline-none"
            />
            <button 
              type="submit"
              disabled={!newItemName.trim() || isPending}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-11 w-11 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:scale-100 transition-all"
            >
              {isPending ? <Loader2 size={18} className="animate-spin" /> : <Plus size={20} />}
            </button>
          </div>
        </form>

        {filteredItems.length === 0 && !newItemName && (
          <div className="py-16 text-center border-2 border-dashed border-border rounded-[2.5rem] bg-secondary/10">
            <Package size={40} className="mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground font-medium">このカテゴリーの持ち物はまだありません</p>
          </div>
        )}
      </div>
    </div>
  );
}
