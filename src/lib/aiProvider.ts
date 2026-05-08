import { generateGoogleText, getGoogleApiKey, getGoogleTravelAiModelsConfig, GoogleAiError } from "@/lib/googleAi";
import { generateLocalText, listLocalModels, LocalAiError, resolveLocalTravelAiModels } from "@/lib/localAi";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type GenerateTravelTextOptions = {
  prompt: string;
  systemInstruction?: string;
  history?: ChatMessage[];
  maxOutputTokens?: number;
  temperature?: number;
  topP?: number;
  modelPreference?: "default" | "fast";
  maxModelAttempts?: number;
  timeoutMs?: number;
};

export type TravelAiProvider = "local" | "google";

export type TravelAiRuntime = {
  provider: TravelAiProvider;
  models: readonly string[];
  source: string;
};

export function getPreferredAiProvider() {
  const provider = (process.env.AI_PROVIDER || "auto").trim().toLowerCase();
  if (provider === "local" || provider === "google" || provider === "gemini") {
    return provider === "gemini" ? "google" : provider;
  }

  return "auto";
}

export async function resolveTravelAiRuntime() {
  const preferredProvider = getPreferredAiProvider();

  if (preferredProvider === "local") {
    const config = await resolveLocalTravelAiModels();
    return {
      provider: "local",
      models: config.models,
      source: config.source,
    } satisfies TravelAiRuntime;
  }

  if (preferredProvider === "google") {
    const config = getGoogleTravelAiModelsConfig();
    return {
      provider: "google",
      models: config.models,
      source: config.source,
    } satisfies TravelAiRuntime;
  }

  try {
    const installedModels = await listLocalModels();
    const localConfig = await resolveLocalTravelAiModels(installedModels);
    if (localConfig.source !== "installed-gemma-auto-empty") {
      return {
        provider: "local",
        models: localConfig.models,
        source: `auto->${localConfig.source}`,
      } satisfies TravelAiRuntime;
    }

    if (!getGoogleApiKey()) {
      return {
        provider: "local",
        models: localConfig.models,
        source: `auto->${localConfig.source}`,
      } satisfies TravelAiRuntime;
    }
  } catch {
    if (!getGoogleApiKey()) {
      const localConfig = await resolveLocalTravelAiModels();
      return {
        provider: "local",
        models: localConfig.models,
        source: `auto->${localConfig.source}`,
      } satisfies TravelAiRuntime;
    }
  }

  const googleConfig = getGoogleTravelAiModelsConfig();
  return {
    provider: "google",
    models: googleConfig.models,
    source: `auto->${googleConfig.source}`,
  } satisfies TravelAiRuntime;
}

function parseModelSize(model: string) {
  const lower = model.toLowerCase();
  const match = lower.match(/(?:^|[-_:])(\d+(?:\.\d+)?)b(?:$|[-_:])/u) || lower.match(/(\d+(?:\.\d+)?)\s*b/u);

  return match ? Number(match[1]) : 0;
}

function getFastModelScore(model: string) {
  const lower = model.toLowerCase();

  if (lower === "gemini-3.1-flash-lite") return 0;
  if (lower === "gemini-3.1-flash-lite-preview") return 1;
  if (lower === "gemini-3-flash-preview") return 2;
  if (lower === "gemini-2.5-flash-lite") return 3;
  if (lower === "gemini-2.5-flash") return 4;
  if (lower.includes("flash-lite")) return 5;
  if (lower.includes("flash")) return 6;

  const size = parseModelSize(lower);
  if (size > 0) return 10 + size;

  if (lower === "gemma3" || lower === "gemma3:latest") return 12;
  if (lower.includes("gemma")) return 30;

  return 40;
}

export function prioritizeTravelAiModelsForFastResponse(models: readonly string[]) {
  return models
    .map((model, index) => ({ model, index, score: getFastModelScore(model) }))
    .sort((left, right) => left.score - right.score || left.index - right.index)
    .map((item) => item.model);
}

export async function generateTravelTextWithFallback({
  prompt,
  systemInstruction,
  history = [],
  maxOutputTokens,
  temperature,
  topP,
  modelPreference = "default",
  maxModelAttempts,
  timeoutMs,
}: GenerateTravelTextOptions) {
  const runtime = await resolveTravelAiRuntime();
  const errors: Array<{ model: string; status?: number; message: string }> = [];
  const preferredModels =
    modelPreference === "fast" ? prioritizeTravelAiModelsForFastResponse(runtime.models) : runtime.models;
  const models = maxModelAttempts ? preferredModels.slice(0, maxModelAttempts) : preferredModels;

  for (const model of models) {
    try {
      const text =
        runtime.provider === "local"
          ? await generateLocalText({
              model,
              prompt,
              systemInstruction,
              history,
              maxOutputTokens,
              temperature,
              topP,
              timeoutMs,
            })
          : await generateGoogleText({
              model,
              prompt,
              systemInstruction,
              history,
              maxOutputTokens,
              temperature,
              topP,
              timeoutMs,
            });

      return {
        text,
        provider: runtime.provider,
        model,
        source: runtime.source,
        errors,
      } as const;
    } catch (error) {
      const err = error as LocalAiError | GoogleAiError;
      errors.push({
        model,
        status: err.status,
        message: err.message || String(error),
      });
    }
  }

  const error = new Error(`No ${runtime.provider} AI model produced a response`) as LocalAiError;
  error.data = errors;
  throw error;
}
