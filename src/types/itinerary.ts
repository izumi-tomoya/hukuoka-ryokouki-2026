export type TransportMode =
  | "walk"
  | "train"
  | "plane"
  | "taxi"
  | "none"
  | "subway";

export interface ScheduleItem {
  time: string;
  emoji: string;
  title: string;
  description?: string;
  transport?: {
    mode: TransportMode;
    label: string;
  };
  highlight?: boolean;
  isFood?: boolean;
  isSurprise?: boolean;
}

export interface FoodSpot {
  id: string;
  emoji: string;
  name: string;
  day: 1 | 2;
  meal: "breakfast" | "lunch" | "dinner" | "snack";
  tagline: string;
  description: string;
  warning?: string;
  warningType?: "caution" | "info";
  gradient: string;
}

export interface EscortTip {
  emoji: string;
  title: string;
  content: string;
}
