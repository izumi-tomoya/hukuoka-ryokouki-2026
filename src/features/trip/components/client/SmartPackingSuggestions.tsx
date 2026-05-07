"use client";

import { useMemo, useState, useTransition } from "react";
import { Loader2, Plus, Sparkles, Umbrella, BatteryCharging, Shirt, Package2 } from "lucide-react";
import { MagazineCard } from "@/components/ui/MagazineCard";
import { cn } from "@/lib/utils";
import { addPackingItemAction } from "@/features/trip/api/tripActions";
import { buildPackingRecommendations, type InsightEvent } from "@/features/trip/utils/tripInsights";

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
  const [suggestions, setSuggestions] = useState(() =>
    buildPackingRecommendations(events, weatherData, itemNames)
  );
  const [isPending, startTransition] = useTransition();
  const [addingName, setAddingName] = useState<string | null>(null);

  const headline = useMemo(() => {
    if (weatherData?.themeStatus === "rainy") return "雨前提で持ち物を補強";
    if ((weatherData?.current?.temp ?? 0) >= 25) return "暑さに寄せて軽く補強";
    return "旅程に合わせて持ち物を補強";
  }, [weatherData]);

  const addSuggestion = (name: string, category: string) => {
    setAddingName(name);
    startTransition(async () => {
      await addPackingItemAction(tripId, name, category);
      setSuggestions((current) => current.filter((item) => item.name !== name));
      setAddingName(null);
    });
  };

  if (suggestions.length === 0) return null;

  return (
    <MagazineCard padding="lg" className="border-primary/20 bg-linear-to-br from-primary/8 to-transparent">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-primary">
            <Sparkles size={13} />
            Packing Assist
          </div>
          <h3 className="font-playfair text-3xl font-black text-foreground">持ち物レコメンド</h3>
          <p className="mt-2 text-sm font-medium leading-relaxed text-muted-foreground">
            {headline}。今の天気と移動量から、追加しておくと効くものだけを出しています。
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {suggestions.map((suggestion) => {
          const Icon = categoryIcons[suggestion.category];
          const isAdding = isPending && addingName === suggestion.name;

          return (
            <div key={suggestion.name} className="rounded-[1.75rem] border border-border bg-background/70 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-black text-foreground">{suggestion.name}</div>
                    <div className="mt-1 text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">
                      {suggestion.urgency}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => addSuggestion(suggestion.name, suggestion.category)}
                  disabled={isPending}
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-foreground text-background transition-transform active:scale-[0.98]",
                    isPending && "opacity-60"
                  )}
                  aria-label={`${suggestion.name}を追加`}
                >
                  {isAdding ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                </button>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{suggestion.reason}</p>
            </div>
          );
        })}
      </div>
    </MagazineCard>
  );
}
