'use client';

import dynamic from 'next/dynamic';
import TripMapSkeleton from '../TripMapSkeleton';

export const DynamicTripMap = dynamic(() => import('./TripMap'), {
  ssr: false,
  loading: () => <TripMapSkeleton />
});
