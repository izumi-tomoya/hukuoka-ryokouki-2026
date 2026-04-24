import TipsSection from "@/components/trip/TipsSection";
import { Tip } from "@/features/trip/types/tip";

interface Props {
  tips: Tip[];
  dayNumber: number;
  isAdmin: boolean;
}

export function CommonTipsSection({ tips, dayNumber, isAdmin }: Props) {
  if (!isAdmin) return null;
  return <TipsSection tips={tips} dayNumber={dayNumber} />;
}
