'use client';

import { useState, useRef, useEffect } from 'react';
import { MagazineCard } from '@/components/ui/MagazineCard';
import { Button } from '@/components/ui/button';
import { Sparkles, Send, Bot, User, Loader2, Trash2, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  provider?: string;
}

function TypingText({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 20);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, onComplete]);

  return <p className="whitespace-pre-wrap">{displayedText}</p>;
}

export default function AIAdvisor({ slug }: { slug: string }) {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastProvider, setLastProvider] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isLoading]);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;
    const userMessage = message;
    setMessage('');
    setIsLoading(true);
    setHistory(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const res = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, message: userMessage, history }),
      });
      const data = await res.json();
      if (data.answer) {
        setHistory(data.history);
        setLastProvider(data.provider);
      } else {
        throw new Error(data.error || '回答の取得に失敗しました');
      }
    } catch (error) {
      setHistory(prev => [...prev, { role: 'assistant', content: '申し訳ありません。現在コンシェルジュが応答できません。', provider: 'error' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    if (window.confirm('会話履歴をリセットしてもよろしいですか？')) {
      setHistory([]);
      setLastProvider(null);
    }
  };

  return (
    <section className="mt-16">
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 transition-all">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="font-playfair text-2xl font-bold text-foreground leading-none transition-colors">AI Concierge</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-1 transition-colors">Personal Assistant</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/20 transition-colors">
            <ShieldCheck size={12} />
            <span className="text-[10px] font-bold">Privacy Protected</span>
          </div>
        </div>
        
        {history.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearHistory}
            className="text-muted-foreground hover:text-primary transition-colors gap-2"
          >
            <Trash2 size={14} />
            <span className="text-xs">Reset</span>
          </Button>
        )}
      </div>

      <MagazineCard padding="none" className="overflow-hidden border-border shadow-2xl shadow-primary/5 transition-all">
        <div 
          ref={scrollRef}
          className="h-[450px] overflow-y-auto p-6 space-y-6 bg-secondary/20 transition-colors scroll-smooth no-scrollbar"
        >
          {history.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center px-8">
              <div className="h-16 w-16 rounded-full bg-card flex items-center justify-center mb-6 shadow-sm border border-border transition-colors">
                <Bot size={32} className="text-primary/60" />
              </div>
              <h3 className="font-bold text-foreground mb-2 transition-colors">福岡の旅へようこそ</h3>
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed transition-colors">
                屋台のおすすめや、天気、旅のしおりの相談など。あなたの専属コンシェルジュにお任せください。
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {['おすすめの屋台は？', '明日の天気は？', '予算を教えて'].map(q => (
                  <button 
                    key={q}
                    onClick={() => setMessage(q)}
                    className="text-xs bg-card border border-border text-muted-foreground px-4 py-2 rounded-full hover:border-primary hover:text-primary transition-all shadow-sm active:scale-95"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {history.map((msg, i) => (
            <div 
              key={i} 
              className={cn(
                "flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500",
                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "h-8 w-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm transition-all",
                msg.role === 'user' ? "bg-foreground text-background" : "bg-card text-primary border border-border"
              )}>
                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div className="flex flex-col gap-1.5 max-w-[85%]">
                <div className={cn(
                  "p-4 rounded-3xl text-sm leading-relaxed transition-all",
                  msg.role === 'user' 
                    ? "bg-foreground text-background rounded-tr-none shadow-lg" 
                    : "bg-card text-foreground border border-border shadow-sm rounded-tl-none"
                )}>
                  {msg.role === 'assistant' && i === history.length - 1 && !isLoading ? (
                    <TypingText text={msg.content} />
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>
                {msg.role === 'assistant' && (msg.provider || (i === history.length - 1 && lastProvider)) && (
                  <span className={cn(
                    "text-[9px] font-black uppercase tracking-widest ml-2 flex items-center gap-1 transition-colors",
                    (msg.provider || lastProvider) === 'gemini' ? "text-blue-500" : "text-muted-foreground"
                  )}>
                    Powered by {msg.provider || lastProvider}
                  </span>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4 animate-in fade-in duration-300">
              <div className="h-8 w-8 rounded-xl bg-card border border-border flex items-center justify-center shadow-sm transition-colors">
                <Loader2 size={14} className="text-primary/60 animate-spin" />
              </div>
              <div className="bg-card p-5 rounded-3xl rounded-tl-none border border-border shadow-sm transition-colors">
                <div className="flex gap-1.5 py-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce" />
                  <div className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce delay-150" />
                  <div className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce delay-300" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-5 bg-card border-t border-border transition-colors">
          <div className="flex gap-3 items-end">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.nativeEvent.isComposing) return;
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="コンシェルジュに相談する..."
              className="flex-1 min-h-[48px] max-h-48 p-3 bg-secondary/50 border border-border rounded-2xl text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none resize-none transition-all placeholder:text-muted-foreground text-foreground"
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
              className={cn(
                "h-12 w-12 rounded-2xl shadow-xl shrink-0 p-0 transition-all duration-500",
                !message.trim() || isLoading 
                  ? "bg-secondary text-muted-foreground shadow-none opacity-50" 
                  : "bg-primary text-primary-foreground hover:scale-105 active:scale-95"
              )}
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </Button>
          </div>
          <div className="mt-3 flex justify-between items-center px-1 transition-colors">
            <p className="text-[10px] text-muted-foreground font-medium">
              Shift + Enter で改行
            </p>
            {lastProvider && (
              <p className="text-[9px] text-muted-foreground/60 flex items-center gap-1 uppercase font-black tracking-widest">
                <Sparkles size={10} className="text-primary/60" /> Active Service
              </p>
            )}
          </div>
        </div>
      </MagazineCard>
    </section>
  );
}
