This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## AI Config

Travel AI routes support both local `Ollama` and hosted `Gemini API`.

### Provider Selection

```bash
AI_PROVIDER=auto
```

- `auto`: Try local Ollama first. If no usable local Gemma model is found, fall back to Gemini API.
- `local`: Use Ollama only.
- `google`: Use Gemini API only.

### Local Ollama

```bash
OLLAMA_BASE_URL=http://127.0.0.1:11434
LOCAL_AI_MODELS=gemma-4-26b-a4b-it,gemma-4-31b-it
```

If `LOCAL_AI_MODELS` is not set, the app auto-discovers installed `Gemma` models from Ollama and sorts them with this priority:

1. `gemma-4-26b-a4b-it`
2. `gemma-4-31b-it`
3. other installed Gemma models

### Google Gemini API

```bash
GOOGLE_GENERATIVE_AI_API_KEY=your_key
GOOGLE_AI_MODELS=gemma-4-26b-a4b-it,gemma-4-31b-it,gemini-2.5-flash-lite,gemini-2.5-flash,gemma-3-27b-it
```

If `GOOGLE_AI_MODELS` is not set, the app uses the same priority as above. In practice, the free-tier-friendly hosted fallbacks are:

1. `gemini-2.5-flash-lite`
2. `gemini-2.5-flash`
3. `gemma-3-27b-it`

`gemini-1.5-flash-latest` is intentionally not the default fallback anymore because current Google docs list `Gemini 1.5 Flash` as deprecated.

`GET /api/ai/models` returns the preferred provider, effective provider, local installed models, and Google-available models for the configured API key.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
