import TipsSection from "@/features/trip/components/TipsSection";
import type { Tip } from "@/features/trip/types/trip";

interface Props {
  tips: Tip[];
  isAdmin: boolean;
}

export function CommonTipsSection({ tips, isAdmin }: Props) {
  if (!isAdmin) return null;
  return <TipsSection tips={tips} />;
}
