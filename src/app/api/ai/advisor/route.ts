import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * Google Gemini API (Main - Free Tier)
 */
async function callGemini(message: string, systemPrompt: string, history: any[]) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('Gemini API Key (GOOGLE_GENERATIVE_AI_API_KEY or GEMINI_API_KEY) が設定されていません。');

  const body = {
    contents: [
      ...history.map((h: any) => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }]
      })),
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ],
    system_instruction: {
      parts: [{ text: systemPrompt }]
    },
    generationConfig: {
      maxOutputTokens: 800,
      temperature: 0.7,
    }
  };

  // 2026年現在の環境では gemini-flash-latest が推奨 (Gemini 3 Flash 相当)
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Gemini API Error: ${response.status} ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "Gemini からの応答が空でした。";
}

/**
 * OpenAI API (Currently Commented Out in POST)
 */
async function callOpenAI(message: string, systemPrompt: string, history: any[]) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY が設定されていません。');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...history,
        { role: 'user', content: message }
      ],
      max_tokens: 500,
      temperature: 0.7,
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`OpenAI API Error: ${response.status} ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "OpenAI からの応答が空でした。";
}

export async function POST(req: Request) {
  try {
    const { slug, message, history = [] } = await req.json();

    if (!slug || !message) {
      return NextResponse.json({ error: 'Slug and message are required' }, { status: 400 });
    }

    // 旅のデータを取得
    const trip = await prisma.trip.findUnique({
      where: { slug },
      include: {
        days: {
          orderBy: { dayNumber: 'asc' },
          include: {
            events: {
              orderBy: { order: 'asc' },
            },
          },
        },
        tips: true,
      },
    });

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    const itineraryContext = trip.days.map(day => {
      const events = day.events.map(e => `${e.time} ${e.title}`).join(', ');
      return `Day ${day.dayNumber}: ${events}`;
    }).join('\n');

    const tipsContext = trip.tips.map(t => t.title).join(', ');

    const systemPrompt = `あなたは「福岡旅行 2026」の専属コンシェルジュです。
上質でミニマル、情緒的なトーンで、二人の旅を美しく彩るアドバイスを行ってください。

【現在の旅行計画】
${itineraryContext}

【お役立ち情報】
${tipsContext}

【スタイルガイド】
- 言葉を選び、簡潔かつ洗練された表現で。
- 計画の余白を慈しむような上質な提案を。
- 福岡の奥深い魅力を一言添える。
- 過剰な装飾を避け、知的な美しさを。`;

    const trimmedHistory = history.slice(-6);

    let answer = "";
    let usedProvider = "";

    // --- Gemini (メインプロバイダー) ---
    try {
      if (geminiKey) {
        answer = await callGemini(message, systemPrompt, trimmedHistory);
        usedProvider = "gemini";
      } else {
        throw new Error("Gemini API Key missing");
      }
    } catch (geminiError: any) {
      console.error("Gemini failed:", geminiError.message);
      
      // OpenAI バックアップ（必要に応じてコメントアウトを外して使用）
      /*
      try {
        if (process.env.OPENAI_API_KEY) {
          answer = await callOpenAI(message, systemPrompt, trimmedHistory);
          usedProvider = "openai";
        } else {
          throw new Error("OpenAI API Key missing");
        }
      } catch (openAiError) {
        answer = "申し訳ありません。現在コンシェルジュが応答できません。";
        usedProvider = "none";
      }
      */
      
      answer = "申し訳ありません。現在コンシェルジュが少し席を外しております。時間をおいてもう一度お声がけいただけますか？";
      usedProvider = "error";
    }

    // 人工的な遅延
    await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json({ 
      answer,
      provider: usedProvider,
      history: [
        ...history,
        { role: 'user', content: message },
        { role: 'assistant', content: answer },
      ]
    });

  } catch (error: any) {
    console.error('AI Advisor Error:', error);
    return NextResponse.json({ 
      error: error.message || 'AIとの通信に失敗しました',
    }, { status: 500 });
  }
}
