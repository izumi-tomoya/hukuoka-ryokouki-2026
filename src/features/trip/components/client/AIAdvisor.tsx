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

/**
 * タイピングアニメーション付きのテキストコンポーネント
 */
function TypingText({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 20); // タイピング速度
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

    // 楽観的アップデート（ユーザーメッセージを表示）
    const currentHistory = [...history];
    setHistory([...currentHistory, { role: 'user', content: userMessage }]);

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
      console.error('AI Advisor Error:', error);
      setHistory(prev => [...prev, { role: 'assistant', content: '申し訳ありません。現在コンシェルジュが応答できません。', provider: 'error' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    if (window.confirm('会話履歴をリセットしてもよろしいですか？（AIの記憶がリセットされます）')) {
      setHistory([]);
      setLastProvider(null);
    }
  };

  return (
    <section className="mt-16">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-2xl bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-200">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="font-playfair text-2xl font-bold text-stone-900 leading-none">AI Concierge</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-400 mt-1">Personal Assistant</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
            <ShieldCheck size={12} />
            <span className="text-[10px] font-bold">Privacy Protected</span>
          </div>
        </div>
        
        {history.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearHistory}
            className="text-stone-400 hover:text-rose-500 hover:bg-rose-50 transition-colors gap-2"
          >
            <Trash2 size={14} />
            <span className="text-xs">Reset</span>
          </Button>
        )}
      </div>

      <MagazineCard padding="none" className="overflow-hidden border-rose-100 shadow-xl shadow-rose-100/20">
        {/* Chat Display Area */}
        <div 
          ref={scrollRef}
          className="h-[450px] overflow-y-auto p-6 space-y-6 bg-stone-50/30 scroll-smooth"
        >
          {history.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center px-8">
              <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm border border-stone-100">
                <Bot size={32} className="text-rose-300" />
              </div>
              <h3 className="font-bold text-stone-800 mb-2">福岡の旅へようこそ</h3>
              <p className="text-sm text-stone-500 max-w-xs leading-relaxed">
                屋台のおすすめや、天気、旅のしおりの相談など。あなたの専属コンシェルジュにお任せください。
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {['おすすめの屋台は？', '明日の天気は？', '予算を教えて'].map(q => (
                  <button 
                    key={q}
                    onClick={() => { setMessage(q); }}
                    className="text-xs bg-white border border-stone-200 text-stone-600 px-3 py-2 rounded-full hover:border-rose-300 hover:text-rose-500 transition-all shadow-sm"
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
                "h-8 w-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm",
                msg.role === 'user' ? "bg-stone-800 text-white" : "bg-white text-rose-500 border border-rose-50"
              )}>
                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div className="flex flex-col gap-1 max-w-[85%]">
                <div className={cn(
                  "p-4 rounded-3xl text-sm leading-relaxed",
                  msg.role === 'user' 
                    ? "bg-stone-800 text-white rounded-tr-none shadow-md shadow-stone-200" 
                    : "bg-white text-stone-700 border border-stone-100 shadow-sm rounded-tl-none"
                )}>
                  {/* 最新のAI回答のみタイピング表示 */}
                  {msg.role === 'assistant' && i === history.length - 1 && !isLoading ? (
                    <TypingText text={msg.content} />
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>
                {msg.role === 'assistant' && (msg.provider || (i === history.length - 1 && lastProvider)) && (
                  <span className={cn(
                    "text-[9px] font-bold uppercase tracking-widest ml-2 flex items-center gap-1",
                    (msg.provider || lastProvider) === 'gemini' ? "text-blue-400" : "text-stone-400"
                  )}>
                    Powered by {msg.provider || lastProvider}
                  </span>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4 animate-in fade-in duration-300">
              <div className="h-8 w-8 rounded-xl bg-white border border-rose-50 flex items-center justify-center shadow-sm">
                <Loader2 size={14} className="text-rose-300 animate-spin" />
              </div>
              <div className="bg-white p-4 rounded-3xl rounded-tl-none border border-stone-100 shadow-sm">
                <div className="flex gap-1.5 py-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-rose-200 animate-bounce" />
                  <div className="h-1.5 w-1.5 rounded-full bg-rose-200 animate-bounce delay-150" />
                  <div className="h-1.5 w-1.5 rounded-full bg-rose-200 animate-bounce delay-300" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-rose-50">
          <div className="flex gap-2 items-end">
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
              className="flex-1 min-h-[44px] max-h-48 p-3 bg-stone-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-rose-500/10 resize-none transition-all placeholder:text-stone-300"
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
                "h-11 w-11 rounded-2xl shadow-lg shrink-0 p-0 transition-all duration-300",
                !message.trim() || isLoading 
                  ? "bg-stone-100 text-stone-300 shadow-none" 
                  : "bg-rose-500 hover:bg-rose-600 shadow-rose-200"
              )}
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </Button>
          </div>
          <div className="mt-2 flex justify-between items-center px-1">
            <p className="text-[10px] text-stone-400">
              Shift + Enter で改行
            </p>
            {lastProvider && (
              <p className="text-[9px] text-stone-300 flex items-center gap-1">
                <Sparkles size={8} /> Active: {lastProvider}
              </p>
            )}
          </div>
        </div>
      </MagazineCard>
    </section>
  );
}
