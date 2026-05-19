import { create } from "zustand";
import type { Tip, TripEvent } from "@/features/trip/types/trip";

interface ModalState {
  isOpen: boolean;
  selectedEvent: TripEvent | null;
  previousLocation: string | null;
  tripTips: Tip[];
  openModal: (event: TripEvent, previousLocation?: string | null) => void;
  closeModal: () => void;
  updateTips: (tips: Tip[]) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  selectedEvent: null,
  previousLocation: null,
  tripTips: [],
  openModal: (event, previousLocation = null) =>
    set({ isOpen: true, selectedEvent: event, previousLocation: previousLocation }),
  closeModal: () => set({ isOpen: false, selectedEvent: null, previousLocation: null }),
  updateTips: (tips) => set({ tripTips: tips }),
}));
