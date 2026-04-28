import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Google Gemini API Call
 */
async function callGemini(message: string, systemPrompt: string, history: ChatMessage[], isPro = false) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY が設定されていません。');

  // isPro が true の場合は Pro モデル、そうでない場合は高速な Flash モデルを使用
  const model = isPro ? 'gemini-1.5-pro-latest' : 'gemini-1.5-flash-latest';

  const body = {
    contents: [
      ...history.map((h) => ({
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

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw { status: response.status, message: `Gemini ${model} failed`, data: errorData };
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "Gemini からの応答が空でした。";
}

/**
 * OpenAI API Call
 */
async function callOpenAI(message: string, systemPrompt: string, history: ChatMessage[]) {
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
        ...history.map(h => ({
          role: h.role === 'assistant' ? 'assistant' : 'user',
          content: h.content
        })),
        { role: 'user', content: message }
      ],
      max_tokens: 800,
      temperature: 0.7,
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw { status: response.status, message: 'OpenAI failed', data: errorData };
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

    const trip = await prisma.trip.findUnique({
      where: { slug },
      include: {
        days: {
          orderBy: { dayNumber: 'asc' },
          include: { events: { orderBy: { order: 'asc' } } },
        },
        tips: true,
      },
    });

    if (!trip) return NextResponse.json({ error: 'Trip not found' }, { status: 404 });

    const itineraryContext = trip.days.map(day => {
      const events = day.events.map(e => `${e.time} ${e.title}`).join(', ');
      return `Day ${day.dayNumber}: ${events}`;
    }).join('\n');

    const tipsContext = trip.tips.map(t => `${t.title}: ${t.body}`).join('\n');

    const systemPrompt = `あなたは「福岡旅行 2026」の専属コンシェルジュです。
上質でミニマル、情緒的なトーンで、二人の旅を美しく彩るアドバイスを行ってください。

【現在の旅行計画】
${itineraryContext}

【攻略情報・予約状況】
${tipsContext}

【スタイルガイド】
- 言葉を選び、簡潔かつ洗練された表現で。
- 計画の余白を慈しむような上質な提案を。
- 福岡の奥深い魅力を一言添える。
- 過剰な装飾を避け、知的な美しさを。`;

    const trimmedHistory = history.slice(-6);
    let answer = "";
    let usedProvider = "";

    // --- 自動振り分け・フォールバックロジック ---
    
    // Step 1: Gemini Flash (高速・無料枠)
    try {
      answer = await callGemini(message, systemPrompt, trimmedHistory, false);
      usedProvider = "gemini-flash";
    } catch (flashError: any) {
      console.warn("Gemini Flash failed, falling back to OpenAI...", flashError.status || flashError.message);
      
      // Step 2: OpenAI GPT-4o-mini (信頼性・バックアップ)
      try {
        answer = await callOpenAI(message, systemPrompt, trimmedHistory);
        usedProvider = "openai";
      } catch (openAiError: any) {
        console.warn("OpenAI failed, falling back to Gemini Pro...", openAiError.status || openAiError.message);
        
        // Step 3: Gemini Pro (最終手段・高精度)
        try {
          answer = await callGemini(message, systemPrompt, trimmedHistory, true);
          usedProvider = "gemini-pro";
        } catch (proError: any) {
          console.error("All providers failed.");
          answer = "申し訳ありません。現在コンシェルジュが大変混み合っております。少し時間をおいてから再度お声がけいただけますでしょうか。";
          usedProvider = "none";
        }
      }
    }

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
    console.error('AI Advisor Fatal Error:', error);
    return NextResponse.json({ error: 'AIとの通信中に予期せぬエラーが発生しました' }, { status: 500 });
  }
}
