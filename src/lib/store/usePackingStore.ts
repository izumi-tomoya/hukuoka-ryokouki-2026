import { create } from 'zustand';

interface PackingState {
  isAdding: boolean;
  setIsAdding: (val: boolean) => void;
}

export const usePackingStore = create<PackingState>((set) => ({
  isAdding: false,
  setIsAdding: (val) => set({ isAdding: val }),
}));
