'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getTripBySlug(slug: string) {
  return prisma.trip.findUnique({
    where: { slug },
    include: {
      days: {
        orderBy: { dayNumber: 'asc' },
        include: {
          events: {
            orderBy: { order: 'asc' },
            include: { yataiStops: { orderBy: { order: 'asc' } } },
          },
        },
      },
      tips: { orderBy: { order: 'asc' } },
    },
  });
}

export async function createTrip(formData: FormData) {
  const title = formData.get('title') as string;
  const location = formData.get('location') as string;
  const accentColor = formData.get('accentColor') as string;
  const startDate = new Date(formData.get('startDate') as string);
  const endDate = new Date(formData.get('endDate') as string);

  // Generate a simple slug
  const slug = `${title.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString().slice(-4)}`;

  try {
    const trip = await prisma.trip.create({
      data: {
        title,
        location,
        accentColor,
        startDate,
        endDate,
        slug,
        image: `linear-gradient(135deg, ${accentColor} 0%, #050B17 100%)`, // Auto-generate gradient
        status: 'Planning',
      },
    });

    revalidatePath('/');
    return { success: true, slug: trip.slug };
  } catch (error) {
    console.error('Failed to create trip:', error);
    return { success: false, error: '旅の作成に失敗しました' };
  }
}

export async function getTrips() {
  return await prisma.trip.findMany({
    orderBy: { startDate: 'desc' },
  });
}
