"use client";

import { MessageCircleHeart, Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ADVISOR_STARTER_PROMPTS } from "@/config/constants";
import { cn } from "@/lib/utils";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type Props = {
  slug: string;
};

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-1 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="bg-primary/50 h-2 w-2 rounded-full"
          style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
        />
      ))}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default function AdvisorConciergePanel({ slug }: Props) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "旅程を見ながら、次の一手を短く整えます。移動、食事、雨、疲れ、予算のどれでも聞いてください。",
    },
  ]);
  const [provider, setProvider] = useState<string>("local-ai");
  const [isPending, setIsPending] = useState(false);
  const chatAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = chatAreaRef.current;
    if (!el || messages.length === 0) return;
    el.scrollTo({ top: el.scrollHeight, behavior: isPending ? "auto" : "smooth" });
  }, [messages.length, isPending]);

  const ask = async (raw: string) => {
    const message = raw.trim();
    if (!message || isPending) return;

    const nextMessages = [...messages, { role: "user" as const, content: message }];
    setMessages(nextMessages);
    setInput("");
    setIsPending(true);

    try {
      const response = await fetch("/api/ai/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          message,
          history: messages.slice(1),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "advisor request failed");
      }

      setProvider(data.provider || "local-ai");
      setMessages(data.history || [...nextMessages, { role: "assistant", content: data.answer || "応答が空でした。" }]);
    } catch (error) {
      console.error("Advisor request failed", error);
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: "いまは応答を返せませんでした。少し時間をおいて、もう一度試してください。",
        },
      ]);
      setProvider("none");
    } finally {
      setIsPending(false);
    }
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await ask(input);
  };

  return (
    <div className="bg-card border-border md:rounded-article overflow-hidden rounded-3xl border shadow-sm">
      {/* Header */}
      <div className="border-primary/10 bg-primary/5 border-b px-6 pt-7 pb-6">
        <div>
          <div className="border-primary/25 bg-primary/12 text-primary mb-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[10px] font-black tracking-[0.18em] uppercase backdrop-blur-sm">
            <MessageCircleHeart size={12} />
            Travel Concierge
          </div>
          <div className="flex items-end justify-between gap-3">
            <div>
              <h3 className="font-playfair text-foreground text-3xl font-black leading-tight">旅のコンシェルジュ</h3>
              <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                旅程と予約情報を見ながら、次の一手を短く返します。
              </p>
            </div>
            <div
              className={cn(
                "shrink-0 inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[10px] font-black tracking-[0.14em] uppercase transition-colors",
                provider === "none"
                  ? "bg-muted/60 text-muted-foreground"
                  : "bg-primary/10 text-primary border-primary/20 border",
              )}
            >
              <Sparkles size={11} className={provider === "none" ? "opacity-40" : "text-primary"} />
              {provider === "none" ? "Standby" : "Online"}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        {/* Starter prompts */}
        <div className="mt-5 flex flex-wrap gap-2">
          {ADVISOR_STARTER_PROMPTS.map((prompt) => (
            <button
              type="button"
              key={prompt}
              onClick={() => {
                void ask(prompt);
              }}
              disabled={isPending}
              className="border-border/70 bg-secondary/20 text-foreground hover:border-primary/40 hover:bg-primary/8 group relative overflow-hidden rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-200 disabled:opacity-40"
            >
              <span className="relative z-10">{prompt}</span>
            </button>
          ))}
        </div>

        {/* Chat area */}
        <div
          ref={chatAreaRef}
          className="no-scrollbar bg-secondary/8 border-border/50 mt-5 max-h-96 space-y-3 overflow-y-auto rounded-3xl border p-4"
        >
          {messages.map((message, index) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: chat messages are appended sequentially
              key={`${message.role}-${index}`}
              className={cn("flex gap-2.5", message.role === "user" ? "flex-row-reverse" : "flex-row")}
            >
              {/* Avatar dot */}
              <div
                className={cn(
                  "mt-1 h-7 w-7 shrink-0 rounded-full flex items-center justify-center text-[10px] font-black",
                  message.role === "assistant"
                    ? "bg-primary/15 text-primary border-primary/20 border"
                    : "bg-primary text-primary-foreground shadow-sm",
                )}
              >
                {message.role === "assistant" ? <Sparkles size={13} /> : "旅"}
              </div>

              <div
                className={cn(
                  "max-w-[82%] rounded-[1.1rem] px-4 py-3 text-sm leading-relaxed",
                  message.role === "assistant"
                    ? "bg-card text-card-foreground border-border/40 border shadow-sm"
                    : "bg-primary text-primary-foreground shadow-sm",
                )}
              >
                {message.content.split("\n").map((line, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: splitting content by newline is stable
                  <p key={i} className={cn(i !== 0 && "mt-2")}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}

          {isPending && (
            <div className="flex flex-row gap-2.5">
              <div className="bg-primary/15 text-primary border-primary/20 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border">
                <Sparkles size={13} />
              </div>
              <div className="bg-card border-border/40 rounded-[1.1rem] border px-4 py-3 shadow-sm">
                <TypingDots />
              </div>
            </div>
          )}
        </div>

        {/* Input form */}
        <form onSubmit={onSubmit} className="mt-4 flex gap-2.5">
          <div className="relative flex-1">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                  event.preventDefault();
                  void ask(input);
                }
              }}
              rows={2}
              placeholder="今の予定で、何を優先すべき？"
              aria-label="コンシェルジュへの質問"
              className="border-border bg-card focus:border-primary/60 focus:ring-primary/15 dark:bg-background/50 w-full resize-none rounded-2xl border px-4 py-3.5 pb-6 text-sm transition-all outline-none focus:ring-2"
            />
            <p className="text-muted-foreground/50 absolute right-3 bottom-2 text-[9px] font-medium">⌘ Enter</p>
          </div>
          <button
            type="submit"
            disabled={isPending || !input.trim()}
            aria-label="送信"
            className="bg-primary text-primary-foreground shadow-primary/20 flex h-[72px] w-12 shrink-0 items-center justify-center rounded-2xl shadow-md transition-all hover:brightness-110 active:scale-95 disabled:opacity-35 disabled:shadow-none"
          >
            <Send size={17} />
          </button>
        </form>
      </div>
    </div>
  );
}
