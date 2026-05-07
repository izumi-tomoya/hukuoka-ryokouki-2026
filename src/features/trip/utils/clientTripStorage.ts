"use client";

export type ExpensePayer = "shared" | "you" | "partner";

export type TemperatureMood = "joy" | "calm" | "tired" | "surprised" | "again";

export interface TemperatureLogEntry {
  id: string;
  eventId: string;
  eventTitle: string;
  eventTime: string;
  dayNumber?: number;
  mood: TemperatureMood;
  energy: number;
  revisit: boolean;
  note?: string;
  createdAt: string;
}

export const TEMPERATURE_MOODS: Record<
  TemperatureMood,
  { emoji: string; label: string; accent: string }
> = {
  joy: { emoji: "✦", label: "楽しい", accent: "text-rose-500" },
  calm: { emoji: "◌", label: "落ち着く", accent: "text-sky-500" },
  tired: { emoji: "⋯", label: "疲れた", accent: "text-amber-500" },
  surprised: { emoji: "!", label: "ときめき", accent: "text-fuchsia-500" },
  again: { emoji: "↺", label: "また来たい", accent: "text-emerald-500" },
};

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getTripStorageKeys(tripId: string) {
  return {
    expensePayers: `memoir:expense-payers:${tripId}`,
    temperatureLogs: `memoir:temperature-logs:${tripId}`,
  };
}

export function loadExpensePayers(tripId: string) {
  return readJson<Record<string, ExpensePayer>>(getTripStorageKeys(tripId).expensePayers, {});
}

export function saveExpensePayers(tripId: string, payers: Record<string, ExpensePayer>) {
  writeJson(getTripStorageKeys(tripId).expensePayers, payers);
}

export function loadTemperatureLogs(tripId: string) {
  return readJson<TemperatureLogEntry[]>(getTripStorageKeys(tripId).temperatureLogs, []);
}

export function saveTemperatureLogs(tripId: string, logs: TemperatureLogEntry[]) {
  writeJson(getTripStorageKeys(tripId).temperatureLogs, logs);
}

export function appendTemperatureLog(tripId: string, log: Omit<TemperatureLogEntry, "id" | "createdAt">) {
  const next = [
    {
      ...log,
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}`,
      createdAt: new Date().toISOString(),
    },
    ...loadTemperatureLogs(tripId),
  ].slice(0, 60);

  saveTemperatureLogs(tripId, next);
  return next;
}
