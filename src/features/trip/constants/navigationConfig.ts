import { Home, Calendar, Compass, Info as InfoIcon, LucideIcon, Camera, LifeBuoy } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export interface TripNavData {
  slug: string;
  title?: string;
  description?: string | null;
  location?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  accentColor?: string;
  days: {
    dayNumber: number;
    events: unknown[];
  }[];
}

export const getNavItems = (trip: TripNavData | null, isAdmin: boolean): NavItem[] => {
  const base = [{ href: '/', label: 'Portal', icon: Home }];

  if (!trip) return base;

  const tripNav = [
    { href: `/trip/${trip.slug}`, label: 'Plan', icon: Home },
    ...trip.days
      .filter((day) => day.events && day.events.length > 0)
      .map((day) => ({
        href: `/trip/${trip.slug}/day/${day.dayNumber}`,
        label: `Day ${day.dayNumber}`,
        icon: Calendar
      })),
    { href: `/trip/${trip.slug}/assist`, label: 'Assist', icon: LifeBuoy },
    { href: `/trip/${trip.slug}/memories`, label: 'Memories', icon: Camera },
    { href: `/trip/${trip.slug}/info`, label: 'Info', icon: InfoIcon },
    ...(isAdmin ? [{ href: `/trip/${trip.slug}/tips`, label: 'Tips', icon: Compass }] : []),
  ];

  return [...base, ...tripNav];
};
