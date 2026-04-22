import SecretToggle from "@/components/trip/client/SecretToggle";
import { cookies } from "next/headers";
import { SECRET_MODE_COOKIE_NAME } from "@/config/constants";

interface HeroProps {
  title: string;
  startDate: Date;
  endDate: Date;
  accentColor?: string;
}

export default async function Hero({ title, startDate, endDate, accentColor = "#D4607A" }: HeroProps) {
  const cookieStore = await cookies();
  const isSecretMode = cookieStore.get(SECRET_MODE_COOKIE_NAME)?.value === "true";

  const formatDate = (date: Date) => ({
    date: `${date.getMonth() + 1}.${date.getDate()}`,
    day: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
  });

  const startInfo = formatDate(new Date(startDate));
  const endInfo = formatDate(new Date(endDate));

  const titleText = title || "Journey Memoir";
  const titleParts = titleText.split(' ');
  const mainTitle = titleParts.length > 1 ? titleParts.slice(0, -1).join(' ') : "Our";
  const subTitle = titleParts.length > 1 ? titleParts[titleParts.length - 1] : titleParts[0];

  return (
    <header className="relative overflow-hidden" style={{ background: "linear-gradient(160deg, #FFF5F7 0%, #FFE0EE 45%, #F5E0FF 100%)" }}>
      {/* Soft mesh orbs */}
      <div className="absolute -top-24 left-1/4 h-80 w-80 rounded-full bg-rose-300/30 blur-[80px] animate-pulse" />
      <div
        className="absolute -bottom-16 -right-16 h-72 w-72 rounded-full blur-[80px] animate-pulse opacity-40"
        style={{ background: accentColor + "55", animationDelay: "700ms" }}
      />
      <div className="absolute top-1/2 left-0 h-60 w-60 rounded-full bg-purple-200/20 blur-[60px]" />

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23C04870'/%3E%3C/svg%3E")`,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Large watermark */}
      <div
        className="absolute bottom-6 right-0 pointer-events-none select-none overflow-hidden leading-none"
        aria-hidden="true"
      >
        <span
          className="font-playfair font-black italic"
          style={{ fontSize: "230px", lineHeight: 1, color: accentColor + "12" }}
        >
          {subTitle.charAt(0)}
        </span>
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 pb-28 pt-12 text-center">
        <SecretToggle isSecretMode={isSecretMode} />

        {/* Icon badge */}
        <div className="mt-5 mb-7 animate-fade-up">
          <div
            className="mx-auto flex h-14.5 w-14.5 items-center justify-center rounded-4.5 border border-rose-200/60 backdrop-blur-sm shadow-xl shadow-rose-200/30"
            style={{ background: "rgba(255, 255, 255, 0.70)" }}
          >
            <span className="text-[28px] leading-none" role="img" aria-label="Trip Icon">
              ✨
            </span>
          </div>
        </div>

        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-5 animate-fade-up delay-100">
          <div className="h-px w-8 bg-linear-to-r from-transparent to-rose-300/60" />
          <span className="text-[9px] font-black tracking-[5px] text-rose-400/60 uppercase">
            {startDate.getFullYear()} · Journey Memoir
          </span>
          <div className="h-px w-8 bg-linear-to-l from-transparent to-rose-300/60" />
        </div>

        {/* Main title */}
        <div className="animate-fade-up delay-200">
          <h1 className="font-playfair text-[32px] md:text-[40px] font-bold leading-none tracking-tight drop-shadow-sm mb-1" style={{ color: "#2C1520" }}>
            {mainTitle}
          </h1>
          <h1
            className="font-playfair text-[50px] md:text-[60px] font-bold italic leading-[1.05] drop-shadow-sm"
            style={{ color: accentColor }}
          >
            {subTitle}
          </h1>
        </div>

        {/* Ornament divider */}
        <div className="my-6 flex items-center gap-2.5 animate-fade-up delay-300">
          <div className="h-px w-6 bg-rose-300/50" />
          <div className="h-0.75 w-0.75 rounded-full bg-rose-400/60" />
          <div className="h-px w-3 bg-rose-200/40" />
          <div className="h-1.25 w-1.25 rounded-full bg-rose-400/70" />
          <div className="h-px w-3 bg-rose-200/40" />
          <div className="h-0.75 w-0.75 rounded-full bg-rose-400/60" />
          <div className="h-px w-6 bg-rose-300/50" />
        </div>

        {/* Date chips */}
        <div className="flex gap-4 animate-fade-up delay-400">
          {[
            { label: "START", info: startInfo },
            { label: "END", info: endInfo },
          ].map((d) => (
            <div
              key={d.label}
              className="group relative overflow-hidden rounded-[24px] border border-rose-200/50 px-6 py-4 transition-all shadow-sm"
              style={{ background: "rgba(255, 255, 255, 0.75)", backdropFilter: "blur(12px)" }}
            >
              <p className="text-[7px] font-black tracking-[4px] text-rose-400/60 uppercase mb-1.5">
                {d.label}
              </p>
              <div className="flex items-baseline gap-1">
                <p className="text-[20px] font-bold tracking-tighter leading-none" style={{ color: "#2C1520" }}>{d.info.date}</p>
                <p className="text-[9px] font-bold text-rose-400/50 uppercase tracking-widest">{d.info.day}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom wave — blends into white content below */}
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
