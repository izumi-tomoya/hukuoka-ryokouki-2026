import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NoteState {
  notes: Record<string, string>; // eventId -> note text
  setNote: (eventId: string, text: string) => void;
  getNote: (eventId: string) => string;
}

export const useNoteStore = create<NoteState>()(
  persist(
    (set, get) => ({
      notes: {},
      setNote: (eventId, text) =>
        set((state) => ({
          notes: { ...state.notes, [eventId]: text },
        })),
      getNote: (eventId) => get().notes[eventId] || '',
    }),
    {
      name: 'trip-notes',
    }
  )
);
