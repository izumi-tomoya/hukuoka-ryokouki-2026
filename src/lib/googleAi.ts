import { PREFERRED_GOOGLE_TRAVEL_AI_CANDIDATES } from "@/lib/travelAiPreferences";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type GoogleModelResponse = {
  name: string;
  version?: string;
  displayName?: string;
  description?: string;
  inputTokenLimit?: number;
  outputTokenLimit?: number;
  supportedGenerationMethods?: string[];
};

type GenerateContentResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
    finishReason?: string;
  }>;
  promptFeedback?: {
    blockReason?: string;
  };
};

type ListModelsResponse = {
  models?: GoogleModelResponse[];
  nextPageToken?: string;
};

type GenerateTextOptions = {
  model: string;
  prompt: string;
  systemInstruction?: string;
  history?: ChatMessage[];
  maxOutputTokens?: number;
  temperature?: number;
  topP?: number;
  timeoutMs?: number;
};

export interface GoogleAiError extends Error {
  status?: number;
  data?: unknown;
}

export type GoogleModelMetadata = {
  model: string;
  name: string;
  version?: string;
  displayName?: string;
  description?: string;
  inputTokenLimit?: number;
  outputTokenLimit?: number;
  supportedGenerationMethods: string[];
};

export const DEFAULT_GOOGLE_TRAVEL_AI_MODELS = [...PREFERRED_GOOGLE_TRAVEL_AI_CANDIDATES] as const;

const GOOGLE_TRAVEL_AI_MODEL_ENV_KEYS = ["GOOGLE_AI_MODELS", "GEMINI_MODELS"] as const;
const GOOGLE_API_BASE_URL = "https://generativelanguage.googleapis.com";
const unavailableGoogleModels = new Set<string>();

export function getGoogleBaseUrl() {
  const gatewayUrl = process.env.GOOGLE_AI_GATEWAY_URL;
  if (gatewayUrl && gatewayUrl.startsWith("http")) {
    return gatewayUrl;
  }
  return GOOGLE_API_BASE_URL;
}

function isGemmaModel(model: string) {
  return model.toLowerCase().includes("gemma");
}

function normalizeModelId(model: string) {
  return model.trim().replace(/^models\//, "");
}

function uniqueModels(models: string[]) {
  return Array.from(new Set(models.map((model) => normalizeModelId(model)).filter(Boolean)));
}

export function parseGoogleTravelAiModels(raw?: string | null) {
  if (!raw?.trim()) {
    return [...DEFAULT_GOOGLE_TRAVEL_AI_MODELS];
  }

  return uniqueModels(raw.split(","));
}

export function getGoogleTravelAiModelsConfig() {
  for (const envKey of GOOGLE_TRAVEL_AI_MODEL_ENV_KEYS) {
    const raw = process.env[envKey];
    if (raw?.trim()) {
      return {
        models: parseGoogleTravelAiModels(raw),
        source: envKey,
      } as const;
    }
  }

  return {
    models: [...DEFAULT_GOOGLE_TRAVEL_AI_MODELS],
    source: "default",
  } as const;
}

export function getGoogleApiKey() {
  return process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || null;
}

function buildContents(model: string, prompt: string, history: ChatMessage[], systemInstruction?: string) {
  const currentPrompt =
    systemInstruction && isGemmaModel(model)
      ? `${systemInstruction}\n\n上記の方針を守って、次の依頼に日本語で答えてください。\n${prompt}`
      : prompt;

  return [
    ...history.map((item) => ({
      role: item.role === "assistant" ? "model" : "user",
      parts: [{ text: item.content }],
    })),
    {
      role: "user",
      parts: [{ text: currentPrompt }],
    },
  ];
}

function normalizeGoogleModel(model: GoogleModelResponse): GoogleModelMetadata {
  return {
    model: normalizeModelId(model.name),
    name: model.name,
    version: model.version,
    displayName: model.displayName,
    description: model.description,
    inputTokenLimit: model.inputTokenLimit,
    outputTokenLimit: model.outputTokenLimit,
    supportedGenerationMethods: model.supportedGenerationMethods || [],
  };
}

export async function listGoogleModels() {
  const apiKey = getGoogleApiKey();
  const oidcToken = process.env.VERCEL_OIDC_TOKEN;

  if (!apiKey && !oidcToken) {
    throw new Error("GOOGLE_GENERATIVE_AI_API_KEY または VERCEL_OIDC_TOKEN が設定されていません。");
  }

  const models: GoogleModelMetadata[] = [];
  let pageToken: string | undefined;

  do {
    const searchParams = new URLSearchParams({ pageSize: "1000" });
    if (pageToken) {
      searchParams.set("pageToken", pageToken);
    }

    const headers: Record<string, string> = {};
    if (oidcToken) {
      headers["Authorization"] = `Bearer ${oidcToken}`;
    } else if (apiKey) {
      headers["x-goog-api-key"] = apiKey;
    }

    const response = await fetch(`${getGoogleBaseUrl()}/v1/models?${searchParams.toString()}`, {
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(`Google AI models.list failed: ${response.status}`) as GoogleAiError;
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    const data = (await response.json()) as ListModelsResponse;
    models.push(...(data.models || []).map(normalizeGoogleModel));
    pageToken = data.nextPageToken;
  } while (pageToken);

  return models.sort((a, b) => a.model.localeCompare(b.model));
}

export async function generateGoogleText({
  model,
  prompt,
  systemInstruction,
  history = [],
  maxOutputTokens = 700,
  temperature = 0.7,
  topP = 0.9,
  timeoutMs,
}: GenerateTextOptions) {
  if (unavailableGoogleModels.has(model)) {
    const error = new Error(`Google AI ${model} is marked unavailable`) as GoogleAiError;
    error.status = 404;
    throw error;
  }

  const apiKey = getGoogleApiKey();
  const oidcToken = process.env.VERCEL_OIDC_TOKEN;

  if (!apiKey && !oidcToken) {
    throw new Error("GOOGLE_GENERATIVE_AI_API_KEY または VERCEL_OIDC_TOKEN が設定されていません。");
  }

  const payload: Record<string, unknown> = {
    contents: buildContents(model, prompt, history, systemInstruction),
    generationConfig: {
      maxOutputTokens,
      temperature,
      topP,
    },
  };

  if (systemInstruction && !isGemmaModel(model)) {
    payload.systemInstruction = {
      parts: [{ text: systemInstruction }],
    };
  }

  const controller = timeoutMs ? new AbortController() : undefined;
  const timeout = controller ? setTimeout(() => controller.abort(), timeoutMs) : undefined;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (oidcToken) {
    headers["Authorization"] = `Bearer ${oidcToken}`;
  } else if (apiKey) {
    headers["x-goog-api-key"] = apiKey;
  }

  try {
    const response = await fetch(`${getGoogleBaseUrl()}/v1/models/${model}:generateContent`, {
      method: "POST",
      headers,
      cache: "no-store",
      signal: controller?.signal,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(`Google AI ${model} failed: ${response.status}`) as GoogleAiError;
      error.status = response.status;
      error.data = errorData;
      if (response.status === 404) {
        unavailableGoogleModels.add(model);
      }
      throw error;
    }

    const data = (await response.json()) as GenerateContentResponse;
    const text =
      data.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || "")
        .join("\n")
        .trim() || "";

    if (text) {
      return text;
    }

    const error = new Error(
      `Google AI ${model} returned no text (${data.candidates?.[0]?.finishReason || data.promptFeedback?.blockReason || "unknown"})`,
    ) as GoogleAiError;
    error.data = data;
    throw error;
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}
