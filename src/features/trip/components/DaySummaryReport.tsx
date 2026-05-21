"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Camera, Coffee, Flag, Info, MapPin } from "lucide-react";
import Link from "next/link";
import type { Tip, TripEvent } from "../types/trip";

type DaySummaryReportProps = {
  dayId: string;
  events: TripEvent[];
  tips: Tip[];
  slug: string;
};

export default function DaySummaryReport({ dayId, events, tips, slug }: DaySummaryReportProps) {
  const foodEvents = events.filter((e) => e.type === "food");
  const transportEvents = events.filter((e) => e.type === "transport");

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-slate-900 px-6 pt-16 pb-12 text-white">
        <motion.div
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
          }}
        />
        <Link
          href={`/trip/${slug}`}
          className="relative mb-6 inline-flex items-center text-white/60 transition-colors hover:text-white"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          <span className="text-sm font-medium">しおりに戻る</span>
        </Link>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative">
          <h1 className="text-4xl font-bold tracking-tight">Day {dayId} Summary</h1>
          <p className="mt-2 text-slate-400">本日の旅程とハイライトのまとめ</p>
        </motion.div>
      </div>

      <div className="container mx-auto -mt-8 max-w-md space-y-6 px-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {[
            { label: "Events", value: events.length, icon: Flag, color: "text-indigo-500", bg: "bg-indigo-50" },
            { label: "Gourmet", value: foodEvents.length, icon: Coffee, color: "text-rose-500", bg: "bg-rose-50" },
            { label: "Transit", value: transportEvents.length, icon: MapPin, color: "text-sky-500", bg: "bg-sky-50" },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 * idx }}
              className="rounded-3xl border border-white/40 bg-white/80 p-3 text-center shadow-2xl shadow-slate-200/50 backdrop-blur-sm sm:p-5"
            >
              <div
                className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-xl sm:h-10 sm:w-10 ${stat.bg}`}
              >
                <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
              </div>
              <p className={`text-xl font-black sm:text-2xl ${stat.color}`}>{stat.value}</p>
              <p className="text-[9px] font-black tracking-widest text-slate-400 uppercase sm:text-[10px]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Timeline Summary */}
        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center text-sm font-bold tracking-widest text-slate-400 uppercase">
            <Camera className="mr-2 h-4 w-4" />
            Today's Timeline
          </h2>
          <div className="space-y-4">
            {events.map((event) => (
              <div key={`${event.time}-${event.title}`} className="flex gap-4">
                <span className="pt-1 font-mono text-xs font-bold text-slate-300">{event.time}</span>
                <p className="text-sm font-bold text-slate-700">{event.title}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Important Tips */}
        {tips.length > 0 && (
          <section className="rounded-3xl bg-slate-900 p-6 text-white shadow-xl">
            <h2 className="mb-4 flex items-center text-sm font-bold tracking-widest text-white/40 uppercase">
              <Info className="mr-2 h-4 w-4" />
              Important Tips
            </h2>
            <div className="space-y-4">
              {tips.map((tip, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: tips have no stable unique id
                <div key={tip.id || `${tip.title}-${i}`} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h3 className="mb-1 text-sm font-bold text-white">{tip.title}</h3>
                  <p className="text-xs leading-relaxed text-white/60">{tip.body}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
