import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("bg-muted/60 dark:bg-muted/30 animate-pulse rounded-md transition-colors duration-500", className)}
      {...props}
    />
  );
}
