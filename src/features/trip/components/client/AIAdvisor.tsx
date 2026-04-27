'use client';

import { useState, useRef, useEffect } from 'react';
import { MagazineCard } from '@/components/ui/MagazineCard';
import { Button } from '@/components/ui/button';
import { Sparkles, Send, Bot, User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIAdvisor({ slug }: { slug: string }) {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message;
    setMessage('');
    setIsLoading(true);

    // 楽観的アップデート（ユーザーメッセージを表示）
    const newHistory: Message[] = [...history, { role: 'user', content: userMessage }];
    setHistory(newHistory);

    try {
      const res = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, message: userMessage, history }),
      });

      const data = await res.json();
      if (data.answer) {
        setHistory(data.history);
      } else {
        throw new Error(data.error || '回答の取得に失敗しました');
      }
    } catch (error) {
      console.error('AI Advisor Error:', error);
      setHistory([...newHistory, { role: 'assistant', content: '申し訳ありません。エラーが発生しました。' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mt-16">
      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-2xl bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-200">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="font-playfair text-2xl font-bold text-stone-900 leading-none">AI Concierge</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-400 mt-1">Personal Assistant</p>
          </div>
        </div>
        <div className="h-px flex-1 bg-stone-100" />
      </div>

      <MagazineCard padding="none" className="overflow-hidden border-rose-100 shadow-xl shadow-rose-100/20">
        {/* Chat Display Area */}
        <div 
          ref={scrollRef}
          className="h-[400px] overflow-y-auto p-6 space-y-6 bg-stone-50/30"
        >
          {history.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center px-8">
              <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
                <Bot size={32} className="text-rose-300" />
              </div>
              <h3 className="font-bold text-stone-800 mb-2">何かお手伝いしましょうか？</h3>
              <p className="text-sm text-stone-500 max-w-xs">
                「おすすめの屋台は？」「明日の服装は？」「雨が降ったらどうする？」など、何でも聞いてください。
              </p>
            </div>
          )}

          {history.map((msg, i) => (
            <div 
              key={i} 
              className={cn(
                "flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "h-8 w-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm",
                msg.role === 'user' ? "bg-stone-800 text-white" : "bg-white text-rose-500 border border-rose-50"
              )}>
                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div className={cn(
                "max-w-[80%] p-4 rounded-3xl text-sm leading-relaxed",
                msg.role === 'user' 
                  ? "bg-stone-800 text-white rounded-tr-none" 
                  : "bg-white text-stone-700 border border-stone-100 shadow-sm rounded-tl-none"
              )}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4 animate-pulse">
              <div className="h-8 w-8 rounded-xl bg-white border border-rose-50 flex items-center justify-center shadow-sm">
                <Loader2 size={14} className="text-rose-300 animate-spin" />
              </div>
              <div className="bg-white p-4 rounded-3xl rounded-tl-none border border-stone-100 shadow-sm">
                <div className="flex gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-rose-200 animate-bounce" />
                  <div className="h-1.5 w-1.5 rounded-full bg-rose-200 animate-bounce delay-75" />
                  <div className="h-1.5 w-1.5 rounded-full bg-rose-200 animate-bounce delay-150" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-rose-50 flex gap-2 items-end">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              // 変換中（IME）の Enter は無視する
              if (e.nativeEvent.isComposing) return;

              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="AIに相談する... (Shift+Enterで改行)"
            className="flex-1 min-h-[44px] max-h-48 p-3 bg-stone-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-rose-500/20 resize-none transition-all"
            rows={1}
            style={{ height: 'auto' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${target.scrollHeight}px`;
            }}
          />
          <Button 
            onClick={handleSend} 
            disabled={!message.trim() || isLoading}
            className="h-11 w-11 rounded-2xl bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-200 shrink-0 p-0"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </Button>
        </div>
      </MagazineCard>
    </section>
  );
}
