'use client';

import { useState, useMemo } from 'react';
import { Tip } from '@/features/trip/types/trip';
import { MagazineCard } from '@/components/ui/MagazineCard';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Plus, 
  AlertTriangle, 
  Lightbulb, 
  Star, 
  Edit2, 
  Trash2, 
  X,
  Check,
  Circle,
  CheckCircle2,
  Loader2,
  Store,
  LayoutGrid,
  MapPin,
  Ticket,
  Plane,
  Upload,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createTipAction, updateTipAction, deleteTipAction, toggleTipConfirmation } from '../../api/tripActions';
import Image from 'next/image';
import { SafeLink } from '@/features/trip/components/client/SafeLink';

interface TipsListProps {
  initialTips: Tip[];
  tripId: string;
}

const categories = ['All', 'Gourmet', 'Hidden Gem', 'General', 'Warning', 'Transport', 'Reservation'];

export default function TipsList({ initialTips, tripId }: TipsListProps) {
  const [tips, setTips] = useState<Tip[]>(initialTips);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'venue'>('venue');
  const [editingTip, setEditingTip] = useState<Partial<Tip> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedTicketUrl, setSelectedTicketUrl] = useState<string | null>(null);

  // フィルタリング
  const filteredTips = useMemo(() => {
    return tips.filter(tip => {
      const matchesSearch = tip.title.toLowerCase().includes(search.toLowerCase()) || 
                          tip.body.toLowerCase().includes(search.toLowerCase()) ||
                          (tip.venue?.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || 
                             (selectedCategory === 'Warning' ? tip.isWarning : 
                              selectedCategory === 'Reservation' ? (tip.category === 'Reservation' || tip.title.includes('予約') || !!tip.imageUrl) :
                              tip.category === selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [tips, search, selectedCategory]);

  const groupedByVenue = useMemo(() => {
    const groups: Record<string, Tip[]> = {};
    filteredTips.forEach(tip => {
      const v = tip.venue || 'General / Unsorted';
      if (!groups[v]) groups[v] = [];
      groups[v].push(tip);
    });
    return groups;
  }, [filteredTips]);

  const handleToggleConfirm = async (id: string, current: boolean) => {
    try {
      setTips(tips.map(t => t.id === id ? { ...t, isConfirmed: !current } : t));
      await toggleTipConfirmation(id, !current);
    } catch (err) {
      setTips(tips.map(t => t.id === id ? { ...t, isConfirmed: current } : t));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setEditingTip(prev => prev ? { ...prev, imageUrl: data.url } : null);
      }
    } catch (err) {
      alert('アップロードに失敗しました');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTip?.title || !editingTip?.body) return;

    setIsSaving(true);
    try {
      const data = {
        title: editingTip.title,
        body: editingTip.body,
        venue: editingTip.venue || '',
        imageUrl: editingTip.imageUrl || '',
        isWarning: !!editingTip.isWarning,
        isConfirmed: !!editingTip.isConfirmed,
        category: editingTip.category || 'General',
        deepLevel: editingTip.deepLevel || 1,
      };

      if (editingTip.id) {
        await updateTipAction(editingTip.id, data);
        setTips(tips.map(t => t.id === editingTip.id ? { ...t, ...data } : t));
      } else {
        await createTipAction(tripId, data);
        window.location.reload(); 
      }
      setEditingTip(null);
    } catch (err) {
      alert('保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('この項目を削除してもよろしいですか？')) return;
    try {
      await deleteTipAction(id);
      setTips(tips.filter(t => t.id !== id));
    } catch (err) {
      alert('削除に失敗しました');
    }
  };

  const TipCard = ({ tip }: { tip: Tip }) => (
    <MagazineCard 
      padding="md" 
      className={cn(
        "group relative flex flex-col h-full transition-all border-l-4",
        tip.isConfirmed ? "opacity-60 border-l-emerald-500" : 
        tip.isWarning ? "border-l-amber-500 shadow-amber-500/5" : "border-l-primary shadow-primary/5"
      )}
    >
      <div className="flex justify-between items-start mb-6">
        <button 
          onClick={() => tip.id && handleToggleConfirm(tip.id, !!tip.isConfirmed)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border",
            tip.isConfirmed 
              ? "bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20" 
              : "bg-secondary/80 text-muted-foreground border-border hover:border-primary/50"
          )}
        >
          {tip.isConfirmed ? <CheckCircle2 size={12} /> : <Circle size={12} />}
          {tip.isConfirmed ? "Confirmed" : "Pending"}
        </button>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => setEditingTip(tip)} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-primary transition-colors">
            <Edit2 size={14} />
          </button>
          <button onClick={() => tip.id && handleDelete(tip.id)} className="p-2 hover:bg-rose-500/10 rounded-lg text-muted-foreground hover:text-rose-500 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="grow">
        <h3 className={cn(
          "text-lg font-bold mb-2 leading-tight transition-all",
          tip.isConfirmed ? "text-muted-foreground line-through decoration-2" : "text-foreground"
        )}>
          {tip.title}
        </h3>
        <p className="text-[13px] text-muted-foreground leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all">
          {tip.body}
        </p>

        {tip.imageUrl && (
          <button 
            onClick={() => setSelectedTicketUrl(tip.imageUrl || null)}
            className="mt-6 flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-indigo-500 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Ticket size={16} /> View Boarding Pass
          </button>
        )}
      </div>

      <div className="mt-6 pt-5 border-t border-border flex items-center justify-between">
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={10} 
              className={cn(i < (tip.deepLevel || 1) ? "text-amber-400 fill-amber-400" : "text-border")} 
            />
          ))}
        </div>
        <div className={cn(
          "text-[9px] font-black uppercase tracking-[0.2em]",
          tip.isWarning ? "text-amber-500" : "text-primary/60"
        )}>
          {tip.category}
        </div>
      </div>
    </MagazineCard>
  );

  return (
    <div className="space-y-10">
      {/* ─── Controls ─── */}
      <div className="flex flex-col gap-6 bg-card p-6 rounded-[2.5rem] border border-border shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text"
              placeholder="お店名、タイトル、予約情報..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-secondary/50 border-none rounded-2xl text-sm transition-all v2-focus"
            />
          </div>

          <div className="flex bg-secondary/50 p-1 rounded-2xl shrink-0">
            <button 
              onClick={() => setViewMode('venue')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                viewMode === 'venue' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Store size={14} /> Shop View
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                viewMode === 'grid' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <LayoutGrid size={14} /> All List
            </button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap",
                  selectedCategory === cat 
                    ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20" 
                    : "bg-secondary/30 border-transparent text-muted-foreground hover:bg-secondary"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <Button 
            onClick={() => setEditingTip({ title: '', body: '', venue: '', imageUrl: '', isWarning: false, isConfirmed: false, category: 'General', deepLevel: 1 })}
            className="rounded-2xl gap-2 h-12 px-6 w-full md:w-auto"
          >
            <Plus size={18} />
            <span>Add New Item</span>
          </Button>
        </div>
      </div>

      {/* ─── Content Area ─── */}
      {viewMode === 'venue' ? (
        <div className="space-y-16">
          {Object.entries(groupedByVenue).map(([venue, venueTips]) => (
            <div key={venue} className="space-y-6">
              <div className="flex items-center gap-4 px-2">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <MapPin size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground leading-none">{venue}</h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-1">
                    {venueTips.length} Items for this location
                  </p>
                </div>
                <div className="h-px grow bg-border ml-4" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {venueTips.map(tip => <TipCard key={tip.id} tip={tip} />)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTips.map((tip) => <TipCard key={tip.id} tip={tip} />)}
        </div>
      )}

      {/* ─── Ticket Lightbox ─── */}
      {selectedTicketUrl && (
        <div 
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedTicketUrl(null)}
        >
          <div className="relative w-full max-w-xl h-full flex flex-col items-center justify-center gap-8">
            <button className="absolute top-0 right-0 p-4 text-white hover:scale-110 transition-transform">
              <X size={32} />
            </button>
            <div className="relative w-full aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10">
              <Image src={selectedTicketUrl} alt="Ticket" fill className="object-contain" />
            </div>
            <p className="text-white/60 text-xs font-black uppercase tracking-widest bg-white/10 px-6 py-2 rounded-full">
              Screen Tap to Close
            </p>
          </div>
        </div>
      )}

      {/* ─── Edit Modal ─── */}
      {editingTip && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setEditingTip(null)} />
          <MagazineCard padding="lg" className="relative w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-200 border-primary/20">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-foreground">
                {editingTip.id ? 'Edit Item' : 'New Item'}
              </h2>
              <button onClick={() => setEditingTip(null)} className="p-2 hover:bg-secondary rounded-full">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Location / Shop Name</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input 
                    value={editingTip.venue || ''}
                    onChange={(e) => setEditingTip({ ...editingTip, venue: e.target.value })}
                    className="w-full pl-12 pr-5 py-4 bg-secondary/50 border border-border rounded-2xl transition-all v2-focus"
                    placeholder="例：福岡空港 / ヒルトン福岡"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Title</label>
                <input 
                  autoFocus
                  value={editingTip.title || ''}
                  onChange={(e) => setEditingTip({ ...editingTip, title: e.target.value })}
                  className="w-full px-5 py-4 bg-secondary/50 border border-border rounded-2xl transition-all v2-focus"
                  placeholder="例：搭乗券（tomoya） / 予約番号"
                  required
                />
              </div>

              <div className="space-y-4 p-5 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/20">
                <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400 ml-1 flex items-center gap-2">
                  <Ticket size={12} /> Boarding Pass / Screenshot
                </label>
                
                {editingTip.imageUrl ? (
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden border-2 border-indigo-500 shadow-lg group">
                    <Image src={editingTip.imageUrl} alt="Ticket preview" fill className="object-cover" />
                    <button 
                      type="button"
                      onClick={() => setEditingTip({ ...editingTip, imageUrl: '' })}
                      className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={24} className="text-white" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full aspect-video rounded-2xl border-2 border-dashed border-indigo-500/30 bg-indigo-500/5 hover:bg-indigo-500/10 cursor-pointer transition-all">
                    {isUploading ? (
                      <Loader2 className="animate-spin text-indigo-500" size={32} />
                    ) : (
                      <>
                        <Upload size={32} className="text-indigo-400 mb-2" />
                        <span className="text-xs font-bold text-indigo-400">スクリーンショットをアップロード</span>
                      </>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  </label>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Category</label>
                  <select 
                    value={editingTip.category || 'General'}
                    onChange={(e) => setEditingTip({ ...editingTip, category: e.target.value })}
                    className="w-full px-5 py-4 bg-secondary/50 border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none appearance-none"
                  >
                    {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Priority</label>
                  <input 
                    type="number" min="1" max="5"
                    value={editingTip.deepLevel || 1}
                    onChange={(e) => setEditingTip({ ...editingTip, deepLevel: parseInt(e.target.value) })}
                    className="w-full px-5 py-4 bg-secondary/50 border border-border rounded-2xl v2-focus"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Details</label>
                <textarea 
                  rows={3}
                  value={editingTip.body || ''}
                  onChange={(e) => setEditingTip({ ...editingTip, body: e.target.value })}
                  className="w-full px-5 py-4 bg-secondary/50 border border-border rounded-2xl transition-all resize-none v2-focus"
                  placeholder="予約番号や座席番号など..."
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="secondary" 
                  className="flex-1 h-14 rounded-2xl"
                  onClick={() => setEditingTip(null)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSaving || isUploading}
                  className="flex-1 h-14 rounded-2xl gap-2"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                  Save Item
                </Button>
              </div>
            </form>
          </MagazineCard>
        </div>
      )}
    </div>
  );
}
