import {
  ALTERNATIVES_TRIGGER_LABELS,
  buildAdvisorAiConfig,
  buildAdvisorSystemPrompt,
  buildAlternativesSystemInstruction,
  buildAlternativesUserPrompt,
} from "@/lib/aiPrompts";

describe("buildAdvisorSystemPrompt()", () => {
  it("includes trip context, tips, and output constraints", () => {
    const prompt = buildAdvisorSystemPrompt({
      tripTitle: "福岡の旅",
      location: "福岡",
      itineraryContext: "Day 1: 10:00 博多駅",
      tipsContext: "荷物: 少なめが吉",
    });

    expect(prompt).toContain("福岡の旅");
    expect(prompt).toContain("知里さんと智也さん");
    expect(prompt).toContain("カジュアル");
    expect(prompt).toContain("気の利");
    expect(prompt).toContain("Day 1: 10:00 博多駅");
    expect(prompt).toContain("荷物: 少なめが吉");
    expect(prompt).toContain("🎁 Surprise");
    expect(prompt).toContain("最大3文・350字以内");
  });

  it("fills placeholders when tips are empty", () => {
    const prompt = buildAdvisorSystemPrompt({
      tripTitle: "Test",
      location: null,
      itineraryContext: "Day 1",
      tipsContext: "",
    });

    expect(prompt).toContain("（未設定）");
    expect(prompt).toContain("【Tips・備考】\n（なし）");
  });
});

describe("buildAdvisorAiConfig()", () => {
  it("returns system prompt and python tool description", () => {
    const config = buildAdvisorAiConfig({
      tripTitle: "福岡の旅",
      location: "福岡",
      itineraryContext: "Day 1",
      tipsContext: "",
    });

    expect(config.systemPrompt).toContain("福岡の旅");
    expect(config.pythonToolDescription).toContain("Python");
  });
});

describe("buildAlternatives prompts", () => {
  it("uses Japanese trigger labels and JSON-only rules", () => {
    const system = buildAlternativesSystemInstruction();
    const user = buildAlternativesUserPrompt({
      trigger: "rain",
      location: "福岡",
      delayMinutes: 20,
      itinerary: "12:00 ランチ",
      knowledge: "Tip A",
    });

    expect(system).toContain("JSON配列のみ");
    expect(system).toContain("カジュアル");
    expect(system).toContain("[fixed]");
    expect(user).toContain(ALTERNATIVES_TRIGGER_LABELS.rain);
    expect(user).toContain("20分");
    expect(user).toContain("12:00 ランチ");
    expect(user).toContain("Tip A");
  });
});
