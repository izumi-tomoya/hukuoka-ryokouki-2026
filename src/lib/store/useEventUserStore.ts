import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface EventUserState {
  notes: Record<string, string>; // eventId -> note text
  budgets: Record<string, number>; // eventId -> user-defined budget
  setNote: (eventId: string, text: string) => void;
  setBudget: (eventId: string, amount: number) => void;
  getNote: (eventId: string) => string;
  getBudget: (eventId: string, defaultAmount?: number) => number;
}

export const useEventUserStore = create<EventUserState>()(
  persist(
    (set, get) => ({
      notes: {},
      budgets: {},
      setNote: (eventId, text) =>
        set((state) => ({
          notes: { ...state.notes, [eventId]: text },
        })),
      setBudget: (eventId, amount) =>
        set((state) => ({
          budgets: { ...state.budgets, [eventId]: amount },
        })),
      getNote: (eventId) => get().notes[eventId] || '',
      getBudget: (eventId, defaultAmount = 0) => 
        get().budgets[eventId] !== undefined ? get().budgets[eventId] : defaultAmount,
    }),
    {
      name: 'trip-event-user-data',
    }
  )
);
