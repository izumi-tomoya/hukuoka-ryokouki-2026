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

export interface WeatherStats {
  temp: number;
  condition: string;
  uvIndex: number;
  humidity: number;
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
  id?: string;
  isConfirmed?: boolean;
  photos?: string[];
  locationUrl?: string;
  budget?: number;
  weatherStats?: WeatherStats; // 追加
  notes?: string; // 追加
}

export interface Tip {
  title: string;
  body: string;
  isWarning?: boolean;
}
