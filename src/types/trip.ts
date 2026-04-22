export type EventType =
  | "food"
  | "transport"
  | "sightseeing"
  | "hotel"
  | "shopping"
  | "surprise"
  | "basic";

export type TagType =
  | "food"
  | "transport"
  | "sightseeing"
  | "hotel"
  | "shopping"
  | "surprise"
  | "night";

export interface YataiStop {
  time: string;
  stop: string;
  desc: string;
}

export interface TripEvent {
  time: string;
  type: EventType;
  title?: string;
  desc?: string;
  tag?: TagType;
  tagLabel?: string;
  access?: string[];
  // Food card
  foodName?: string;
  foodDesc?: string;
  highlight?: string;
  // Yatai card
  isYatai?: boolean;
  yataiStops?: YataiStop[];
  // New features
  photos?: string[];
  locationUrl?: string;
  budget?: number;
}

export interface Tip {
  title: string;
  body: string;
  isWarning?: boolean;
}
