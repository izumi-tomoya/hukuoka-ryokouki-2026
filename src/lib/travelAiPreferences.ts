export const PREFERRED_GOOGLE_TRAVEL_AI_CANDIDATES = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite-preview",
  "gemini-2.0-flash",
] as const;

export const PREFERRED_LOCAL_TRAVEL_AI_CANDIDATES = ["gemma-4-26b-a4b-it", "gemma-4-31b-it", "gemma-3-27b-it"] as const;

export const PREFERRED_TRAVEL_AI_CANDIDATES = [
  ...PREFERRED_GOOGLE_TRAVEL_AI_CANDIDATES,
  ...PREFERRED_LOCAL_TRAVEL_AI_CANDIDATES,
] as const;
