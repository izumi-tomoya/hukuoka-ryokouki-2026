export function ensureDate(date: Date | string): Date {
  return typeof date === 'string' ? new Date(date) : date;
}

export function formatDateRange(startDate: Date | string, endDate: Date | string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startStr = start.toLocaleDateString("ja-JP", { month: "short", day: "numeric" });
  const endStr = end.toLocaleDateString("ja-JP", { month: "short", day: "numeric" });
  
  return `${startStr} — ${endStr}`;
}

export function formatDateWithWeekday(date: Date | string): string {
  return new Date(date).toLocaleDateString("ja-JP", { 
    month: "short", 
    day: "numeric", 
    weekday: "short" 
  });
}
