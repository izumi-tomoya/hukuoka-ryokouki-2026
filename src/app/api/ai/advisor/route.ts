import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { prisma } from '@/lib/prisma';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
              include: {
                yataiStops: true,
              },
            },
          },
        },
        tips: true,
      },
    });

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    // 行程をトークン節約のために簡略化してテキスト化
    const itineraryContext = trip.days.map(day => {
      const events = day.events.map(e => `${e.time} ${e.title}${e.isConfirmed ? ' (予約済)' : ''}`).join(', ');
      return `Day ${day.dayNumber}: ${events}`;
    }).join('\n');

    const tipsContext = trip.tips.map(t => t.title).join(', ');

    const systemPrompt = `Memoir Concierge - Fukuoka 2026.
上質でミニマル、情緒的なトーンで。二人の旅を美しく彩る専門家。
【Plan】${itineraryContext}
【Tips】${tipsContext}
【Style】
- 言葉を選び、簡潔かつ洗練された表現で。
- 計画の余白を慈しむような上質な提案を。
- 福岡の奥深い魅力を一言添える。
- 過剰な装飾を避け、知的な美しさを。`;

    // 履歴を直近の5往復（10メッセージ）に制限してトークンを節約
    const trimmedHistory = history.slice(-10);

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...trimmedHistory,
        { role: 'user', content: message },
      ],
      temperature: 0.7,
      max_tokens: 500, // 回答も短く制限
    });

    return NextResponse.json({ 
      answer: response.choices[0].message.content,
      history: [
        ...history,
        { role: 'user', content: message },
        { role: 'assistant', content: response.choices[0].message.content },
      ]
    });

  } catch (error: unknown) {
    console.error('AI Advisor Error:', error);
    return NextResponse.json({ error: 'AIとの通信に失敗しました' }, { status: 500 });
  }
}
