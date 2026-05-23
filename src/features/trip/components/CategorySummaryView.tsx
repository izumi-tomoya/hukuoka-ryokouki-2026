"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Camera,
  ChevronRight,
  Hotel,
  type LucideIcon,
  Map as MapIcon,
  Plane,
  Sparkles,
  Utensils,
} from "lucide-react";
import Link from "next/link";
import { useModalStore } from "@/lib/store/useModalStore";
import { cn } from "@/lib/utils";
import type { TripEvent } from "../types/trip";

type CategorySummaryViewProps = {
  category: string;
  events: TripEvent[];
  slug: string;
};

const categoryTheme: Record<string, { icon: LucideIcon; color: string; bg: string; border: string }> = {
  food: { icon: Utensils, color: "text-rose-500", bg: "bg-rose-50", border: "border-rose-100" },
  transport: { icon: Plane, color: "text-zinc-500", bg: "bg-zinc-50", border: "border-zinc-100" },
  sightseeing: { icon: Camera, color: "text-sky-500", bg: "bg-sky-50", border: "border-sky-100" },
  hotel: { icon: Hotel, color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-100" },
  basic: { icon: MapIcon, color: "text-slate-500", bg: "bg-slate-50", border: "border-slate-100" },
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
} as const;

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
} as const;

export default function CategorySummaryView({ category, events, slug }: CategorySummaryViewProps) {
  const theme = categoryTheme[category.toLowerCase()] || categoryTheme.basic;
  const Icon = theme.icon;
  const openModal = useModalStore((s) => s.openModal);

  return (
    <div className="bg-slate-50/50 dark:bg-background min-h-screen pb-32">
      {/* Premium Header */}
      <div className="relative overflow-hidden border-b border-slate-100 bg-white px-8 pt-20 pb-12 shadow-sm dark:border-border dark:bg-card">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.05, scale: 1 }}
          className="pointer-events-none absolute -top-5 -right-5"
        >
          <Icon size={240} />
        </motion.div>

        <div className="relative z-10">
          <Link
            href={`/trip/${slug}`}
            className="group mb-8 inline-flex items-center text-slate-400 transition-all hover:text-slate-900 dark:text-muted-foreground dark:hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-[10px] font-black tracking-[0.3em] uppercase">Back to Trip</span>
          </Link>

          <div className="flex items-end justify-between">
            <div>
              <h1 className="font-playfair text-5xl font-black tracking-tight text-slate-900 capitalize dark:text-foreground">{category}</h1>
              <div className="mt-4 flex items-center gap-2">
                <div className={cn("h-1 w-12 rounded-full", theme.color.replace("text-", "bg-"))} />
                <p className="text-xs font-bold tracking-widest text-slate-400 uppercase dark:text-muted-foreground">
                  {events.length} Selected Spots
                </p>
              </div>
            </div>
            <div
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-[2rem] shadow-xl",
                theme.bg,
                theme.color,
                "dark:bg-secondary dark:text-foreground",
              )}
            >
              <Icon size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Modern List Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="container mx-auto max-w-md space-y-4 px-6 pt-12"
      >
        <AnimatePresence mode="popLayout">
          {events.length === 0 ? (
            <motion.div variants={item} className="py-32 text-center">
              <Sparkles className="mx-auto mb-4 h-12 w-12 text-slate-200 dark:text-muted" />
              <p className="text-sm font-bold tracking-widest text-slate-300 uppercase dark:text-muted-foreground">
                No spots found in this category
              </p>
            </motion.div>
          ) : (
            events.map((event) => (
              <motion.div key={`${event.time}-${event.title}`} variants={item} layout>
                <motion.div
                  role="button"
                  tabIndex={0}
                  onClick={() => openModal(event)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openModal(event);
                    }
                  }}
                  className="group relative flex cursor-pointer flex-col gap-4 rounded-[2.5rem] border border-transparent bg-white p-6 shadow-sm transition-all hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 active:scale-98 dark:bg-card dark:hover:border-border dark:hover:shadow-none"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-2xl font-mono text-lg font-black transition-colors",
                          theme.bg,
                          theme.color,
                          "group-hover:bg-slate-900 group-hover:text-white dark:bg-secondary dark:text-foreground dark:group-hover:bg-primary dark:group-hover:text-primary-foreground",
                        )}
                      >
                        {event.time.split(":")[0]}
                      </div>
                      <div>
                        <h3 className="group-hover:text-primary text-lg leading-tight font-bold text-slate-900 transition-colors dark:text-foreground">
                          {event.foodName || event.title}
                        </h3>
                        <p className="mt-1 text-[10px] font-black tracking-widest text-slate-400 uppercase dark:text-muted-foreground">
                          {event.tagLabel || "Adventure"}
                        </p>
                      </div>
                    </div>
                    <div className="rounded-full bg-slate-50 p-2 text-slate-300 transition-all group-hover:bg-slate-900 group-hover:text-white dark:bg-secondary dark:text-muted-foreground dark:group-hover:bg-primary dark:group-hover:text-primary-foreground">
                      <ChevronRight size={18} />
                    </div>
                  </div>

                  {event.desc && (
                    <p className="line-clamp-2 text-sm leading-relaxed font-medium text-slate-500 dark:text-muted-foreground">{event.desc}</p>
                  )}

                  {event.highlight && (
                    <div className="mt-2 flex items-center gap-2 border-t border-slate-50 pt-4 dark:border-border">
                      <Sparkles size={12} className={theme.color} />
                      <span className="text-[10px] font-bold text-slate-400 italic dark:text-muted-foreground/70">
                        &ldquo;{event.highlight}&rdquo;
                      </span>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
