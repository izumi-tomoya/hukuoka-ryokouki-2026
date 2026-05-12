import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react";
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
        <div className="flex items-center justify-between mb-8">
          <Link
            href={`/trip/${slug}`}
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
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
                className="h-10 w-10 rounded-full border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
              >
                <ChevronLeft size={18} />
              </Link>
            )}
            {nextDay && (
              <Link
                href={`/trip/${slug}/day/${nextDay}`}
                className="h-10 w-10 rounded-full border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
              >
                <ChevronRight size={18} />
              </Link>
            )}
          </div>
        </div>

        <MagazineCard padding="lg" className="relative overflow-hidden border-primary/10 shadow-2xl shadow-primary/5">
          {/* Accent decoration */}
          <div className="absolute top-0 right-0 h-64 w-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border",
                      isCompleted
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : "bg-primary/10 text-primary border-primary/20",
                    )}
                  >
                    Day {dayNumber} {isCompleted && "— Completed"}
                  </div>
                  <div className="h-px w-8 bg-border" />
                  <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    <Calendar size={12} className="text-primary" />
                    {dateLabel}
                  </div>
                </div>

                <h1 className="font-playfair text-4xl md:text-6xl font-black text-foreground tracking-tight leading-tight">
                  {maskSecretText(title, !!isAdmin) || `Chapter ${dayNumber}`}
                </h1>

                {highlight && (
                  <p className="text-lg md:text-xl font-medium text-muted-foreground italic leading-relaxed max-w-2xl border-l-2 border-primary/20 pl-6 py-1">
                    &ldquo;{maskSecretText(highlight, !!isAdmin)}&rdquo;
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-6 px-6 py-4 rounded-2xl bg-secondary/50 border border-border">
                  <div className="text-center">
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                      Moments
                    </div>
                    <div className="text-xl font-black text-foreground">{totalEvents}</div>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div className="text-center">
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                      Status
                    </div>
                    <div className={cn("text-xs font-bold", isCompleted ? "text-emerald-600" : "text-primary")}>
                      {isCompleted ? "Finished" : "Active"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MagazineCard>
      </Container>
    </div>
  );
}
