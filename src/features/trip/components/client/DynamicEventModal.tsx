'use client';

import dynamic from 'next/dynamic';

export const DynamicEventModal = dynamic(() => import('./EventDetailModal'), {
  ssr: false,
});
