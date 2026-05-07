import {
  buildPackingRecommendations,
  computeDelayInsight,
  computeSettlement,
  type InsightEvent,
} from "@/features/trip/utils/tripInsights";

const baseEvents: InsightEvent[] = [
  {
    id: "e1",
    dayNumber: 1,
    date: "2026-05-24T00:00:00.000Z",
    time: "10:00",
    type: "sightseeing",
    title: "太宰府散策",
    isConfirmed: false,
    plannedBudget: 0,
    actualExpense: 0,
  },
  {
    id: "e2",
    dayNumber: 1,
    date: "2026-05-24T00:00:00.000Z",
    time: "11:00",
    type: "food",
    title: "神楽ランチ",
    isConfirmed: true,
    plannedBudget: 4000,
    actualExpense: 0,
  },
  {
    id: "e3",
    dayNumber: 1,
    date: "2026-05-24T00:00:00.000Z",
    time: "12:30",
    type: "transport",
    title: "移動",
    isConfirmed: false,
    plannedBudget: 0,
    actualExpense: 0,
  },
];

describe("computeDelayInsight()", () => {
  it("fixed event conflict and recovery candidates are derived", () => {
    const result = computeDelayInsight(baseEvents, 0, 45);

    expect(result.conflict?.eventId).toBe("e2");
    expect(result.conflict?.latenessMinutes).toBeGreaterThan(0);
    expect(result.recoveryPlans.length).toBeGreaterThan(0);
  });

  it("returns no conflict when delay is zero", () => {
    const result = computeDelayInsight(baseEvents, 0, 0);
    expect(result.conflict).toBeNull();
  });
});

describe("buildPackingRecommendations()", () => {
  it("suggests weather and itinerary based items", () => {
    const result = buildPackingRecommendations(
      [
        ...baseEvents,
        {
          id: "e4",
          dayNumber: 1,
          date: "2026-05-24T00:00:00.000Z",
          time: "05:40",
          type: "transport",
          title: "早朝移動",
          actualExpense: 0,
          plannedBudget: 0,
        },
        {
          id: "e5",
          dayNumber: 1,
          date: "2026-05-24T00:00:00.000Z",
          time: "15:00",
          type: "hotel",
          title: "ホテル",
          actualExpense: 0,
          plannedBudget: 0,
        },
      ],
      {
        themeStatus: "rainy",
        current: { temp: 13 },
        forecast: [{ date: "2026-05-24", tempMax: 18, tempMin: 12, text: "雨", condition: "🌧️" }],
      },
      []
    );

    expect(result.some((item) => item.name === "折りたたみ傘")).toBe(true);
    expect(result.some((item) => item.name === "モバイルバッテリー")).toBe(true);
    expect(result.some((item) => item.name === "軽食")).toBe(true);
  });
});

describe("computeSettlement()", () => {
  it("computes instruction from payer map", () => {
    const result = computeSettlement(
      [
        {
          id: "a",
          dayNumber: 1,
          date: "2026-05-24T00:00:00.000Z",
          time: "12:00",
          type: "food",
          title: "ランチ",
          actualExpense: 4000,
        },
        {
          id: "b",
          dayNumber: 1,
          date: "2026-05-24T00:00:00.000Z",
          time: "18:00",
          type: "food",
          title: "ディナー",
          actualExpense: 2000,
        },
      ],
      {
        a: "you",
        b: "shared",
      }
    );

    expect(result.total).toBe(6000);
    expect(result.youPaid).toBe(5000);
    expect(result.instruction).toContain("受け取る");
  });
});
