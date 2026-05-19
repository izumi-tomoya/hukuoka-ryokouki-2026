import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

// Vercel AI Gateway (Unified API) の設定
// AI_GATEWAY_API_KEY が設定されている場合、それを使用します。
const gateway = createOpenAI({
  apiKey: process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN,
  baseURL: 'https://ai-gateway.vercel.sh/v1',
});

async function main() {
  try {
    const result = await streamText({
      model: gateway('google/gemini-1.5-flash'),
      prompt: '福岡旅行のおすすめスポットを3つ、非常に簡潔に教えてください。',
    });

    console.log('--- AI Response (Streaming) ---');
    for await (const chunk of result.textStream) {
      process.stdout.write(chunk);
    }
    console.log('\n--- End of Response ---');
  } catch (error) {
    console.error('Error:', error.message || error);
  }
}

main();
