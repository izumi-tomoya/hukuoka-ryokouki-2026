import type { Tip } from "@/types/trip";

interface TipsSectionProps {
  tips: Tip[];
  dayNumber: 1 | 2;
}

export default function TipsSection({ tips, dayNumber }: TipsSectionProps) {
  return (
    <section className="px-5 py-8 bg-white">
      {/* Section header */}
      <div className="mb-5 flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-2xl text-xl shadow-lg"
          style={{ background: "linear-gradient(135deg, #F59E0B, #EA580C)" }}
        >
          🧭
        </div>
        <div>
          <p className="text-[9px] font-black tracking-[4px] text-amber-600 uppercase mb-0.5">
            Day {dayNumber} Guide
          </p>
          <p className="font-playfair text-[17px] font-bold text-stone-800">
            エスコートの秘訣
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {tips.map((tip, i) => (
          <div
            key={i}
            className="group relative overflow-hidden rounded-2xl transition-all hover:-translate-y-0.5 hover:shadow-xl"
            style={{
              background: tip.isWarning
                ? "linear-gradient(135deg, #FFF5F5 0%, #FEF0EF 100%)"
                : "linear-gradient(135deg, #F8FAFF 0%, #F3F6FF 100%)",
            }}
          >
            <div
              className={`absolute inset-0 rounded-2xl ring-1 ${
                tip.isWarning ? "ring-rose-200/80" : "ring-blue-200/60"
              }`}
            />
            <div
              className={`absolute left-0 top-0 bottom-0 w-0.5 rounded-l-2xl ${
                tip.isWarning
                  ? "bg-linear-to-b from-rose-400 to-rose-600"
                  : "bg-linear-to-b from-blue-400 to-indigo-500"
              }`}
            />

            <div className="relative flex items-start gap-3.5 p-4 pl-5">
              <span
                className={`mt-0.5 text-base shrink-0 ${
                  tip.isWarning ? "animate-pulse" : ""
                }`}
              >
                {tip.isWarning ? "⚠️" : "✨"}
              </span>
              <div>
                <h3
                  className={`mb-1 text-[13px] font-bold tracking-tight ${
                    tip.isWarning ? "text-rose-700" : "text-stone-800"
                  }`}
                >
                  {tip.title}
                </h3>
                <p className="text-[11px] leading-relaxed text-stone-500 font-medium">
                  {tip.body}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
