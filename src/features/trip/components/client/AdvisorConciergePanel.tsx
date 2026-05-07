"use client";

import { startTransition, useState } from "react";
import { Loader2, MessageCircleHeart, Send, Sparkles } from "lucide-react";
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
        AI Concierge
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="font-playfair text-3xl font-black text-foreground">AI コンシェルジュ</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            旅程と予約情報を見ながら、次の一手を短く返します。
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-secondary/40 px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">
          <Sparkles size={12} className="text-primary" />
          {provider.includes("gemma") || provider === "local-ai" ? "Local AI" : provider}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {starterPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => {
              startTransition(() => {
                void ask(prompt);
              });
            }}
            disabled={isPending}
            className="rounded-full border border-border bg-secondary/20 px-4 py-2 text-xs font-black text-foreground transition-colors hover:border-primary/40 disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="mt-6 max-h-96 space-y-3 overflow-y-auto rounded-[1.75rem] border border-border bg-secondary/10 p-4">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={cn(
              "rounded-[1.25rem] px-4 py-3 text-sm leading-relaxed",
              message.role === "assistant"
                ? "mr-6 bg-white text-foreground shadow-sm"
                : "ml-6 bg-foreground text-background"
            )}
          >
            {message.content}
          </div>
        ))}
        {isPending && (
          <div className="mr-6 flex items-center gap-2 rounded-[1.25rem] bg-white px-4 py-3 text-sm text-muted-foreground shadow-sm">
            <Loader2 size={16} className="animate-spin" />
            考えています
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="mt-5 flex gap-3">
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          rows={2}
          placeholder="今の予定で、何を優先すべき？"
          className="min-h-14 flex-1 resize-none rounded-[1.5rem] border border-border bg-background px-4 py-4 text-sm outline-none focus:border-primary"
        />
        <button
          type="submit"
          disabled={isPending || !input.trim()}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.25rem] bg-foreground text-background transition-transform active:scale-[0.98] disabled:opacity-40"
          aria-label="送信"
        >
          <Send size={16} />
        </button>
      </form>
    </MagazineCard>
  );
}
