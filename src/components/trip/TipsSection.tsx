import type { Tip } from "@/features/trip/types/trip";

interface TipsSectionProps {
  tips: Tip[];
  dayNumber: number;
}

const getTheme = (dayNumber: number) => {
  const themes = {
    1: {
      bg: "bg-rose-50",
      border: "border-rose-100",
      text: "text-rose-900",
      icon: "text-rose-400"
    },
    2: {
      bg: "bg-purple-50",
      border: "border-purple-100",
      text: "text-purple-900",
      icon: "text-purple-400"
    }
  };
  return themes[dayNumber as keyof typeof themes] || {
    bg: "bg-stone-50",
    border: "border-stone-100",
    text: "text-stone-900",
    icon: "text-stone-400"
  };
};

export default function TipsSection({ tips, dayNumber }: TipsSectionProps) {
  const t = getTheme(dayNumber);
  return (
    <section className="px-5 py-8 bg-white">
      {/* Section header */}
      <div className="mb-5 flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-2xl text-xl shadow-lg shadow-rose-200/40"
          style={{ background: "linear-gradient(135deg, #D4607A, #9B3A8C)" }}
        >
          🧭
        </div>
        <div>
          <p className="text-[9px] font-black tracking-[4px] text-rose-500 uppercase mb-0.5">
            Day {dayNumber} Guide
          </p>
          <p className="font-playfair text-[17px] font-bold text-rose-900/80">
            エスコートの秘訣
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {tips.map((tip, i) => (
          <div
            key={i}
            className={`group relative overflow-hidden rounded-2xl transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-rose-100/60 ${t.bg} border ${t.border}`}
          >
            <div
              className={`absolute left-0 top-0 bottom-0 w-0.5 rounded-l-2xl ${
                tip.isWarning
                  ? "bg-linear-to-b from-red-400 to-red-500"
                  : "bg-linear-to-b from-rose-400 to-pink-500"
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
                    tip.isWarning ? "text-red-600" : "text-rose-800"
                  }`}
                >
                  {tip.title}
                </h3>
                <p className="text-[11px] leading-relaxed text-rose-700/60 font-medium">
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
