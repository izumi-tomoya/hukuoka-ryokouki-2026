'use client';

import { usePackingStore } from '@/lib/store/usePackingStore';
import PackingList from './PackingList';

export default function PackingSection() {
  const { items } = usePackingStore();

  // カテゴリごとにグループ化
  const categories = Array.from(new Set(items.map((item) => item.category)));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {categories.map((category) => (
        <PackingList
          key={category}
          category={category}
          items={items.filter((item) => item.category === category)}
        />
      ))}
    </div>
  );
}
