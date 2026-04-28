import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
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
        "bg-card text-card-foreground border border-border shadow-sm rounded-3xl md:rounded-article transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 dark:hover:shadow-primary/10",
        paddingMap[padding],
        className
      )}
    >
      {children}
    </div>
  );
}
