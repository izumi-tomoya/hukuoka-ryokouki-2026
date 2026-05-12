"use client";

import { Loader2, MessageCircleHeart, Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { MagazineCard } from "@/components/ui/MagazineCard";
import { cn } from "@/lib/utils";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type Props = {
  slug: string;
};

const starterPrompts = [
  "今日の動きで気をつけることは？",
  "雨ならどこを入れ替えるべき？",
  "このあと疲れにくい回り方を教えて",
];

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
    <MagazineCard className="border-primary/20">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-primary">
        <MessageCircleHeart size={13} />
        Travel Concierge
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="font-playfair text-3xl font-black text-foreground">旅のコンシェルジュ</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            旅程と予約情報を見ながら、次の一手を短く返します。
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-secondary/40 px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">
          <Sparkles size={12} className="text-primary" />
          {provider === "none" ? "Standby" : "Private Guide"}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {starterPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => {
              void ask(prompt);
            }}
            disabled={isPending}
            className="rounded-full border border-border bg-secondary/20 px-4 py-2 text-xs font-black text-foreground transition-colors hover:border-primary/40 disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="mt-6 max-h-96 space-y-4 overflow-y-auto no-scrollbar rounded-[1.75rem] border border-border bg-secondary/10 p-4 dark:bg-card/30">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={cn(
              "rounded-[1.25rem] px-5 py-4 text-sm leading-relaxed transition-all",
              message.role === "assistant"
                ? "mr-8 bg-card text-card-foreground shadow-sm border border-border/40 dark:bg-card/80 dark:border-border/50"
                : "ml-8 bg-primary text-primary-foreground shadow-md font-medium",
            )}
          >
            {message.content.split("\n").map((line, i) => (
              <p key={i} className={cn(i !== 0 && "mt-2")}>
                {line}
              </p>
            ))}
          </div>
        ))}
        {isPending && (
          <div className="mr-8 flex items-center gap-2 rounded-[1.25rem] bg-card/80 px-5 py-4 text-sm text-muted-foreground shadow-sm border border-border/40 backdrop-blur-sm">
            <Loader2 size={16} className="animate-spin text-primary" />
            知里様と智也様に最適な案を考えています...
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="mt-6 flex gap-3">
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          rows={2}
          placeholder="今の予定で、何を優先すべき？"
          className="min-h-14 flex-1 resize-none rounded-3xl border border-border bg-card px-4 py-4 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 dark:bg-background/50"
        />
        <button
          type="submit"
          disabled={isPending || !input.trim()}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.25rem] bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:shadow-none"
          aria-label="送信"
        >
          <Send size={18} />
        </button>
      </form>
    </MagazineCard>
  );
}
