import { NextResponse } from "next/server";
import { cleanLocationName, getLocationCoordinates } from "@/features/trip/utils/locationCatalog";
import { compactAdvisorAnswer } from "@/lib/advisorResponse";
import { generateTravelTextWithFallback } from "@/lib/aiProvider";
import { auth } from "@/lib/auth";
import { searchGourmet } from "@/lib/external/hotpepper";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const ADVISOR_MAX_OUTPUT_TOKENS = 220;
const ADVISOR_MAX_ANSWER_SENTENCES = 3;
const ADVISOR_MAX_ANSWER_CHARACTERS = 260;
const ADVISOR_MAX_HISTORY_MESSAGES = 4;
const ADVISOR_MAX_EVENTS_PER_DAY = 8;
const ADVISOR_MAX_TIPS = 8;
const ADVISOR_MAX_TIP_BODY_CHARACTERS = 90;
const ADVISOR_MAX_MODEL_ATTEMPTS = 2;
const ADVISOR_AI_TIMEOUT_MS = 10_000;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function truncateContextText(value: string | null | undefined, maxCharacters: number) {
  if (!value) return "";

  const normalized = value.replace(/\s+/g, " ").trim();
  if (Array.from(normalized).length <= maxCharacters) return normalized;

  return `${Array.from(normalized)
    .slice(0, maxCharacters - 1)
    .join("")
    .trim()}…`;
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
      history?: ChatMessage[];
    };

    if (!slug || !message) {
      return NextResponse.json({ error: "Slug and message are required" }, { status: 400 });
    }

    const trip = await prisma.trip.findUnique({
      where: { slug },
      select: {
        title: true,
        location: true,
        days: {
          orderBy: { dayNumber: "asc" },
          select: {
            dayNumber: true,
            events: {
              orderBy: { order: "asc" },
              select: {
                time: true,
                type: true,
                title: true,
                formalName: true,
                foodName: true,
                tag: true,
                isConfirmed: true,
              },
            },
          },
        },
        tips: {
          orderBy: { order: "asc" },
          select: {
            title: true,
            category: true,
            body: true,
            isWarning: true,
          },
        },
      },
    });

    if (!trip) return NextResponse.json({ error: "Trip not found" }, { status: 404 });

    const foodEvents = trip.days
      .flatMap((day) => day.events.filter((e) => e.type === "food"))
      .filter((e) => {
        if (isAdmin) return true;
        const titleText = e.title || e.foodName || "";
        return !(
          e.tag === "surprise" ||
          ["ヒルトン", "ヒルトン福岡シーホーク", "CLOUDS", "天空のサプライズ", "secret spot", "サプライズ"].some(
            (spot) => titleText.toLowerCase().includes(spot.toLowerCase()),
          )
        );
      })
      .slice(0, 4);

    const hotpepperResults = await Promise.allSettled(
      foodEvents.map(async (event) => {
        const name = cleanLocationName(event.foodName || event.title || "");
        if (!name) return null;
        const coords = getLocationCoordinates(event.foodName || event.title || "");
        const result = await Promise.race([
          searchGourmet(name, coords?.[0], coords?.[1]),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000)),
        ]);
        if (!result) return null;
        const features = [
          result.wifi?.includes("あり") ? "Wi-Fi○" : "",
          result.card?.includes("可") ? "カード○" : "",
          result.private_room?.includes("あり") ? "個室○" : "",
          result.lunch?.includes("あり") ? "ランチ○" : "",
          result.midnight?.includes("あり") ? "深夜○" : "",
        ]
          .filter(Boolean)
          .join(" ");
        return `${event.title || event.foodName}: 予算${result.budget} / 営業${result.open}${features ? ` / ${features}` : ""}`;
      }),
    );

    const hotpepperContext = hotpepperResults
      .map((r) => (r.status === "fulfilled" ? r.value : null))
      .filter(Boolean)
      .join("\n");

    const itineraryContext = trip.days
      .map((day) => {
        const events = day.events
          .slice(0, ADVISOR_MAX_EVENTS_PER_DAY)
          .map((event) => {
            const titleText = event.title || event.foodName || "";
            const isSecret =
              !isAdmin &&
              (event.tag === "surprise" ||
                ["ヒルトン", "ヒルトン福岡シーホーク", "CLOUDS", "天空のサプライズ", "secret spot", "サプライズ"].some(
                  (spot) => titleText.toLowerCase().includes(spot.toLowerCase()),
                ));
            const displayName = isSecret ? "🎁 Surprise Spot" : titleText || "Untitled";
            return `${event.time} ${displayName}${event.isConfirmed ? " [fixed]" : ""}`;
          })
          .join(" / ");
        return `Day ${day.dayNumber}: ${events}`;
      })
      .join("\n");

    const tipsContext = trip.tips
      .slice(0, ADVISOR_MAX_TIPS)
      .map((tip) => {
        const label = [tip.category, tip.isWarning ? "warning" : ""].filter(Boolean).join("/");
        return `${tip.title}${label ? ` [${label}]` : ""}: ${truncateContextText(tip.body, ADVISOR_MAX_TIP_BODY_CHARACTERS)}`;
      })
      .join("\n");

    const systemPrompt = `あなたは「${trip.title}」の専属コンシェルジュです。
知里様と智也様の旅が、静かで上質、かつ淀みなく進むようサポートしてください。

【人格とトーン】
- 二人旅の空気感を壊さない、控えめながらも的確な「大人のコンシェルジュ」。
- 丁寧語を用いつつ、事務的すぎない。ただし余韻や情景描写より、次に取る行動を優先します。

【回答の指針】
1. **予約と実務の優先**: [fixed] マークの付いた予定は確定した大切な時間として扱い、それを軸に周辺の調整案を提示してください。
2. **状況への洞察**:
   - 雨天時：屋外（大濠公園、中洲屋台、太宰府参道など）を避け、屋内（美術館、ラウンジ、ホテル内）での滞在を具体的に提案。
   - 疲労・遅延時：予定を削る勇気を持ち、カフェでの休憩やホテルの滞在時間を延ばすことを優しく勧める。
3. **具体的な助言**: 可能な限り「時刻（xx時頃）」や「具体的な場所」を回答に含め、すぐに行動に移せるようにしてください。
4. **知識の活用**:
   - 「空路、福岡へ」という記述は、**羽田空港**から福岡空港へのフライトを指します。
   - 【予約・知識】にある内容（機密情報や警告）を把握し、先回りした助言を行ってください。

【制約】
- 日本語で回答する。
- 1回答は最大3文、260字以内。短いほどよい。
- 1文目に結論、2文目以降に理由か次の行動を入れる。
- 質問に関係する情報だけ使い、旅程や予約情報を列挙しない。
- Markdown見出し、箇条書き、長い前置き、一般論、空行は使わない。
- 不明なことは断定せず、選択肢を提示して寄り添う。
- 危険や遅延リスクがある場合は、冒頭で短く警告する。

【現在のコンテキスト】
場所: ${trip.location}
旅程:
${itineraryContext}

予約・知識:
${tipsContext}${hotpepperContext ? `\n\nグルメ情報（HotPepper）:\n${hotpepperContext}` : ""}`;

    const trimmedHistory = history
      .filter((item) => (item.role === "user" || item.role === "assistant") && item.content.trim())
      .slice(-ADVISOR_MAX_HISTORY_MESSAGES);

    let answer = "";
    let usedProvider = "";
    let providerSource = "";

    try {
      const result = await generateTravelTextWithFallback({
        prompt: message,
        systemInstruction: systemPrompt,
        history: trimmedHistory,
        maxOutputTokens: ADVISOR_MAX_OUTPUT_TOKENS,
        temperature: 0.45,
        topP: 0.9,
        modelPreference: "fast",
        maxModelAttempts: ADVISOR_MAX_MODEL_ATTEMPTS,
        timeoutMs: ADVISOR_AI_TIMEOUT_MS,
      });

      answer = compactAdvisorAnswer(result.text, {
        maxSentences: ADVISOR_MAX_ANSWER_SENTENCES,
        maxCharacters: ADVISOR_MAX_ANSWER_CHARACTERS,
      });
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
      history: [...history, { role: "user", content: message }, { role: "assistant", content: answer }],
    });
  } catch (error) {
    const err = error as Error;
    console.error("AI Advisor Fatal Error:", err.message || "unknown fatal error");
    return NextResponse.json({ error: "AIとの通信中に予期せぬエラーが発生しました" }, { status: 500 });
  }
}
