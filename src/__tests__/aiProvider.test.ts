import { getPreferredAiProvider, prioritizeTravelAiModelsForFastResponse } from "@/lib/aiProvider";

describe("getPreferredAiProvider()", () => {
  const originalAiProvider = process.env.AI_PROVIDER;

  afterEach(() => {
    if (originalAiProvider === undefined) {
      delete process.env.AI_PROVIDER;
    } else {
      process.env.AI_PROVIDER = originalAiProvider;
    }
  });

  it("defaults to auto", () => {
    delete process.env.AI_PROVIDER;
    expect(getPreferredAiProvider()).toBe("auto");
  });

  it("normalizes gemini to google", () => {
    process.env.AI_PROVIDER = "gemini";
    expect(getPreferredAiProvider()).toBe("google");
  });

  it("accepts local and google", () => {
    process.env.AI_PROVIDER = "local";
    expect(getPreferredAiProvider()).toBe("local");

    process.env.AI_PROVIDER = "google";
    expect(getPreferredAiProvider()).toBe("google");
  });
});

describe("prioritizeTravelAiModelsForFastResponse()", () => {
  it("prefers flash models and smaller local models for short concierge answers", () => {
    expect(
      prioritizeTravelAiModelsForFastResponse([
        "gemini-2.5-flash-lite",
        "gemma-4-31b-it",
        "gemini-3.1-flash-lite",
        "gemma3:12b",
        "gemini-2.5-flash",
        "gemma3:4b",
      ])
    ).toEqual(["gemini-3.1-flash-lite", "gemini-2.5-flash-lite", "gemini-2.5-flash", "gemma3:4b", "gemma3:12b", "gemma-4-31b-it"]);
  });
});
