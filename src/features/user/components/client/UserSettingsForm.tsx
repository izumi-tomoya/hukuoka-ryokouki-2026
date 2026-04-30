'use client';

import { useState, useEffect } from 'react';
import { updateUserProfile } from '../../api/userActions';
import { Button } from '@/components/ui/button';
import { Check, AlertCircle, Loader2, Moon, Sun, Monitor } from 'lucide-react';

interface UserSettingsFormProps {
  initialName: string | null | undefined;
  initialMotto: string | null | undefined;
}

export function UserSettingsForm({ initialName, initialMotto }: UserSettingsFormProps) {
  const [name, setName] = useState(initialName || '');
  const [motto, setMotto] = useState(initialMotto || '');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // テーマの初期化（localStorageなどから取得）
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    if (savedTheme) setTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark' || (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await updateUserProfile({ name, motto });
      if (result.success) {
        setMessage({ type: 'success', text: 'プロフィールを更新しました' });
      } else {
        setMessage({ type: 'error', text: result.error || '更新に失敗しました' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'エラーが発生しました' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 基本情報 */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">
              ユーザー名
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-5 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-900 dark:text-zinc-100 text-sm font-medium transition-all v2-focus"
              placeholder="あなたの名前"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="motto" className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">
              旅のモットー / 一言
            </label>
            <textarea
              id="motto"
              value={motto}
              onChange={(e) => setMotto(e.target.value)}
              rows={3}
              className="w-full px-5 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-900 dark:text-zinc-100 text-sm font-medium transition-all resize-none v2-focus"
              placeholder="例：一期一会を大切に。美味しいものを求めて。"
            />
          </div>
        </div>

        {/* テーマ設定 */}
        <div className="space-y-4">
          <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">
            画面テーマ
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'light', icon: Sun, label: 'Light' },
              { id: 'dark', icon: Moon, label: 'Dark' },
              { id: 'system', icon: Monitor, label: 'System' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => applyTheme(item.id as any)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                  theme === item.id
                    ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900'
                    : 'bg-stone-50 text-zinc-500 border-zinc-100 dark:bg-zinc-800/50 dark:border-zinc-800 dark:text-zinc-400'
                }`}
              >
                <item.icon size={20} />
                <span className="text-[10px] font-black uppercase tracking-wider">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {message && (
          <div
            className={`flex items-center gap-3 text-sm p-4 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300 ${
              message.type === 'success' 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                : 'bg-rose-50 text-rose-700 border border-rose-100'
            }`}
          >
            {message.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
            <span className="font-bold">{message.text}</span>
          </div>
        )}

        <Button 
          type="submit" 
          disabled={isLoading || (name === initialName && motto === initialMotto)} 
          className="w-full py-6 rounded-2xl text-sm font-black transition-all bg-zinc-900 text-white hover:bg-zinc-800 shadow-md disabled:bg-zinc-100 disabled:text-zinc-400"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 size={18} className="animate-spin" />
              更新中...
            </span>
          ) : (
            'プロフィールを保存'
          )}
        </Button>
      </form>
    </div>
  );
}
