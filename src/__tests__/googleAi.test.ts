import {
  DEFAULT_GOOGLE_TRAVEL_AI_MODELS,
  getGoogleApiKey,
  getGoogleTravelAiModelsConfig,
  parseGoogleTravelAiModels,
} from "@/lib/googleAi";

describe("parseGoogleTravelAiModels()", () => {
  it("falls back to defaults when input is empty", () => {
    expect(parseGoogleTravelAiModels("")).toEqual([...DEFAULT_GOOGLE_TRAVEL_AI_MODELS]);
  });

  it("trims values and removes duplicates while preserving order", () => {
    expect(parseGoogleTravelAiModels(" gemma-4-26b-a4b-it , gemma-4-26b-a4b-it, gemini-2.5-flash-lite ")).toEqual([
      "gemma-4-26b-a4b-it",
      "gemini-2.5-flash-lite",
    ]);
  });
});

describe("getGoogleTravelAiModelsConfig()", () => {
  const originalGoogleAiModels = process.env.GOOGLE_AI_MODELS;
  const originalGeminiModels = process.env.GEMINI_MODELS;
  const originalGoogleApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  const originalGeminiApiKey = process.env.GEMINI_API_KEY;

  afterEach(() => {
    if (originalGoogleAiModels === undefined) {
      delete process.env.GOOGLE_AI_MODELS;
    } else {
      process.env.GOOGLE_AI_MODELS = originalGoogleAiModels;
    }

    if (originalGeminiModels === undefined) {
      delete process.env.GEMINI_MODELS;
    } else {
      process.env.GEMINI_MODELS = originalGeminiModels;
    }

    if (originalGoogleApiKey === undefined) {
      delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    } else {
      process.env.GOOGLE_GENERATIVE_AI_API_KEY = originalGoogleApiKey;
    }

    if (originalGeminiApiKey === undefined) {
      delete process.env.GEMINI_API_KEY;
    } else {
      process.env.GEMINI_API_KEY = originalGeminiApiKey;
    }
  });

  it("prefers GOOGLE_AI_MODELS over GEMINI_MODELS", () => {
    process.env.GOOGLE_AI_MODELS = "gemma-4-26b-a4b-it,gemini-2.5-flash-lite";
    process.env.GEMINI_MODELS = "gemma-3-27b-it";

    expect(getGoogleTravelAiModelsConfig()).toEqual({
      models: ["gemma-4-26b-a4b-it", "gemini-2.5-flash-lite"],
      source: "GOOGLE_AI_MODELS",
    });
  });

  it("returns the first configured API key", () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = "google-key";
    process.env.GEMINI_API_KEY = "gemini-key";
    expect(getGoogleApiKey()).toBe("google-key");

    delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    expect(getGoogleApiKey()).toBe("gemini-key");
  });
});
