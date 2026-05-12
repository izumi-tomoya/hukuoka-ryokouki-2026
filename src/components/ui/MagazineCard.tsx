import { cn } from "@/lib/utils";

interface Props {
  children?: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-4 md:p-8",
  lg: "p-8 md:p-12",
};

export function MagazineCard({ children, className, padding = "md" }: Props) {
  return (
    <div
      className={cn(
        "bg-card text-card-foreground border-border md:rounded-article hover:shadow-primary/5 dark:hover:shadow-primary/10 rounded-3xl border shadow-sm transition-all duration-300 hover:shadow-xl",
        paddingMap[padding],
        className,
      )}
    >
      {children}
    </div>
  );
}
