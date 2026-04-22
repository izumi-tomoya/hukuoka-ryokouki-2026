import { create } from "zustand";
import type { TripEvent } from "@/types/trip";

interface ModalState {
  isOpen: boolean;
  selectedEvent: TripEvent | null;
  openModal: (event: TripEvent) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  selectedEvent: null,
  openModal: (event) => set({ isOpen: true, selectedEvent: event }),
  closeModal: () => set({ isOpen: false, selectedEvent: null }),
}));
