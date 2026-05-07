import {
  DEFAULT_LOCAL_TRAVEL_AI_MODELS,
  getLocalTravelAiModels,
  getLocalTravelAiModelsConfig,
  getOllamaBaseUrl,
  parseLocalTravelAiModels,
} from "@/lib/localAi";

describe("parseLocalTravelAiModels()", () => {
  it("falls back to defaults when input is empty", () => {
    expect(parseLocalTravelAiModels("")).toEqual([...DEFAULT_LOCAL_TRAVEL_AI_MODELS]);
  });

  it("trims values and removes duplicates while preserving order", () => {
    expect(parseLocalTravelAiModels(" gemma3:27b , gemma3:27b, gemma3:12b ")).toEqual(["gemma3:27b", "gemma3:12b"]);
  });
});

describe("getLocalTravelAiModelsConfig()", () => {
  const originalLocalAiModels = process.env.LOCAL_AI_MODELS;
  const originalTravelAiModels = process.env.TRAVEL_AI_MODELS;
  const originalHostedTravelAiModels = process.env.HOSTED_TRAVEL_AI_MODELS;
  const originalOllamaBaseUrl = process.env.OLLAMA_BASE_URL;

  afterEach(() => {
    if (originalLocalAiModels === undefined) {
      delete process.env.LOCAL_AI_MODELS;
    } else {
      process.env.LOCAL_AI_MODELS = originalLocalAiModels;
    }

    if (originalTravelAiModels === undefined) {
      delete process.env.TRAVEL_AI_MODELS;
    } else {
      process.env.TRAVEL_AI_MODELS = originalTravelAiModels;
    }

    if (originalHostedTravelAiModels === undefined) {
      delete process.env.HOSTED_TRAVEL_AI_MODELS;
    } else {
      process.env.HOSTED_TRAVEL_AI_MODELS = originalHostedTravelAiModels;
    }

    if (originalOllamaBaseUrl === undefined) {
      delete process.env.OLLAMA_BASE_URL;
    } else {
      process.env.OLLAMA_BASE_URL = originalOllamaBaseUrl;
    }
  });

  it("prefers LOCAL_AI_MODELS over older environment names", () => {
    process.env.LOCAL_AI_MODELS = "gemma3:27b,gemma3:12b";
    process.env.TRAVEL_AI_MODELS = "gemma3:4b";
    process.env.HOSTED_TRAVEL_AI_MODELS = "legacy-model";

    expect(getLocalTravelAiModelsConfig()).toEqual({
      models: ["gemma3:27b", "gemma3:12b"],
      source: "LOCAL_AI_MODELS",
    });
  });

  it("uses defaults when no environment override is present", () => {
    delete process.env.LOCAL_AI_MODELS;
    delete process.env.TRAVEL_AI_MODELS;
    delete process.env.HOSTED_TRAVEL_AI_MODELS;

    expect(getLocalTravelAiModels()).toEqual([...DEFAULT_LOCAL_TRAVEL_AI_MODELS]);
  });

  it("uses localhost Ollama by default and trims trailing slashes", () => {
    delete process.env.OLLAMA_BASE_URL;
    expect(getOllamaBaseUrl()).toBe("http://127.0.0.1:11434");

    process.env.OLLAMA_BASE_URL = "http://localhost:11434/";
    expect(getOllamaBaseUrl()).toBe("http://localhost:11434");
  });
});
