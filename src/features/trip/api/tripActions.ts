'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { del } from '@vercel/blob';
import { Prisma } from '@prisma/client';
import { eventSchema } from '@/lib/formvalidation/eventSchema';

export type TripWithRelations = Prisma.TripGetPayload<{
  include: {
    days: {
      include: {
        events: {
          include: { 
            yataiStops: true,
            transitSteps: true,
            photos: true,
          },
        },
      },
    },
    tips: true,
    packingItems: true,
    gourmetAwards: true,
  },
}>;

async function checkAdmin() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    throw new Error("管理者権限が必要です");
  }
}

export async function getTripBySlug(slug: string): Promise<TripWithRelations | null> {
  const trip = await prisma.trip.findUnique({
    where: { slug },
    include: {
      days: {
        orderBy: { dayNumber: 'asc' },
        include: {
          events: {
            orderBy: { order: 'asc' },
            include: { 
              yataiStops: { orderBy: { order: 'asc' } },
              transitSteps: { orderBy: { order: 'asc' } },
              photos: { orderBy: { createdAt: 'asc' } },
            },
          },
        },
      },
      tips: { orderBy: { order: 'asc' } },
      packingItems: { orderBy: { order: 'asc' } },
      gourmetAwards: { orderBy: { order: 'asc' } },
    },
  });

  return trip as TripWithRelations | null;
}

export async function createTrip(formData: FormData) {
  await checkAdmin();
  const title = formData.get('title') as string;
  const location = formData.get('location') as string;
  const accentColor = formData.get('accentColor') as string;
  const startDate = new Date(formData.get('startDate') as string);
  const endDate = new Date(formData.get('endDate') as string);

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
        image: `linear-gradient(135deg, ${accentColor} 0%, #050B17 100%)`,
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

export async function getAllLocations() {
  try {
    return await prisma.location.findMany();
  } catch (error) {
    console.error('Failed to fetch locations:', error);
    return [];
  }
}

export async function updateEventAction(eventId: string, data: unknown) {
  await checkAdmin();
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
        time: result.data.time, 
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
    await prisma.event.update({
      where: { id: eventId },
      data: { isConfirmed },
    });
    revalidatePath('/trip/[slug]/day/[id]', 'page');
    return { success: true };
  } catch (error) {
    console.error('Failed to toggle event confirmation:', error);
    return { success: false, error: String(error) };
  }
}

export async function addPhotoToEvent(eventId: string, photoUrl: string) {
  try {
    await prisma.media.create({
      data: {
        url: photoUrl,
        eventId: eventId,
        type: 'image',
      },
    });

    revalidatePath('/trip/[slug]/day/[id]', 'page');
    revalidatePath('/trip/[slug]/memories', 'page');
    return { success: true };
  } catch (error) {
    console.error('Failed to add photo:', error);
    return { success: false, error: String(error) };
  }
}

export async function deletePhotoFromEvent(eventId: string, photoUrl: string) {
  try {
    const media = await prisma.media.findFirst({
      where: { 
        url: photoUrl,
        eventId: eventId 
      }
    });

    if (media) {
      await prisma.media.delete({
        where: { id: media.id }
      });
    }

    try {
      const token = process.env.BLOB_READ_WRITE_TOKEN;
      await del(photoUrl, { token });
    } catch (blobError) {
      console.error('Blob deletion failed:', blobError);
    }

    revalidatePath('/trip/[slug]/day/[id]', 'page');
    revalidatePath('/trip/[slug]/memories', 'page');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete photo:', error);
    return { success: false, error: String(error) };
  }
}

export async function createTipAction(tripId: string, data: { title: string; body: string; venue?: string; imageUrl?: string; isWarning: boolean; isConfirmed: boolean; category: string; deepLevel: number }) {
  await checkAdmin();
  try {
    await prisma.tip.create({
      data: {
        tripId,
        ...data,
      },
    });
    revalidatePath('/trip/[slug]/tips', 'page');
    return { success: true };
  } catch (error) {
    console.error('Failed to create tip:', error);
    return { success: false, error: '作成に失敗しました' };
  }
}

export async function updateTipAction(tipId: string, data: { title: string; body: string; venue?: string; imageUrl?: string; isWarning: boolean; isConfirmed: boolean; category: string; deepLevel: number }) {
  await checkAdmin();
  try {
    await prisma.tip.update({
      where: { id: tipId },
      data,
    });
    revalidatePath('/trip/[slug]/tips', 'page');
    return { success: true };
  } catch (error) {
    console.error('Failed to update tip:', error);
    return { success: false, error: '更新に失敗しました' };
  }
}

export async function toggleTipConfirmation(tipId: string, isConfirmed: boolean) {
  await checkAdmin();
  try {
    await prisma.tip.update({
      where: { id: tipId },
      data: { isConfirmed },
    });
    revalidatePath('/trip/[slug]/tips', 'page');
    return { success: true };
  } catch (error) {
    console.error('Failed to toggle tip confirmation:', error);
    return { success: false, error: String(error) };
  }
}

export async function deleteTipAction(tipId: string) {
  await checkAdmin();
  try {
    await prisma.tip.delete({
      where: { id: tipId },
    });
    revalidatePath('/trip/[slug]/tips', 'page');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete tip:', error);
    return { success: false, error: '削除に失敗しました' };
  }
}

export async function addPackingItemAction(tripId: string, name: string, category: string) {
  try {
    await prisma.packingItem.create({
      data: { tripId, name, category },
    });
    revalidatePath('/trip/[slug]/info', 'page');
    return { success: true };
  } catch (error) {
    console.error('Failed to add packing item:', error);
    return { success: false, error: String(error) };
  }
}

export async function togglePackingItemAction(id: string, isPacked: boolean) {
  try {
    await prisma.packingItem.update({
      where: { id },
      data: { isPacked },
    });
    revalidatePath('/trip/[slug]/info', 'page');
    return { success: true };
  } catch (error) {
    console.error('Failed to toggle packing item:', error);
    return { success: false, error: String(error) };
  }
}

export async function deletePackingItemAction(id: string) {
  try {
    await prisma.packingItem.delete({
      where: { id },
    });
    revalidatePath('/trip/[slug]/info', 'page');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete packing item:', error);
    return { success: false, error: String(error) };
  }
}

export async function addGourmetAwardAction(tripId: string, data: { category: string, title: string, comment?: string, imageUrl?: string, eventId?: string }) {
  await checkAdmin();
  try {
    await prisma.gourmetAward.create({
      data: { tripId, ...data },
    });
    revalidatePath('/trip/[slug]/memories', 'page');
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function deleteGourmetAwardAction(id: string) {
  await checkAdmin();
  try {
    await prisma.gourmetAward.delete({
      where: { id },
    });
    revalidatePath('/trip/[slug]/memories', 'page');
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}
