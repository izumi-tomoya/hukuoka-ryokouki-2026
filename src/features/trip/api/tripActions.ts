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

import { eventSchema } from '@/lib/formvalidation/eventSchema';

export async function updateEventAction(eventId: string, data: unknown) {
  const result = eventSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: 'Invalid data' };
  }

  try {
    const { yataiStops, ...eventData } = result.data;
    await prisma.event.update({
      where: { id: eventId },
      data: {
        ...eventData,
        time: result.data.time, // Ensure time is explicitly updated
        yataiStops: yataiStops ? {
          deleteMany: {},
          create: yataiStops.map((stop, index) => ({
            time: stop.time,
            stop: stop.stop,
            desc: stop.desc ?? "",
            order: index
          }))
        } : undefined
      },
    });
    revalidatePath('/trip/[slug]/day/[id]', 'page');
    return { success: true };
  } catch (error) {
    console.error('Failed to update event:', error);
    return { success: false, error: 'Failed to update' };
  }
}

export async function toggleEventConfirmation(eventId: string, isConfirmed: boolean) {
  try {
    const res = await prisma.event.update({
      where: { id: eventId },
      data: { isConfirmed },
    });
    console.log("Updated event:", res);
    revalidatePath('/trip/[slug]/day/[id]', 'page');
    return { success: true };
  } catch (error) {
    console.error('Failed to toggle event confirmation:', error);
    return { success: false, error: String(error) };
  }
}
