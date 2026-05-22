import { NextResponse } from "next/server";
import { buildFallbackAlternatives } from "@/features/trip/utils/tripInsights";
import {
  type AlternativesTrigger,
  buildAlternativesSystemInstruction,
  buildAlternativesUserPrompt,
} from "@/lib/aiPrompts";
import { generateTravelTextWithFallback } from "@/lib/aiProvider";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function safeJsonParse<T>(input: string): T | null {
  const normalized = input
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(normalized) as T;
  } catch {
    const match = normalized.match(/(\[[\s\S]*\])/);
    if (!match) return null;
    try {
      return JSON.parse(match[1]) as T;
    } catch {
      return null;
    }
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const isAdmin = !!session?.user?.isAdmin;

    const {
      slug,
      trigger,
      delayMinutes = 0,
    } = (await request.json()) as {
      slug?: string;
      trigger?: AlternativesTrigger;
      delayMinutes?: number;
    };

    if (!slug || !trigger) {
      return NextResponse.json({ error: "slug and trigger are required" }, { status: 400 });
    }

    const trip = await prisma.trip.findUnique({
      where: { slug },
      include: {
        days: {
          orderBy: { dayNumber: "asc" },
          include: {
            events: { orderBy: { order: "asc" } },
          },
        },
        tips: { orderBy: { order: "asc" } },
      },
    });

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    const events = trip.days.flatMap((day) =>
      day.events.map((event) => ({
        id: event.id,
        dayNumber: day.dayNumber,
        date: day.date.toISOString(),
        time: event.time,
        type: event.type,
        title: event.title || event.foodName || "Untitled",
        desc: event.desc || event.foodDesc || undefined,
        locationUrl: event.locationUrl || undefined,
        isConfirmed: event.isConfirmed,
        plannedBudget: event.plannedBudget || 0,
        actualExpense: event.actualExpense || 0,
      })),
    );

    const tips = trip.tips.map((tip) => ({
      id: tip.id,
      title: tip.title,
      body: tip.body,
      venue: tip.venue || undefined,
      imageUrl: tip.imageUrl || undefined,
      isWarning: tip.isWarning,
      isConfirmed: tip.isConfirmed,
      category: tip.category || undefined,
    }));

    const isSecretContent = (val: string | undefined | null) => {
      if (!val) return false;
      const lower = val.toLowerCase();
      return (
        ["ヒルトン", "ヒルトン福岡シーホーク", "CLOUDS", "天空のサプライズ", "secret spot", "サプライズ"].some((spot) =>
          lower.includes(spot.toLowerCase()),
        ) || false
      );
    };

    const itinerary = events
      .slice(0, 10)
      .map((event) => {
        const isSecret =
          !isAdmin &&
          ((event as { tag?: string }).tag === "surprise" ||
            isSecretContent(event.title) ||
            isSecretContent(event.desc));
        const displayName = isSecret ? "🎁 Surprise Spot" : event.title;
        return `${event.time} ${displayName}${event.isConfirmed ? " [fixed]" : ""}`;
      })
      .join("\n");
    const knowledge = tips
      .slice(0, 8)
      .map((tip) => `${tip.title}: ${tip.body}`)
      .join("\n");

    const prompt = buildAlternativesUserPrompt({
      trigger,
      location: trip.location,
      delayMinutes,
      itinerary,
      knowledge,
    });

    let content = "";
    let usedProvider = "";
    let providerSource = "";

    try {
      const result = await generateTravelTextWithFallback({
        prompt,
        systemInstruction: buildAlternativesSystemInstruction(),
        maxOutputTokens: 720,
        temperature: 0.25,
        topP: 0.85,
      });
      content = result.text;
      usedProvider = `${result.provider}:${result.model}`;
      providerSource = result.source;
    } catch (error) {
      console.warn("AI alternatives fallback exhausted:", error);
    }

    const parsed = content ? safeJsonParse<Array<{ title: string; reason: string; action: string }>>(content) : null;
    const suggestions =
      parsed && parsed.length > 0 ? parsed.slice(0, 3) : buildFallbackAlternatives(trigger, events, tips, delayMinutes);

    return NextResponse.json({ suggestions, provider: usedProvider, providerSource });
  } catch (error) {
    console.error("AI alternatives fatal error:", error);
    return NextResponse.json({ error: "代替案の生成に失敗しました" }, { status: 500 });
  }
}
