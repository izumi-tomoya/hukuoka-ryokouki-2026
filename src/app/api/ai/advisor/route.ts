import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ApiError extends Error {
  status?: number;
  data?: unknown;
}

const LOCAL_AI_MODELS = ["gemma-4-26b-a4b-it", "gemma-4-31b-it"] as const;

async function callLocalAi(model: string, message: string, systemPrompt: string, history: ChatMessage[]) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY が設定されていません。");

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        ...history.map((item) => ({
          role: item.role === "assistant" ? "model" : "user",
          parts: [{ text: item.content }],
        })),
        {
          role: "user",
          parts: [{ text: message }],
        },
      ],
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 700,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(`Local AI ${model} failed: ${response.status}`) as ApiError;
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || "").join("\n").trim() || "";
}

export async function POST(req: Request) {
  try {
    const { slug, message, history = [] } = (await req.json()) as {
      slug?: string;
      message?: string;
      history?: ChatMessage[];
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
        const events = day.events
          .map((event) => `${event.time} ${event.title || event.foodName || "Untitled"}${event.isConfirmed ? " [fixed]" : ""}`)
          .join(" / ");
        return `Day ${day.dayNumber}: ${events}`;
      })
      .join("\n");

    const tipsContext = trip.tips
      .map((tip) => `${tip.title}${tip.category ? ` [${tip.category}]` : ""}: ${tip.body}`)
      .join("\n");

    const systemPrompt = `あなたは「${trip.title}」の専属AIコンシェルジュです。
二人旅の実務と雰囲気の両方を整える、静かで上質な回答を返してください。

【旅程】
${itineraryContext}

【予約・知識】
${tipsContext}

【回答ルール】
- 日本語で答える
- 2〜5文を基本に、長くなりすぎない
- 予定に関わる助言は、可能なら具体的な時刻や場所を含める
- 不明なことは断定しない
- 危険や遅延リスクがある場合は先に短く警告する`;

    const trimmedHistory = history.slice(-8);

    let answer = "";
    let usedProvider = "";

    for (const model of LOCAL_AI_MODELS) {
      try {
        answer = await callLocalAi(model, message, systemPrompt, trimmedHistory);
        usedProvider = model;
        break;
      } catch (error) {
        const err = error as ApiError;
        console.warn("Local AI fallback:", model, err.status || err.message || "unknown error");
      }
    }

    if (!answer) {
      answer = "申し訳ありません。いまはコンシェルジュが応答できません。少し時間をおいて、もう一度お試しください。";
      usedProvider = "none";
    }

    return NextResponse.json({
      answer,
      provider: usedProvider,
      history: [
        ...history,
        { role: "user", content: message },
        { role: "assistant", content: answer },
      ],
    });
  } catch (error) {
    const err = error as Error;
    console.error("AI Advisor Fatal Error:", err.message || "unknown fatal error");
    return NextResponse.json({ error: "AIとの通信中に予期せぬエラーが発生しました" }, { status: 500 });
  }
}
