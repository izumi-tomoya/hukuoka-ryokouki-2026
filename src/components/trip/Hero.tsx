import SecretToggle from "@/components/trip/client/SecretToggle";
import { TripCountdown } from "@/features/trip/components/client/TripCountdown";
import { cookies } from "next/headers";
import { SECRET_MODE_COOKIE_NAME } from "@/config/constants";

interface HeroProps {
  title: string;
  startDate: Date;
  endDate: Date;
  accentColor?: string;
}

export default async function Hero({ title, startDate, endDate }: HeroProps) {
  const cookieStore = await cookies();
  const isSecretMode = cookieStore.get(SECRET_MODE_COOKIE_NAME)?.value === "true";

  const formatDate = (date: Date) => ({
    date: `${date.getMonth() + 1}.${date.getDate()}`,
    day: date.toLocaleDateString('ja-JP', { weekday: 'short' })
  });

  const startInfo = formatDate(new Date(startDate));
  const endInfo = formatDate(new Date(endDate));

  return (
    <header className="relative overflow-hidden py-16 bg-background">
      {/* 柔らかいパステル背景の装飾 */}
      <div className="absolute top-0 right-0 h-100 w-100 rounded-full bg-primary/20 blur-[120px] -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 h-75 w-75 rounded-full bg-secondary/30 blur-[100px] translate-y-1/3 -translate-x-1/4" />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <SecretToggle isSecretMode={isSecretMode} />

        <div className="mt-8 mb-6 animate-fade-up">
          <span className="text-primary font-medium tracking-[0.2em] uppercase text-sm">
            {startDate.getFullYear()} Trip
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mt-2 tracking-tight">
            {title}
          </h1>
        </div>

        <div className="flex gap-6 mb-8 text-foreground/80 font-medium">
          <p>{startInfo.date} ({startInfo.day}) - {endInfo.date} ({endInfo.day})</p>
        </div>

        <div className="animate-fade-up delay-200">
          <TripCountdown startDate={startDate.toISOString()} />
        </div>
      </div>
    </header>
  );
}

