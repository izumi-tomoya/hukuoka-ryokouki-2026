import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PackingState {
  items: { id: string; name: string; checked: boolean }[];
  toggleItem: (id: string) => void;
}

export const usePackingStore = create<PackingState>()(
  persist(
    (set) => ({
      items: [
        { id: '1', name: 'パスポート/身分証', checked: false },
        { id: '2', name: '充電器/モバイルバッテリー', checked: false },
        { id: '3', name: '常備薬', checked: false },
        { id: '4', name: '着替え', checked: false },
      ],
      toggleItem: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item
          ),
        })),
    }),
    { name: 'trip-packing-list' }
  )
);
