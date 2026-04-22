import SecretToggle from "@/components/trip/client/SecretToggle";
import { cookies } from "next/headers";
import { SECRET_MODE_COOKIE_NAME } from "@/config/constants";

export default async function Hero() {
  const cookieStore = await cookies();
  const isSecretMode = cookieStore.get(SECRET_MODE_COOKIE_NAME)?.value === "true";

  return (
    <header className="relative overflow-hidden" style={{ background: "#050B17" }}>
      {/* Layered gradient mesh */}
      <div className="absolute inset-0 bg-linear-to-br from-[#071A3D] via-[#0A2E7A] to-[#105AC4] opacity-75" />
      <div className="absolute inset-0 bg-linear-to-t from-[#050B17]/80 via-transparent to-transparent" />

      {/* Atmospheric orbs */}
      <div className="absolute -top-24 left-1/4 h-80 w-80 rounded-full bg-blue-500/25 blur-25 animate-pulse" />
      <div
        className="absolute -bottom-16 -right-16 h-72 w-72 rounded-full bg-cyan-400/20 blur-[80px] animate-pulse"
        style={{ animationDelay: "700ms" }}
      />
      <div className="absolute top-1/2 -left-20 h-56 w-56 rounded-full bg-indigo-700/15 blur-[70px]" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='44'%3E%3Crect width='44' height='44' fill='none' stroke='%23ffffff' stroke-width='0.6'/%3E%3C/svg%3E")`,
          backgroundSize: "44px 44px",
        }}
      />

      {/* Large kanji watermark */}
      <div
        className="absolute bottom-6 right-0 pointer-events-none select-none overflow-hidden leading-none"
        aria-hidden="true"
      >
        <span
          className="font-playfair font-black italic text-white/4.5"
          style={{ fontSize: "230px", lineHeight: 1 }}
        >
          福
        </span>
      </div>

      {/* Top gold rule */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-amber-400/50 to-transparent" />

      <div className="relative z-10 flex flex-col items-center px-6 pb-28 pt-12 text-center">
        <SecretToggle isSecretMode={isSecretMode} />

        {/* Icon badge */}
        <div className="mt-5 mb-7 animate-fade-up">
          <div
            className="mx-auto flex h-14.5 w-14.5 items-center justify-center rounded-4.5 border border-amber-400/20 backdrop-blur-sm shadow-xl"
            style={{ background: "rgba(10, 120, 196, 0.12)" }}
          >
            <span className="text-[28px] leading-none" role="img" aria-label="飛行機">
              ✈️
            </span>
          </div>
        </div>

        {/* Eyebrow with gold rules */}
        <div className="flex items-center gap-3 mb-5 animate-fade-up delay-100">
          <div className="h-px w-8 bg-linear-to-r from-transparent to-amber-400/55" />
          <span className="text-[9px] font-black tracking-[5px] text-amber-400/75 uppercase">
            2026 · Fukuoka Trip
          </span>
          <div className="h-px w-8 bg-linear-to-l from-transparent to-amber-400/55" />
        </div>

        {/* Main title */}
        <div className="animate-fade-up delay-200">
          <h1 className="font-playfair text-[50px] font-bold leading-none text-white tracking-tight drop-shadow-2xl">
            ふたりの
          </h1>
          <h1
            className="font-playfair text-[50px] font-bold italic leading-[1.05] drop-shadow-2xl"
            style={{ color: "#F5C842" }}
          >
            福岡
          </h1>
        </div>

        {/* Gold ornament divider */}
        <div className="my-6 flex items-center gap-2.5 animate-fade-up delay-300">
          <div className="h-px w-6 bg-amber-400/35" />
          <div className="h-0.75 w-0.75 rounded-full bg-amber-400/55" />
          <div className="h-px w-3 bg-amber-400/25" />
          <div className="h-1.25 w-1.25 rounded-full bg-amber-400/70" />
          <div className="h-px w-3 bg-amber-400/25" />
          <div className="h-0.75 w-0.75 rounded-full bg-amber-400/55" />
          <div className="h-px w-6 bg-amber-400/35" />
        </div>

        {/* Date chips */}
        <div className="flex gap-4 animate-fade-up delay-400">
          {[
            { label: "DAY 1", date: "5.24", day: "SUN" },
            { label: "DAY 2", date: "5.25", day: "MON" },
          ].map((d) => (
            <div
              key={d.label}
              className="group relative overflow-hidden rounded-[24px] border border-white/10 px-6 py-4 transition-all hover:border-amber-400/30 hover:bg-white/5 active:scale-95"
              style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(12px)" }}
            >
              <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <p className="text-[7px] font-black tracking-[4px] text-amber-400/50 uppercase mb-1.5 transition-colors group-hover:text-amber-400/80">
                {d.label}
              </p>
              <div className="flex items-baseline gap-1">
                <p className="text-[20px] font-bold text-white tracking-tighter leading-none">{d.date}</p>
                <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{d.day}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom wave — fill-white matches page bg */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg
          viewBox="0 0 400 56"
          preserveAspectRatio="none"
          className="h-14 w-full"
          aria-hidden="true"
        >
          <path
            d="M0,56 L0,26 Q60,4 120,20 Q180,36 240,14 Q300,-4 360,18 Q380,24 400,16 L400,56 Z"
            fill="#ffffff"
          />
        </svg>
      </div>
    </header>
  );
}
