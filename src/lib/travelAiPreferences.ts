export const PREFERRED_GOOGLE_TRAVEL_AI_CANDIDATES = [
  "gemini-3.1-flash-lite",
  "gemini-3.1-flash-lite-preview",
  "gemini-3-flash-preview",
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
] as const;

export const PREFERRED_LOCAL_TRAVEL_AI_CANDIDATES = ["gemma-4-26b-a4b-it", "gemma-4-31b-it", "gemma-3-27b-it"] as const;

export const PREFERRED_TRAVEL_AI_CANDIDATES = [
  ...PREFERRED_GOOGLE_TRAVEL_AI_CANDIDATES,
  ...PREFERRED_LOCAL_TRAVEL_AI_CANDIDATES,
] as const;
