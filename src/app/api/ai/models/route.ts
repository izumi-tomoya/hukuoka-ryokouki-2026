import { NextResponse } from "next/server";
import { getPreferredAiProvider, resolveTravelAiRuntime } from "@/lib/aiProvider";
import {
  DEFAULT_GOOGLE_TRAVEL_AI_MODELS,
  getGoogleApiKey,
  getGoogleTravelAiModelsConfig,
  listGoogleModels,
} from "@/lib/googleAi";
import {
  DEFAULT_LOCAL_TRAVEL_AI_MODELS,
  getInstalledGemmaModels,
  getLocalTravelAiModelsConfig,
  getOllamaBaseUrl,
  listLocalModels,
  resolveLocalTravelAiModels,
} from "@/lib/localAi";

export const dynamic = "force-dynamic";

export async function GET() {
  const preferredProvider = getPreferredAiProvider();
  const localConfig = getLocalTravelAiModelsConfig();
  const googleConfig = getGoogleTravelAiModelsConfig();

  const [runtime, localResult, googleResult] = await Promise.allSettled([
    resolveTravelAiRuntime(),
    listLocalModels(),
    getGoogleApiKey() ? listGoogleModels() : Promise.resolve([]),
  ]);

  const installedLocalModels = localResult.status === "fulfilled" ? localResult.value : [];
  const installedGemmaModels = getInstalledGemmaModels(installedLocalModels);
  const googleModels = googleResult.status === "fulfilled" ? googleResult.value : [];
  const generateContentGoogleModels = googleModels.filter((model) => model.supportedGenerationMethods.includes("generateContent"));
  const googleModelsById = new Map(generateContentGoogleModels.map((model) => [model.model, model]));
  const resolvedLocalConfig =
    localResult.status === "fulfilled" ? await resolveLocalTravelAiModels(installedLocalModels) : await resolveLocalTravelAiModels();

  return NextResponse.json({
    ok: runtime.status === "fulfilled",
    preferredProvider,
    effectiveProvider: runtime.status === "fulfilled" ? runtime.value.provider : null,
    effectiveModels: runtime.status === "fulfilled" ? runtime.value.models : [],
    effectiveSource: runtime.status === "fulfilled" ? runtime.value.source : null,
    local: {
      ok: localResult.status === "fulfilled",
      baseUrl: getOllamaBaseUrl(),
      configuredModels: localConfig.models,
      configuredSource: localConfig.source,
      resolvedModels: resolvedLocalConfig.models,
      resolvedSource: resolvedLocalConfig.source,
      defaultModels: [...DEFAULT_LOCAL_TRAVEL_AI_MODELS],
      gemmaModels: installedGemmaModels,
      installedModels: installedLocalModels,
      error: localResult.status === "rejected" ? String(localResult.reason) : null,
    },
    google: {
      ok: googleResult.status === "fulfilled",
      apiKeyConfigured: Boolean(getGoogleApiKey()),
      configuredModels: googleConfig.models,
      configuredSource: googleConfig.source,
      defaultModels: [...DEFAULT_GOOGLE_TRAVEL_AI_MODELS],
      configuredStatuses: googleConfig.models.map((model) => {
        const found = googleModelsById.get(model);
        return {
          model,
          available: Boolean(found),
          displayName: found?.displayName || null,
          inputTokenLimit: found?.inputTokenLimit || null,
          outputTokenLimit: found?.outputTokenLimit || null,
        };
      }),
      availableModels: generateContentGoogleModels.map((model) => ({
        model: model.model,
        displayName: model.displayName || null,
      })),
      error: googleResult.status === "rejected" ? String(googleResult.reason) : null,
    },
  });
}
