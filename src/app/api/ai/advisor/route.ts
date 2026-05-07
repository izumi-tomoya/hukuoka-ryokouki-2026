import { NextResponse } from "next/server";
import { generateTravelTextWithFallback } from "@/lib/aiProvider";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
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

    const systemPrompt = `あなたは「${trip.title}」の専属コンシェルジュです。
知里様と智也様の旅が、静かで上質、かつ淀みなく進むようサポートしてください。

【人格とトーン】
- 二人旅の空気感を壊さない、控えめながらも的確な「大人のコンシェルジュ」。
- 丁寧語を用いつつ、事務的すぎない、情景が浮かぶような情緒ある表現を好みます。

【回答の指針】
1. **予約と実務の優先**: [fixed] マークの付いた予定は確定した大切な時間として扱い、それを軸に周辺の調整案を提示してください。
2. **状況への洞察**:
   - 雨天時：屋外（大濠公園、中洲屋台、太宰府参道など）を避け、屋内（美術館、ラウンジ、ホテル内）での滞在を具体的に提案。
   - 疲労・遅延時：予定を削る勇気を持ち、カフェでの休憩やホテルの滞在時間を延ばすことを優しく勧める。
3. **具体的な助言**: 可能な限り「時刻（xx時頃）」や「具体的な場所」を回答に含め、すぐに行動に移せるようにしてください。
4. **知識の活用**: 【予約・知識】にある内容（機密情報や警告）を把握し、先回りした助言を行ってください。

【制約】
- 日本語で回答する。
- 2〜5文程度に収める（短すぎず、長すぎず）。
- **読みやすさを考慮し、適宜改行（空行）を挟んで読みやすくすること。**
- 不明なことは断定せず、選択肢を提示して寄り添う。
- 危険や遅延リスクがある場合は、冒頭で短く警告する。

【現在のコンテキスト】
場所: ${trip.location}
旅程:
${itineraryContext}

予約・知識:
${tipsContext}`;

    const trimmedHistory = history
      .filter((item) => (item.role === "user" || item.role === "assistant") && item.content.trim())
      .slice(-8);

    let answer = "";
    let usedProvider = "";
    let providerSource = "";

    try {
      const result = await generateTravelTextWithFallback({
        prompt: message,
        systemInstruction: systemPrompt,
        history: trimmedHistory,
        maxOutputTokens: 700,
        temperature: 0.7,
        topP: 0.9,
      });

      answer = result.text;
      usedProvider = `${result.provider}:${result.model}`;
      providerSource = result.source;
    } catch (error) {
      console.warn("Travel advisor fallback exhausted:", error);
    }

    if (!answer) {
      answer = "申し訳ありません。いまはコンシェルジュが応答できません。少し時間をおいて、もう一度お試しください。";
      usedProvider = "none";
    }

    return NextResponse.json({
      answer,
      provider: usedProvider,
      providerSource,
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
