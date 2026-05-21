import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { Sandbox } from "@vercel/sandbox";
import { createGateway, generateText, type ModelMessage, stepCountIs, tool } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { compactAdvisorAnswer } from "@/lib/advisorResponse";
import { auth } from "@/lib/auth";
import { getGoogleApiKey, getGoogleTravelAiModelsConfig } from "@/lib/googleAi";
import { prisma } from "@/lib/prisma";

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
    const modelId = process.env.AI_GATEWAY_MODEL || "anthropic/claude-3-haiku";
    return { model: gw(modelId) };
  }

  // 直接 Google AI に接続 (v1beta: systemInstruction/tools/toolConfig サポート)
  const goog = createGoogleGenerativeAI({ apiKey: googleApiKey ?? "" });
  const preferred = getGoogleTravelAiModelsConfig().models;
  const modelId = preferred[0] || "gemini-2.5-flash";
  return { model: goog(modelId) };
}

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
        const events = day.events
          .slice(0, ADVISOR_MAX_EVENTS_PER_DAY)
          .map((event) => {
            const titleText = event.title || event.foodName || "";
            const isSecret =
              !isAdmin &&
              (event.tag === "surprise" || ["ヒルトン", "CLOUDS", "サプライズ"].some((s) => titleText.includes(s)));
            return `${event.time} ${isSecret ? "🎁 Surprise" : titleText}${event.isConfirmed ? " [fixed]" : ""}`;
          })
          .join(" / ");
        return `Day ${day.dayNumber}: ${events}`;
      })
      .join("\n");

    const systemPrompt = `あなたは「${trip.title}」の専属コンシェルジュです。
知里様と智也様の旅が上質で淀みなく進むようサポートしてください。

【ツール活用】
複雑な計算や分析が必要な場合は 'runPythonCode' ツールを使ってください。
結果は正確に、かつ自然な日本語で回答に組み込んでください。

【人格とトーン】
- 控えめながら的確な「大人のコンシェルジュ」。
- 丁寧語を用いつつ、事務的すぎない。


【制約】
- 日本語で回答。
- 1回答は最大3文、350字以内。
- 1文目に結論、2文目以降に理由や助言。
- 箇条書きやMarkdown見出しは使わず、自然な文章で。

【コンテキスト】
場所: ${trip.location}
旅程:
${itineraryContext}`;

    // 履歴の正規化
    const messages: ModelMessage[] = [
      ...history.slice(-ADVISOR_MAX_HISTORY_MESSAGES).map((m) => ({
        role: m.role,
        content: m.content,
      })),
      { role: "user" as const, content: message },
    ];

    const { model } = resolveProvider();

    const { text } = await generateText({
      model,
      system: systemPrompt,
      messages,
      tools: {
        runPythonCode: tool({
          description:
            "Pythonコードを実行して計算やデータ処理を行います。予算の計算や時間の計算、スケジュールの分析に使用してください。",
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
