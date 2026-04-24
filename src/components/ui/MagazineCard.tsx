import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-8",
  lg: "p-12",
};

export function MagazineCard({ children, className, padding = "md" }: Props) {
  return (
    <div
      className={cn(
        "bg-white border border-stone-100 shadow-sm rounded-article transition-all hover:shadow-md",
        paddingMap[padding],
        className
      )}
    >
      {children}
    </div>
  );
}
