import { Home, Calendar, Compass, Info as InfoIcon, LucideIcon } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const getNavItems = (trip: any | null, isAdmin: boolean): NavItem[] => {
  const base = [{ href: '/', label: 'Portal', icon: Home }];

  if (!trip) return base;

  const tripNav = [
    { href: `/trip/${trip.slug}`, label: 'Plan', icon: Home },
    ...trip.days
      .filter((day: any) => day.events && day.events.length > 0)
      .map((day: any) => ({
        href: `/trip/${trip.slug}/day/${day.dayNumber}`,
        label: `Day ${day.dayNumber}`,
        icon: Calendar
      })),
    { href: `/trip/${trip.slug}/info`, label: 'Info', icon: InfoIcon },
    ...(isAdmin ? [{ href: `/trip/${trip.slug}/tips`, label: 'Tips', icon: Compass }] : []),
  ];

  return [...base, ...tripNav];
};
