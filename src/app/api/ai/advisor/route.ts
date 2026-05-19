import { google } from "@ai-sdk/google";
import { Sandbox } from "@vercel/sandbox";
import { generateText, tool } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { cleanLocationName, getLocationCoordinates } from "@/features/trip/utils/locationCatalog";
import { compactAdvisorAnswer } from "@/lib/advisorResponse";
import { auth } from "@/lib/auth";
import { searchGourmet } from "@/lib/external/hotpepper";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const ADVISOR_MAX_ANSWER_SENTENCES = 3;
const ADVISOR_MAX_ANSWER_CHARACTERS = 350; // Sandboxを使うため少し余裕を持たせる
const ADVISOR_MAX_HISTORY_MESSAGES = 6;
const ADVISOR_MAX_EVENTS_PER_DAY = 10;
const ADVISOR_MAX_TIPS = 10;
const ADVISOR_MAX_TIP_BODY_CHARACTERS = 100;

interface ChatMessage {
  role: "user" | "assistant" | "tool";
  content: string;
}

function truncateContextText(value: string | null | undefined, maxCharacters: number) {
  if (!value) return "";
  const normalized = value.replace(/\s+/g, " ").trim();
  if (Array.from(normalized).length <= maxCharacters) return normalized;
  return `${Array.from(normalized).slice(0, maxCharacters - 1).join("").trim()}…`;
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
      history?: any[];
    };

    if (!slug || !message) {
      return NextResponse.json({ error: "Slug and message are required" }, { status: 400 });
    }

    const trip = await prisma.trip.findUnique({
      where: { slug },
      include: {
        days: {
          orderBy: { dayNumber: "asc" },
          include: {
            events: {
              orderBy: { order: "asc" },
            },
          },
        },
        tips: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!trip) return NextResponse.json({ error: "Trip not found" }, { status: 404 });

    // コンテキストの構築
    const itineraryContext = trip.days
      .map((day) => {
        const events = day.events
          .slice(0, ADVISOR_MAX_EVENTS_PER_DAY)
          .map((event) => {
            const titleText = event.title || event.foodName || "";
            const isSecret = !isAdmin && (event.tag === "surprise" || ["ヒルトン", "CLOUDS", "サプライズ"].some(s => titleText.includes(s)));
            return `${event.time} ${isSecret ? "🎁 Surprise" : titleText}${event.isConfirmed ? " [fixed]" : ""}`;
          })
          .join(" / ");
        return `Day ${day.dayNumber}: ${events}`;
      })
      .join("\n");

    const systemPrompt = `あなたは「${trip.title}」の専属コンシェルジュです。
知里様と智也様の旅が上質で淀みなく進むようサポートしてください。

【Sandboxの活用】
計算が必要な場合（予算合計、移動時間の合算、スケジュールの重複チェックなど）は、積極的に 'runPythonCode' ツールを使って正確な結果を算出してください。
推測で計算せず、コードを実行して確認してください。

【人格とトーン】
- 控えめながら的確な「大人のコンシェルジュ」。
- 丁寧語を用いつつ、事務的すぎない。

【制約】
- 日本語で回答。
- 1回答は最大3文、350字以内。
- 1文目に結論、2文目以降に理由やSandboxの実行結果に基づいた助言。

【コンテキスト】
場所: ${trip.location}
旅程:
${itineraryContext}`;

    const { text, toolResults } = await generateText({
      model: google("gemini-1.5-flash"),
      system: systemPrompt,
      messages: [
        ...history.map(m => ({
          role: m.role as "user" | "assistant",
          content: m.content
        })),
        { role: "user", content: message }
      ],
      tools: {
        runPythonCode: tool({
          description: "Pythonコードを実行して計算やデータ処理を行います。予算の計算や時間の計算に使用してください。",
          parameters: z.object({
            code: z.string().description("実行するPythonコード"),
          }),
          execute: async ({ code }) => {
            const sandbox = await Sandbox.create();
            try {
              const result = await sandbox.runCommand("python3", ["-c", code]);
              const output = await result.stdout();
              return { output };
            } finally {
              await sandbox.stop();
            }
          },
        }),
      },
      maxSteps: 5, // ツール実行を含めて最大5回やり取り
    });

    const finalAnswer = compactAdvisorAnswer(text, {
      maxSentences: ADVISOR_MAX_ANSWER_SENTENCES,
      maxCharacters: ADVISOR_MAX_ANSWER_CHARACTERS,
    });

    return NextResponse.json({
      answer: finalAnswer,
      history: [
        ...history,
        { role: "user", content: message },
        { role: "assistant", content: finalAnswer }
      ],
    });
  } catch (error) {
    console.error("AI Advisor Error:", error);
    return NextResponse.json({ error: "エラーが発生しました" }, { status: 500 });
  }
}
