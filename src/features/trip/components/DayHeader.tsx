import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { MagazineCard } from "@/components/ui/MagazineCard";
import DayEditModal from "@/features/trip/components/client/DayEditModal";
import { maskSecretText } from "@/features/trip/utils/tripUtils";
import { cn } from "@/lib/utils";

interface DayHeaderProps {
  dayId: string;
  slug: string;
  dayNumber: number;
  dateLabel: string;
  title?: string;
  highlight?: string;
  isCompleted?: boolean;
  totalEvents: number;
  prevDay?: number;
  nextDay?: number;
  isAdmin?: boolean;
}

export function DayHeader({
  dayId,
  slug,
  dayNumber,
  dateLabel,
  title,
  highlight,
  isCompleted,
  totalEvents,
  prevDay,
  nextDay,
  isAdmin,
}: DayHeaderProps) {
  return (
    <div className="relative pt-8 pb-12">
      <Container>
        <div className="mb-8 flex items-center justify-between">
          <Link
            href={`/trip/${slug}`}
            className="text-muted-foreground hover:text-primary inline-flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase transition-colors"
          >
            <ChevronLeft size={14} />
            Back to Overview
          </Link>

          <div className="flex gap-2">
            {isAdmin && (
              <DayEditModal dayId={dayId} initialTitle={title} initialHighlight={highlight} isAdmin={isAdmin} />
            )}
            {prevDay && (
              <Link
                href={`/trip/${slug}/day/${prevDay}`}
                className="border-border bg-background text-muted-foreground hover:text-primary hover:border-primary/30 flex h-10 w-10 items-center justify-center rounded-full border transition-all"
              >
                <ChevronLeft size={18} />
              </Link>
            )}
            {nextDay && (
              <Link
                href={`/trip/${slug}/day/${nextDay}`}
                className="border-border bg-background text-muted-foreground hover:text-primary hover:border-primary/30 flex h-10 w-10 items-center justify-center rounded-full border transition-all"
              >
                <ChevronRight size={18} />
              </Link>
            )}
          </div>
        </div>

        <MagazineCard padding="lg" className="border-primary/10 shadow-primary/5 relative overflow-hidden shadow-2xl">
          {/* Accent decoration */}
          <div className="bg-primary/5 absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px]" />

          <div className="relative z-10">
            <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "rounded-full border px-4 py-1 text-[10px] font-black tracking-[0.3em] uppercase",
                      isCompleted
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
                        : "bg-primary/10 text-primary border-primary/20",
                    )}
                  >
                    Day {dayNumber} {isCompleted && "— Completed"}
                  </div>
                  <div className="bg-border h-px w-8" />
                  <div className="text-muted-foreground flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
                    <Calendar size={12} className="text-primary" />
                    {dateLabel}
                  </div>
                </div>

                <h1 className="font-playfair text-foreground text-4xl leading-tight font-black tracking-tight md:text-6xl">
                  {maskSecretText(title, !!isAdmin) || `Chapter ${dayNumber}`}
                </h1>

                {highlight && (
                  <p className="text-muted-foreground border-primary/20 max-w-2xl border-l-2 py-1 pl-6 text-lg leading-relaxed font-medium italic md:text-xl">
                    &ldquo;{maskSecretText(highlight, !!isAdmin)}&rdquo;
                  </p>
                )}
              </div>

              <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
                <div className="bg-secondary/50 border-border flex items-center gap-6 rounded-2xl border px-6 py-4">
                  <div className="text-center">
                    <div className="text-muted-foreground mb-1 text-[10px] font-black tracking-widest uppercase">
                      Moments
                    </div>
                    <div className="text-foreground text-xl font-black">{totalEvents}</div>
                  </div>
                  <div className="bg-border h-8 w-px" />
                  <div className="text-center">
                    <div className="text-muted-foreground mb-1 text-[10px] font-black tracking-widest uppercase">
                      Status
                    </div>
                    <div className={cn("text-xs font-bold", isCompleted ? "text-emerald-600" : "text-primary")}>
                      {isCompleted ? "Finished" : "Active"}
                    </div>
                  </div>
                </div>

                <Link
                  href={`/trip/${slug}/day/${dayNumber}/summary`}
                  className="bg-foreground text-background flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-xs font-black tracking-widest uppercase shadow-lg transition-all hover:opacity-90 active:scale-95"
                >
                  Summary
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </MagazineCard>
      </Container>
    </div>
  );
}
