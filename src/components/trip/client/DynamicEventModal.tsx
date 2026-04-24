import dynamic from 'next/dynamic';

export const DynamicEventModal = dynamic(() => import('@/components/trip/client/EventDetailModal'), {
  ssr: false,
});
