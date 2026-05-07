import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildFallbackAlternatives } from "@/features/trip/utils/tripInsights";
import { generateTravelTextWithFallback } from "@/lib/aiProvider";

export const dynamic = "force-dynamic";

type Trigger = "rain" | "crowd" | "tired" | "budget";

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
    const { slug, trigger, delayMinutes = 0 } = (await request.json()) as {
      slug?: string;
      trigger?: Trigger;
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
      }))
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

    const itinerary = events
      .slice(0, 10)
      .map((event) => `${event.time} ${event.title}${event.isConfirmed ? " [fixed]" : ""}`)
      .join("\n");
    const knowledge = tips
      .slice(0, 8)
      .map((tip) => `${tip.title}: ${tip.body}`)
      .join("\n");

    const prompt = `次の旅行プランに対して、トリガー「${trigger}」発生時の代替案を2〜3件提案してください。
JSON配列だけを返してください。各要素は {"title": string, "reason": string, "action": string } の形です。
簡潔で実務的に、固定予約を優先しつつ二人旅に合う代替案にしてください。
マークダウンのコードブロック（\`\`\`jsonなど）は含めず、純粋なJSON文字列のみを出力してください。

場所: ${trip.location}
遅延: ${delayMinutes}分

旅程:
${itinerary}

補足:
${knowledge}`;

    let content = "";
    let usedProvider = "";
    let providerSource = "";

    const systemInstruction =
      "You are a travel operations concierge. Return only a valid JSON array with 2-3 objects shaped as {\"title\": string, \"reason\": string, \"action\": string}. Do not include markdown code blocks or extra text.";

    try {
      const result = await generateTravelTextWithFallback({
        prompt,
        systemInstruction,
        maxOutputTokens: 600,
        temperature: 0.2,
        topP: 0.8,
      });
      content = result.text;
      usedProvider = `${result.provider}:${result.model}`;
      providerSource = result.source;
    } catch (error) {
      console.warn("AI alternatives fallback exhausted:", error);
    }

    const parsed = content ? safeJsonParse<Array<{ title: string; reason: string; action: string }>>(content) : null;
    const suggestions = parsed && parsed.length > 0 ? parsed.slice(0, 3) : buildFallbackAlternatives(trigger, events, tips, delayMinutes);

    return NextResponse.json({ suggestions, provider: usedProvider, providerSource });
  } catch (error) {
    console.error("AI alternatives fatal error:", error);
    return NextResponse.json({ error: "代替案の生成に失敗しました" }, { status: 500 });
  }
}
