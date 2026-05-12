"use client";

import { BatteryCharging, Loader2, Package2, Plus, Shirt, Sparkles, Umbrella } from "lucide-react";
import { useMemo, useState } from "react";
import { MagazineCard } from "@/components/ui/MagazineCard";
import { addPackingItemAction } from "@/features/trip/api/tripActions";
import { buildPackingRecommendations, type InsightEvent } from "@/features/trip/utils/tripInsights";
import { cn } from "@/lib/utils";

type Props = {
  tripId: string;
  itemNames: string[];
  events: InsightEvent[];
  weatherData: {
    themeStatus?: string;
    current?: { temp?: number; text?: string };
    forecast?: Array<{ date: string; tempMax: number; tempMin: number; text?: string; condition?: string }>;
  } | null;
};

const categoryIcons = {
  Essential: Umbrella,
  Clothing: Shirt,
  Gadget: BatteryCharging,
  Other: Package2,
};

export default function SmartPackingSuggestions({ tripId, itemNames, events, weatherData }: Props) {
  const [suggestions, setSuggestions] = useState(() => buildPackingRecommendations(events, weatherData, itemNames));
  const [isPending, setIsPending] = useState(false);
  const [addingName, setAddingName] = useState<string | null>(null);

  const headline = useMemo(() => {
    if (weatherData?.themeStatus === "rainy") return "雨前提で持ち物を補強";
    if ((weatherData?.current?.temp ?? 0) >= 25) return "暑さに寄せて軽く補強";
    return "旅程に合わせて持ち物を補強";
  }, [weatherData]);

  const addSuggestion = async (name: string, category: string) => {
    if (isPending) return;
    setAddingName(name);
    setIsPending(true);
    try {
      await addPackingItemAction(tripId, name, category);
      setSuggestions((current) => current.filter((item) => item.name !== name));
      setAddingName(null);
    } catch (err) {
      console.error("Failed to add suggested item:", err);
    } finally {
      setIsPending(false);
    }
  };

  if (suggestions.length === 0) return null;

  return (
    <MagazineCard padding="lg" className="border-primary/20 from-primary/8 bg-linear-to-br to-transparent">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="border-primary/20 bg-primary/10 text-primary mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[10px] font-black tracking-[0.18em] uppercase">
            <Sparkles size={13} />
            Packing Assist
          </div>
          <h3 className="font-playfair text-foreground text-3xl font-black">持ち物レコメンド</h3>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed font-medium">
            {headline}。今の天気と移動量から、追加しておくと効くものだけを出しています。
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {suggestions.map((suggestion) => {
          const Icon = categoryIcons[suggestion.category];
          const isAdding = isPending && addingName === suggestion.name;

          return (
            <div key={suggestion.name} className="border-border bg-background/70 rounded-[1.75rem] border p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="bg-secondary text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl">
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="text-foreground text-sm font-black">{suggestion.name}</div>
                    <div className="text-muted-foreground mt-1 text-[10px] font-black tracking-[0.16em] uppercase">
                      {suggestion.urgency}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => addSuggestion(suggestion.name, suggestion.category)}
                  disabled={isPending}
                  className={cn(
                    "bg-foreground text-background flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-transform active:scale-[0.98]",
                    isPending && "opacity-60",
                  )}
                  aria-label={`${suggestion.name}を追加`}
                >
                  {isAdding ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                </button>
              </div>
              <p className="text-muted-foreground mt-4 text-sm leading-relaxed">{suggestion.reason}</p>
            </div>
          );
        })}
      </div>
    </MagazineCard>
  );
}
