import { create } from 'zustand';

interface FilterState {
  activeCategory: string | null;
  setActiveCategory: (category: string | null) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  activeCategory: null,
  setActiveCategory: (category) => set({ activeCategory: category }),
}));
