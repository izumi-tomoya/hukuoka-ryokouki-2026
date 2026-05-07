'use client';

import { useState, useTransition } from 'react';
import { MagazineCard } from '@/components/ui/MagazineCard';
import { Button } from '@/components/ui/button';
import { X, Trophy, Star, Camera, Check, Loader2, Upload } from 'lucide-react';
import { addGourmetAwardAction } from '../../api/tripActions';
import Image from 'next/image';

interface Props {
  tripId: string;
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  'Best Ramen',
  'Best Yatai',
  'Best Street Food',
  'Best Dessert',
  'Best Atmosphere',
  'Most Memorable',
  'Special Mention'
];

export default function AddAwardModal({ tripId, isOpen, onClose }: Props) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [comment, setComment] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) setImageUrl(data.url);
    } catch {
      alert('アップロードに失敗しました');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await addGourmetAwardAction(tripId, {
        title,
        category,
        comment,
        imageUrl
      });
      if (res.success) {
        onClose();
        setTitle('');
        setComment('');
        setImageUrl('');
      } else {
        alert(res.error);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      <MagazineCard padding="lg" className="relative w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-300 border-primary/20 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-amber-500 flex items-center justify-center text-black">
              <Trophy size={20} />
            </div>
            <h2 className="text-2xl font-black text-foreground">New Gourmet Award</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Award Title / Shop Name</label>
              <input 
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-5 py-4 bg-secondary/50 border border-border rounded-2xl transition-all text-foreground placeholder:text-muted-foreground/50 v2-focus"
                placeholder="例：博多一双 / 元祖長浜屋"
                required
              />
            </div>
            <div className="space-y-2 relative">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-5 py-4 bg-secondary/50 border border-border rounded-2xl appearance-none text-foreground dark:bg-card v2-focus"
              >
                {CATEGORIES.map(c => <option key={c} value={c} className="bg-card text-foreground">{c}</option>)}
              </select>
              <div className="absolute right-5 bottom-4 pointer-events-none text-muted-foreground">
                <Star size={16} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Comments</label>
            <textarea 
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-5 py-4 bg-secondary/50 border border-border rounded-2xl transition-all resize-none text-foreground placeholder:text-muted-foreground/50 v2-focus"
              placeholder="なぜこのお店が最高だったのか、二人の感想をメモしましょう..."
            />
          </div>

          {/* Photo Upload Area */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
              <Camera size={12} /> Award Photo
            </label>
            
            {imageUrl ? (
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border-2 border-primary shadow-xl group">
                <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                <button 
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={32} className="text-white" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full aspect-video rounded-3xl border-2 border-dashed border-border bg-secondary/20 hover:bg-secondary/40 cursor-pointer transition-all">
                {isUploading ? (
                  <Loader2 className="animate-spin text-primary" size={32} />
                ) : (
                  <>
                    <Upload size={32} className="text-muted-foreground mb-3" />
                    <span className="text-xs font-bold text-muted-foreground">最高の1枚をアップロード</span>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button 
              type="button" 
              variant="secondary" 
              className="flex-1 h-16 rounded-2xl text-xs font-black uppercase tracking-widest"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isPending || isUploading || !title}
              className="flex-1 h-16 rounded-2xl gap-3 text-xs font-black uppercase tracking-widest"
            >
              {isPending ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
              Confirm Award
            </Button>
          </div>
        </form>
      </MagazineCard>
    </div>
  );
}
