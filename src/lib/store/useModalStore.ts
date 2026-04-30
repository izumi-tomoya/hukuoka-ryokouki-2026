import { create } from "zustand";
import type { TripEvent, Tip } from "@/features/trip/types/trip";

interface ModalState {
  isOpen: boolean;
  selectedEvent: TripEvent | null;
  tripTips: Tip[];
  openModal: (event: TripEvent) => void;
  closeModal: () => void;
  updateTips: (tips: Tip[]) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  selectedEvent: null,
  tripTips: [],
  openModal: (event) => set({ isOpen: true, selectedEvent: event }),
  closeModal: () => set({ isOpen: false, selectedEvent: null }),
  updateTips: (tips) => set({ tripTips: tips }),
}));
