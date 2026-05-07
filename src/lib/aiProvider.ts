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
};

export type TravelAiProvider = "local" | "google";

export type TravelAiRuntime = {
  provider: TravelAiProvider;
  models: string[];
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

export async function generateTravelTextWithFallback({
  prompt,
  systemInstruction,
  history = [],
  maxOutputTokens,
  temperature,
  topP,
}: GenerateTravelTextOptions) {
  const runtime = await resolveTravelAiRuntime();
  const errors: Array<{ model: string; status?: number; message: string }> = [];

  for (const model of runtime.models) {
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
            })
          : await generateGoogleText({
              model,
              prompt,
              systemInstruction,
              history,
              maxOutputTokens,
              temperature,
              topP,
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
        message: err.message,
      });
    }
  }

  const error = new Error(`No ${runtime.provider} AI model produced a response`) as LocalAiError;
  error.data = errors;
  throw error;
}
