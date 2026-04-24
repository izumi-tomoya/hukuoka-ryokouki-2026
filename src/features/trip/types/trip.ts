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
  id?: string;
  time: string;
  stop: string;
  desc: string;
  isVisited?: boolean;
  waitMinutes?: number;
  liveStatus?: string;
}

export interface TransitStep {
  id?: string;
  time: string;
  station: string;
  mode: 'walking' | 'subway' | 'train' | 'bus' | 'arrival';
  lineName?: string;
  duration?: string;
  fare?: string;
  platform?: string;
  exit?: string;
  isTransfer?: boolean;
}

export interface WeatherStats {
  temp: number;
  condition: string;
  uvIndex: number;
  humidity: number;
}

export interface TripEvent {
  id?: string;
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
  
  // Transit card
  transitSteps?: TransitStep[];
  
  // OGP & Photos
  photos?: string[]; // 計画段階の写真
  actualPhotos?: string[]; // 実際の写真（思い出）
  locationUrl?: string;
  
  // Budget
  plannedBudget?: number; // 予定予算
  actualExpense?: number; // 実際の出費
  budget?: number; // 互換性のため（plannedBudget 優先）
  
  // Status & Notes
  isConfirmed?: boolean;
  notes?: string;
  weatherStats?: WeatherStats;
  
  // Live features
  status?: string; // e.g., "Current", "Completed", "Next"
  actualTime?: Date;
}

export interface Tip {
  title: string;
  body: string;
  isWarning?: boolean;
  category?: string;
  deepLevel?: number;
}
