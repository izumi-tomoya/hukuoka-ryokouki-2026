import { PREFERRED_TRAVEL_AI_CANDIDATES } from "@/lib/travelAiPreferences";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type OllamaModelResponse = {
  name: string;
  model?: string;
  modified_at?: string;
  size?: number;
  digest?: string;
  details?: {
    format?: string;
    family?: string;
    families?: string[];
    parameter_size?: string;
    quantization_level?: string;
  };
};

type OllamaTagsResponse = {
  models?: OllamaModelResponse[];
};

type OllamaChatResponse = {
  message?: {
    content?: string;
  };
  done_reason?: string;
};

export interface LocalAiError extends Error {
  status?: number;
  data?: unknown;
}

export type LocalAiModelMetadata = {
  model: string;
  modifiedAt?: string;
  size?: number;
  digest?: string;
  family?: string;
  families: string[];
  parameterSize?: string;
  quantizationLevel?: string;
};

type GenerateTextOptions = {
  model: string;
  prompt: string;
  systemInstruction?: string;
  history?: ChatMessage[];
  maxOutputTokens?: number;
  temperature?: number;
  topP?: number;
};

export const DEFAULT_LOCAL_TRAVEL_AI_MODELS = ["gemma3"] as const;

const TRAVEL_AI_MODELS_ENV_KEYS = ["LOCAL_AI_MODELS", "TRAVEL_AI_MODELS", "HOSTED_TRAVEL_AI_MODELS"] as const;
const DEFAULT_OLLAMA_BASE_URL = "http://127.0.0.1:11434";
const AUTO_DISCOVERED_LOCAL_AI_SOURCE = "installed-gemma-auto";
const AUTO_DISCOVERED_NO_GEMMA_SOURCE = "installed-gemma-auto-empty";
const AUTO_DISCOVERY_FALLBACK_SOURCE = "default-after-discovery-failure";

function normalizeModelId(model: string) {
  return model.trim();
}

function uniqueModels(models: string[]) {
  return Array.from(new Set(models.map((model) => normalizeModelId(model)).filter(Boolean)));
}

export function parseLocalTravelAiModels(raw?: string | null) {
  if (!raw?.trim()) {
    return [...DEFAULT_LOCAL_TRAVEL_AI_MODELS];
  }

  return uniqueModels(raw.split(","));
}

export function getLocalTravelAiModelsConfig() {
  for (const envKey of TRAVEL_AI_MODELS_ENV_KEYS) {
    const raw = process.env[envKey];
    if (raw?.trim()) {
      return {
        models: parseLocalTravelAiModels(raw),
        source: envKey,
      } as const;
    }
  }

  return {
    models: [...DEFAULT_LOCAL_TRAVEL_AI_MODELS],
    source: "default",
  } as const;
}

export function getLocalTravelAiModels() {
  return getLocalTravelAiModelsConfig().models;
}

function isGemmaModel(model: LocalAiModelMetadata) {
  const family = model.family?.toLowerCase() || "";
  const families = model.families.map((item) => item.toLowerCase());
  const modelName = model.model.toLowerCase();

  return family.startsWith("gemma") || families.some((item) => item.startsWith("gemma")) || modelName.startsWith("gemma");
}

function parseGemmaGeneration(model: LocalAiModelMetadata) {
  const haystack = [model.family, ...model.families, model.model].filter(Boolean).join(" ").toLowerCase();
  const match = haystack.match(/gemma\s*-?\s*(\d+)/);
  return match ? Number(match[1]) : 0;
}

function parseBillions(raw?: string) {
  if (!raw) return 0;

  const match = raw.toLowerCase().match(/(\d+(?:\.\d+)?)\s*b/);
  return match ? Number(match[1]) : 0;
}

function parseModelSize(model: LocalAiModelMetadata) {
  return parseBillions(model.parameterSize) || parseBillions(model.model);
}

function sortGemmaModels(models: LocalAiModelMetadata[]) {
  return [...models].sort((left, right) => {
    const preferredLeftIndex = PREFERRED_TRAVEL_AI_CANDIDATES.indexOf(left.model as (typeof PREFERRED_TRAVEL_AI_CANDIDATES)[number]);
    const preferredRightIndex = PREFERRED_TRAVEL_AI_CANDIDATES.indexOf(right.model as (typeof PREFERRED_TRAVEL_AI_CANDIDATES)[number]);
    if (preferredLeftIndex !== -1 || preferredRightIndex !== -1) {
      if (preferredLeftIndex === -1) return 1;
      if (preferredRightIndex === -1) return -1;
      if (preferredLeftIndex !== preferredRightIndex) return preferredLeftIndex - preferredRightIndex;
    }

    const generationDelta = parseGemmaGeneration(right) - parseGemmaGeneration(left);
    if (generationDelta !== 0) return generationDelta;

    const sizeDelta = parseModelSize(right) - parseModelSize(left);
    if (sizeDelta !== 0) return sizeDelta;

    const modifiedDelta = new Date(right.modifiedAt || 0).getTime() - new Date(left.modifiedAt || 0).getTime();
    if (modifiedDelta !== 0) return modifiedDelta;

    return left.model.localeCompare(right.model);
  });
}

export function getInstalledGemmaModels(models: LocalAiModelMetadata[]) {
  return sortGemmaModels(models.filter(isGemmaModel));
}

export async function resolveLocalTravelAiModels(installedModels?: LocalAiModelMetadata[]) {
  const config = getLocalTravelAiModelsConfig();
  if (config.source !== "default") {
    return config;
  }

  try {
    const gemmaModels = getInstalledGemmaModels(installedModels || (await listLocalModels())).map((model) => model.model);
    if (gemmaModels.length > 0) {
      return {
        models: gemmaModels,
        source: AUTO_DISCOVERED_LOCAL_AI_SOURCE,
      } as const;
    }

    return {
      models: [...DEFAULT_LOCAL_TRAVEL_AI_MODELS],
      source: AUTO_DISCOVERED_NO_GEMMA_SOURCE,
    } as const;
  } catch {
    return {
      models: [...DEFAULT_LOCAL_TRAVEL_AI_MODELS],
      source: AUTO_DISCOVERY_FALLBACK_SOURCE,
    } as const;
  }

  return config;
}

export function getOllamaBaseUrl() {
  return (process.env.OLLAMA_BASE_URL || DEFAULT_OLLAMA_BASE_URL).replace(/\/+$/, "");
}

function buildMessages(prompt: string, history: ChatMessage[], systemInstruction?: string) {
  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [];

  if (systemInstruction?.trim()) {
    messages.push({ role: "system", content: systemInstruction.trim() });
  }

  messages.push(
    ...history
      .filter((item) => (item.role === "user" || item.role === "assistant") && item.content.trim())
      .map((item) => ({
        role: item.role,
        content: item.content,
      }))
  );

  messages.push({ role: "user", content: prompt });

  return messages;
}

function normalizeOllamaModel(model: OllamaModelResponse): LocalAiModelMetadata {
  return {
    model: model.model || model.name,
    modifiedAt: model.modified_at,
    size: model.size,
    digest: model.digest,
    family: model.details?.family,
    families: model.details?.families || [],
    parameterSize: model.details?.parameter_size,
    quantizationLevel: model.details?.quantization_level,
  };
}

export async function listLocalModels() {
  const response = await fetch(`${getOllamaBaseUrl()}/api/tags`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(`Local AI models.list failed: ${response.status}`) as LocalAiError;
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  const data = (await response.json()) as OllamaTagsResponse;
  return (data.models || []).map(normalizeOllamaModel).sort((a, b) => a.model.localeCompare(b.model));
}

export async function generateLocalText({
  model,
  prompt,
  systemInstruction,
  history = [],
  maxOutputTokens = 700,
  temperature = 0.7,
  topP = 0.9,
}: GenerateTextOptions) {
  const response = await fetch(`${getOllamaBaseUrl()}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      model,
      stream: false,
      messages: buildMessages(prompt, history, systemInstruction),
      options: {
        num_predict: maxOutputTokens,
        temperature,
        top_p: topP,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(`Local AI ${model} failed: ${response.status}`) as LocalAiError;
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  const data = (await response.json()) as OllamaChatResponse;
  const text = data.message?.content?.trim() || "";

  if (text) {
    return text;
  }

  const error = new Error(`Local AI ${model} returned no text (${data.done_reason || "unknown"})`) as LocalAiError;
  error.data = data;
  throw error;
}
