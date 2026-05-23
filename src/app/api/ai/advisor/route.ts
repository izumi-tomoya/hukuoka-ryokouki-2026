import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { Sandbox } from "@vercel/sandbox";
import { createGateway, generateText, type ModelMessage, stepCountIs, tool } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";
import type { TripEvent } from "@/features/trip/types/trip";
import { compactAdvisorAnswer } from "@/lib/advisorResponse";
import { buildAdvisorAiConfig } from "@/lib/aiPrompts";
import { auth } from "@/lib/auth";
import { getGoogleApiKey, getGoogleTravelAiModelsConfig } from "@/lib/googleAi";
import { prisma } from "@/lib/prisma";
import { getWeatherData } from "@/lib/weather";

export const dynamic = "force-dynamic";

const ADVISOR_MAX_ANSWER_SENTENCES = 3;
const ADVISOR_MAX_ANSWER_CHARACTERS = 350;
const ADVISOR_MAX_HISTORY_MESSAGES = 10;
const ADVISOR_MAX_EVENTS_PER_DAY = 12;

// プロバイダーの設定 (リクエストごとに env を読む)
function resolveProvider() {
  const googleDirect = process.env.AI_PROVIDER === "google_direct";
  const gatewayApiKey = process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN;
  const googleApiKey = getGoogleApiKey();

  if (!googleDirect && gatewayApiKey) {
    const gw = createGateway({ apiKey: gatewayApiKey });
    const modelId = process.env.AI_GATEWAY_MODEL || "google/gemini-2.5-flash";
    return { model: gw(modelId) };
  }

  // 直接 Google AI に接続 (v1beta: systemInstruction/tools/toolConfig サポート)
  const goog = createGoogleGenerativeAI({ apiKey: googleApiKey ?? "" });
  const preferred = getGoogleTravelAiModelsConfig().models;
  const modelId = preferred[0] || "gemini-2.5-flash";
  return { model: goog(modelId) };
}

type AdvisorAiConfig = ReturnType<typeof buildAdvisorAiConfig>;

export async function POST(req: Request) {
  try {
    const session = await auth();
    const isAdmin = !!session?.user?.isAdmin;

    const {
      slug,
      message,
      history = [],
    } = (await req.json()) as {
      slug?: string;
      message?: string;
      history?: { role: "user" | "assistant"; content: string }[];
    };

    if (!slug || !message) {
      return NextResponse.json({ error: "Slug and message are required" }, { status: 400 });
    }

    const trip = await prisma.trip.findUnique({
      where: { slug },
      include: {
        days: {
          orderBy: { dayNumber: "asc" },
          include: { events: { orderBy: { order: "asc" } } },
        },
        tips: { orderBy: { order: "asc" } },
      },
    });

    if (!trip) return NextResponse.json({ error: "Trip not found" }, { status: 404 });

    const itineraryContext = trip.days
      .map((day) => {
        const dateStr = day.date.toLocaleDateString("ja-JP", { month: "short", day: "numeric", weekday: "short" });
        const events = day.events
          .slice(0, ADVISOR_MAX_EVENTS_PER_DAY)
          .map((event) => {
            const titleText = event.title || event.foodName || "";
            const isSecret =
              !isAdmin &&
              (event.tag === "surprise" || ["ヒルトン", "CLOUDS", "サプライズ"].some((s) => titleText.includes(s)));
            const status = event.isConfirmed ? " [予約確定]" : "";
            const tag = event.tag ? ` #${event.tag}` : "";
            return `${event.time} ${isSecret ? "🎁 サプライズ予定" : titleText}${status}${tag}`;
          })
          .join(" / ");
        return `Day ${day.dayNumber} (${dateStr}): ${events}`;
      })
      .join("\n");

    const tipsContext = trip.tips
      .slice(0, 10)
      .map((tip) => {
        const warning = tip.isWarning ? "【注意】" : "";
        const venue = tip.venue ? `（場所: ${tip.venue}）` : "";
        return `- ${tip.title}: ${tip.body}${venue}${warning}`;
      })
      .join("\n");

    // 現在状況の構築
    const now = new Date();
    const currentTime = now.toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      weekday: "short",
    });

    const weather = await getWeatherData(trip.location);
    const weatherContext = weather
      ? `現在: ${weather.current.text} (${weather.current.temp}℃) / 今日の予報: ${weather.forecast[0]?.text || "不明"} (最高${weather.forecast[0]?.tempMax}℃ / 降水${weather.forecast[0]?.rainChance}%)`
      : "取得失敗";

    const allEvents = trip.days.flatMap((d) => d.events) as unknown as TripEvent[];
    const totalPlanned = allEvents.reduce((sum, e) => sum + (e.plannedBudget || 0), 0);
    const totalActual = allEvents.reduce(
      (sum, e) => sum + (e.actualExpense || (e.myExpense || 0) + (e.herExpense || 0) || 0),
      0,
    );
    const budgetContext = `予定合計: ¥${totalPlanned.toLocaleString()} / 支出確定分: ¥${totalActual.toLocaleString()} / 残り予算(見込): ¥${(totalPlanned - totalActual).toLocaleString()}`;

    const advisor = buildAdvisorAiConfig({
      tripTitle: trip.title,
      location: trip.location,
      itineraryContext,
      tipsContext,
      currentTime,
      weatherContext,
      budgetContext,
    });

    // 履歴の正規化
    const messages: ModelMessage[] = [
      ...history.slice(-ADVISOR_MAX_HISTORY_MESSAGES).map((m) => ({
        role: m.role,
        content: m.content,
      })),
      { role: "user" as const, content: message },
    ];

    const { model } = resolveProvider();

    const { text } = await generateAdvisorReply(model, advisor, messages);

    const finalAnswer = compactAdvisorAnswer(text, {
      maxSentences: ADVISOR_MAX_ANSWER_SENTENCES,
      maxCharacters: ADVISOR_MAX_ANSWER_CHARACTERS,
    });

    return NextResponse.json({
      answer: finalAnswer,
      history: [...history, { role: "user", content: message }, { role: "assistant", content: finalAnswer }],
    });
  } catch (error) {
    console.error("AI Advisor Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "AIとの通信中にエラーが発生しました",
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}

/**
 * AIアドバイザーの返信を生成する
 */
export async function generateAdvisorReply(
  model: ReturnType<typeof resolveProvider>["model"],
  advisor: AdvisorAiConfig,
  messages: ModelMessage[],
) {
  return generateText({
    model,
    system: advisor.systemPrompt,
    messages,
    temperature: 0.4,
    topP: 0.8,
    tools: {
      runPythonCode: tool({
        description: advisor.pythonToolDescription,
        inputSchema: z.object({
          code: z.string().describe("実行するPythonコード"),
        }),
        execute: async ({ code }) => {
          try {
            const sandbox = await Sandbox.create();
            try {
              const result = await sandbox.runCommand("python3", ["-c", code]);
              const output = await result.stdout();
              return { output };
            } finally {
              await sandbox.stop();
            }
          } catch (sandboxError) {
            console.error("Sandbox Execution Failed:", sandboxError);
            return {
              error:
                "Sandbox environment is currently unavailable. Please perform calculation manually or try again later.",
            };
          }
        },
      }),
    },
    stopWhen: stepCountIs(5),
  });
}
