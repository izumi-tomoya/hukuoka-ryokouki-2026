"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Box, CheckCircle2, Circle, type LucideIcon, ShieldCheck, Shirt, Smartphone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

type ChecklistItem = {
  name: string;
  category: string;
};

type ChecklistTypeViewProps = {
  type: string;
  items: ChecklistItem[];
  slug: string;
};

const categoryIcons: Record<string, LucideIcon> = {
  essential: ShieldCheck,
  clothing: Shirt,
  gadget: Smartphone,
  other: Box,
};

export default function ChecklistTypeView({ type, items, slug }: ChecklistTypeViewProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const Icon = categoryIcons[type.toLowerCase()] || Box;

  const toggleItem = (name: string) => {
    setCheckedItems((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-8 shadow-xs">
        <Link
          href={`/trip/${slug}`}
          className="mb-6 inline-flex items-center text-slate-400 transition-colors hover:text-slate-600"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          <span className="text-sm font-medium">しおりに戻る</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-200">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 capitalize">{type}</h1>
            <p className="text-sm font-medium text-slate-400">
              {Object.values(checkedItems).filter(Boolean).length} / {items.length} 完了
            </p>
          </div>
        </div>
      </div>

      {/* Checklist List */}
      <div className="container mx-auto max-w-md space-y-3 px-6 pt-8">
        {items.map((item, idx) => {
          const isChecked = checkedItems[item.name];
          return (
            <motion.button
              key={item.name}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => toggleItem(item.name)}
              className={cn(
                "flex w-full items-center gap-4 rounded-2xl p-4 transition-all active:scale-98",
                isChecked ? "bg-slate-100 opacity-60" : "bg-white shadow-sm hover:shadow-md",
              )}
            >
              {isChecked ? (
                <CheckCircle2 className="h-6 w-6 text-slate-900" />
              ) : (
                <Circle className="h-6 w-6 text-slate-200" />
              )}
              <span
                className={cn(
                  "text-left font-bold transition-all",
                  isChecked ? "text-slate-400 line-through" : "text-slate-700",
                )}
              >
                {item.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
