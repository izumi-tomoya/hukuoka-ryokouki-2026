import { compactAdvisorAnswer } from "@/lib/advisorResponse";

describe("compactAdvisorAnswer()", () => {
  it("keeps a short answer intact apart from surrounding whitespace", () => {
    expect(compactAdvisorAnswer("  まずはホテルで10分休んでから出発しましょう。  ")).toBe(
      "まずはホテルで10分休んでから出発しましょう。",
    );
  });

  it("limits answers to the requested number of sentences", () => {
    const answer = [
      "まずは雨を避けて屋内寄りにしましょう。",
      "大濠公園は滞在を短くし、移動前にカフェを挟むと楽です。",
      "予約済みの夕食は動かさず、17時台にホテルを出るのが安全です。",
      "余裕があれば周辺散策を足してください。",
    ].join("");

    expect(compactAdvisorAnswer(answer, { maxSentences: 2 })).toBe(
      "まずは雨を避けて屋内寄りにしましょう。\n大濠公園は滞在を短くし、移動前にカフェを挟むと楽です。",
    );
  });

  it("limits answers by characters even if the model ignores sentence limits", () => {
    const answer =
      "太宰府参道では移動時間と混雑を見込み、予約済みの予定を守るために早めに切り上げるのが安全です。".repeat(4);
    const compacted = compactAdvisorAnswer(answer, { maxCharacters: 80 });

    expect(Array.from(compacted).length).toBeLessThanOrEqual(80);
    expect(compacted.endsWith("。")).toBe(true);
  });
});
