"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Clock, Lock, MapPin, Navigation, Sparkles, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { TripEvent } from "../types/trip";
import { isSecretEvent } from "../utils/tripUtils";

type SpotDetailViewProps = {
  event: TripEvent;
  slug: string;
  isAdmin?: boolean;
};

export default function SpotDetailView({ event, slug, isAdmin = false }: SpotDetailViewProps) {
  const isSurprise = isSecretEvent(event, isAdmin);
  const [isRevealed, setIsRevealed] = useState(isAdmin);

  const displayTitle = isRevealed ? event.foodName || event.title : "✨ Surprise Spot";
  const displayDesc = isRevealed
    ? event.foodDesc || event.desc
    : "当日までのお楽しみ。ふたりの特別な時間が待っています。";

  // Google Maps Iframe URL
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const locationName = event.foodName || event.title || "";
  const mapSearchUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(locationName)}`;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header Image / Background */}
      <div className="relative h-72 w-full overflow-hidden bg-slate-900">
        <motion.div
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/60"
        />

        <div className="absolute inset-0 flex items-end p-8">
          <div className="mx-auto w-full max-w-md">
            <Link
              href={`/trip/${slug}`}
              className="group mb-6 inline-flex items-center text-white/70 transition-colors hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span className="text-sm font-bold tracking-widest uppercase">Back</span>
            </Link>

            <AnimatePresence mode="wait">
              <motion.h1
                key={displayTitle}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="font-playfair text-4xl leading-tight font-black tracking-tight text-white"
              >
                {displayTitle}
              </motion.h1>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto -mt-10 max-w-md px-6">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="rounded-[2.5rem] border border-white bg-white/80 p-8 shadow-2xl shadow-slate-200/50 backdrop-blur-2xl"
        >
          {/* Metadata Grid */}
          <div className="mb-10 grid grid-cols-2 gap-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="rounded-3xl border border-slate-100 bg-slate-50 p-5"
            >
              <div className="mb-2 flex items-center text-slate-400">
                <Clock className="mr-2 h-4 w-4" />
                <span className="text-[10px] font-black tracking-[0.2em] uppercase">Time</span>
              </div>
              <p className="font-mono text-xl font-black text-slate-800">{event.time}</p>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="rounded-3xl border border-slate-100 bg-slate-50 p-5"
            >
              <div className="mb-2 flex items-center text-slate-400">
                <MapPin className="mr-2 h-4 w-4" />
                <span className="text-[10px] font-black tracking-[0.2em] uppercase">Type</span>
              </div>
              <p className="text-sm font-black tracking-widest text-slate-800 uppercase">
                {event.tagLabel || event.type}
              </p>
            </motion.div>
          </div>

          {/* Surprise Reveal Section */}
          {!isRevealed && isSurprise && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsRevealed(true)}
              className="mb-10 flex w-full flex-col items-center justify-center gap-4 rounded-[2rem] bg-linear-to-br from-slate-900 to-slate-800 p-10 text-white shadow-xl shadow-slate-200"
            >
              <div className="relative">
                <Lock className="h-10 w-10 text-amber-400" />
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.2, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 bg-amber-400 blur-xl"
                />
              </div>
              <div className="text-center">
                <p className="text-lg font-black tracking-tight">情報を解禁する</p>
                <p className="mt-1 text-xs font-medium text-slate-400">タップして中身を確認</p>
              </div>
              <Sparkles className="h-5 w-5 animate-pulse text-amber-400" />
            </motion.button>
          )}

          {/* Description */}
          <section className="mb-10 space-y-4">
            <h2 className="text-[10px] font-black tracking-[0.3em] text-slate-300 uppercase">Description</h2>
            <AnimatePresence mode="wait">
              <motion.p
                key={displayDesc || "empty"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg leading-relaxed font-medium text-slate-600"
              >
                {displayDesc}
              </motion.p>
            </AnimatePresence>

            {isRevealed && event.highlight && (
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="relative overflow-hidden rounded-3xl border border-amber-100/50 bg-amber-50/50 p-6"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Star className="h-12 w-12 fill-current text-amber-500" />
                </div>
                <div className="mb-3 flex items-center text-amber-600">
                  <Star className="mr-2 h-4 w-4 fill-current" />
                  <span className="text-[10px] font-black tracking-widest uppercase">Highlight</span>
                </div>
                <p className="text-sm leading-relaxed font-bold text-amber-900/80 italic">
                  &ldquo;{event.highlight}&rdquo;
                </p>
              </motion.div>
            )}
          </section>

          {/* Map Preview (If revealed) */}
          {isRevealed && event.locationUrl && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 space-y-4">
              <h2 className="text-[10px] font-black tracking-[0.3em] text-slate-300 uppercase">Location Map</h2>
              <div className="aspect-video w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
                <iframe
                  title="Location Map"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={mapSearchUrl}
                />
              </div>
            </motion.section>
          )}

          {/* Actions */}
          <section className="space-y-4">
            {isRevealed && event.locationUrl && (
              <a
                href={event.locationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-3 rounded-3xl bg-slate-900 py-5 text-sm font-black tracking-widest text-white uppercase shadow-xl shadow-slate-200 transition-all hover:bg-slate-800 active:scale-95"
              >
                <Navigation className="h-4 w-4" />
                Open in Google Maps
              </a>
            )}
          </section>
        </motion.div>

        {/* Transit Steps */}
        {isRevealed && event.transitSteps && event.transitSteps.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 px-2"
          >
            <h2 className="mb-8 text-[10px] font-black tracking-[0.4em] text-slate-400 uppercase">Route Details</h2>
            <div className="relative space-y-8">
              <div className="absolute top-2 bottom-2 left-[5.5px] w-px bg-slate-200" />
              {event.transitSteps.map((step) => (
                <div key={`${step.time}-${step.station}`} className="relative flex gap-6">
                  <div className="relative z-10 mt-1.5 h-3 w-3 rounded-full bg-slate-900 ring-4 ring-white" />
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <Clock className="h-3 w-3 text-slate-300" />
                      <span className="font-mono text-xs font-bold text-slate-400">{step.time}</span>
                    </div>
                    <p className="text-lg font-black text-slate-800">{step.station}</p>
                    {step.lineName && <p className="mt-1 text-sm font-bold text-slate-500">{step.lineName}</p>}
                    {step.desc && <p className="mt-2 text-sm leading-relaxed text-slate-400 italic">{step.desc}</p>}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
