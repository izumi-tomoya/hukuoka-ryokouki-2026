import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PackingItem {
  id: string;
  name: string;
  category: string;
  checked: boolean;
}

interface PackingState {
  items: PackingItem[];
  toggleItem: (id: string) => void;
  addItem: (name: string, category: string) => void;
  removeItem: (id: string) => void;
}

export const usePackingStore = create<PackingState>()(
  persist(
    (set) => ({
      items: [
        // 必須の貴重品
        { id: 'v1', name: '航空券・予約確認メール', category: '貴重品', checked: false },
        { id: 'v2', name: '財布・クレジットカード', category: '貴重品', checked: false },
        { id: 'v3', name: '運転免許証・保険証', category: '貴重品', checked: false },
        { id: 'v4', name: '現金（屋台用）', category: '貴重品', checked: false },
        
        // 衣類・身だしなみ
        { id: 'c1', name: '着替え・下着', category: '衣類', checked: false },
        { id: 'c2', name: '歩きやすい靴', category: '衣類', checked: false },
        { id: 'c3', name: '羽織もの（夜の中洲用）', category: '衣類', checked: false },
        { id: 'c4', name: '洗面用具・メイク道具', category: '衣類', checked: false },
        
        // デジタル・ツール
        { id: 'd1', name: 'スマートフォン・充電器', category: 'デジタル', checked: false },
        { id: 'd2', name: 'モバイルバッテリー', category: 'デジタル', checked: false },
        { id: 'd3', name: 'カメラ・SDカード', category: 'デジタル', checked: false },
        
        // 福岡・博多の心得
        { id: 'f1', name: 'ICカード（はやかけん等）', category: '福岡の心得', checked: false },
        { id: 'f2', name: '胃腸薬（美食用）', category: '福岡の心得', checked: false },
        { id: 'f3', name: 'エコバッグ', category: '福岡の心得', checked: false },
      ],
      toggleItem: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item
          ),
        })),
      addItem: (name, category) =>
        set((state) => ({
          items: [
            ...state.items,
            { id: Math.random().toString(36).substring(7), name, category, checked: false },
          ],
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
    }),
    { name: 'trip-packing-list-v2' }
  )
);
