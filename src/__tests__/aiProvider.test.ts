import { getPreferredAiProvider } from "@/lib/aiProvider";

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
