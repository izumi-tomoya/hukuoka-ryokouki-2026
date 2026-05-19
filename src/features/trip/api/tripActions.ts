"use server";

import type { Prisma } from "@prisma/client";
import { del } from "@vercel/blob";
import { revalidatePath, revalidateTag } from "next/cache";
import { auth } from "@/lib/auth";
import { eventSchema } from "@/lib/formvalidation/eventSchema";
import { prisma } from "@/lib/prisma";

export type TripWithRelations = Prisma.TripGetPayload<{
  include: {
    days: {
      include: {
        events: {
          include: {
            yataiStops: true;
            transitSteps: true;
            photos: true;
          };
        };
      };
    };
    tips: true;
    packingItems: true;
    gourmetAwards: true;
  };
}>;

async function checkAdmin() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    throw new Error("管理者権限が必要です");
  }
}

import { z } from "zod";

const tripSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  description: z.string().optional(),
  location: z.string().min(1, "場所は必須です"),
  accentColor: z.string().startsWith("#"),
  startDate: z.string().transform((v) => new Date(v)),
  endDate: z.string().transform((v) => new Date(v)),
});

export async function updateTripAction(tripId: string, formData: FormData) {
  await checkAdmin();

  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    location: formData.get("location"),
    accentColor: formData.get("accentColor"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
  };

  const validated = tripSchema.safeParse(rawData);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message };
  }

  const { title, description, location, accentColor, startDate, endDate } = validated.data;

  try {
    const trip = await prisma.trip.update({
      where: { id: tripId },
      data: {
        title,
        description,
        location,
        accentColor,
        startDate,
        endDate,
        image: `linear-gradient(135deg, ${accentColor} 0%, #050B17 100%)`,
      },
    });

    revalidatePath(`/trip/${trip.slug}`);
    revalidatePath("/");
    return { success: true, slug: trip.slug };
  } catch (error) {
    console.error("Failed to update trip:", error);
    return { success: false, error: "旅の更新に失敗しました" };
  }
}

export async function deleteTripAction(tripId: string) {
  await checkAdmin();
  try {
    const trip = await prisma.trip.delete({
      where: { id: tripId },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete trip:", error);
    return { success: false, error: "旅の削除に失敗しました" };
  }
}

export async function getTripBySlug(slug: string): Promise<TripWithRelations | null> {
  try {
    const trip = await prisma.trip.findUnique({
      where: { slug },
      include: {
        days: {
          orderBy: { dayNumber: "asc" },
          include: {
            events: {
              orderBy: { order: "asc" },
              include: {
                yataiStops: { orderBy: { order: "asc" } },
                transitSteps: { orderBy: { order: "asc" } },
                photos: { orderBy: { createdAt: "asc" } },
              },
            },
          },
        },
        tips: { orderBy: { order: "asc" } },
        packingItems: { orderBy: { order: "asc" } },
        gourmetAwards: { orderBy: { order: "asc" } },
      },
    });

    if (!trip) return null;

    // JSON 化してシリアライズ可能なプレーンオブジェクトに変換（RSC/Hydrationエラー対策）
    return JSON.parse(JSON.stringify(trip)) as TripWithRelations;
  } catch (error) {
    console.error("Failed to fetch trip by slug:", error);
    return null;
  }
}
export async function createTrip(formData: FormData) {
  await checkAdmin();

  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    location: formData.get("location"),
    accentColor: formData.get("accentColor"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
  };

  const validated = tripSchema.safeParse(rawData);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message };
  }

  const { title, description, location, accentColor, startDate, endDate } = validated.data;

  // タイトルからクリーンなスラッグを作成
  const baseSlug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // 記号を除去
    .replace(/\s+/g, "-") // スペースをハイフンに
    .trim();
  const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

  try {
    const trip = await prisma.trip.create({
      data: {
        title,
        description,
        location,
        accentColor,
        startDate,
        endDate,
        slug,
        image: `linear-gradient(135deg, ${accentColor} 0%, #050B17 100%)`,
        status: "Upcoming",
      },
    });

    revalidatePath("/");
    return { success: true, slug: trip.slug };
  } catch (error) {
    console.error("Failed to create trip:", error);
    return { success: false, error: "旅の作成に失敗しました" };
  }
}

export async function getTrips() {
  try {
    return await prisma.trip.findMany({
      orderBy: { startDate: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch trips:", error);
    return [];
  }
}

export async function addDayAction(tripId: string) {
  await checkAdmin();
  try {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { days: true },
    });

    if (!trip) throw new Error("Trip not found");

    const nextDayNumber = trip.days.length + 1;
    const nextDate = new Date(trip.startDate);
    nextDate.setDate(nextDate.getDate() + trip.days.length);

    await prisma.day.create({
      data: {
        tripId,
        dayNumber: nextDayNumber,
        date: nextDate,
        title: `Day ${nextDayNumber}`,
      },
    });

    revalidatePath(`/trip/${trip.slug}`);
    revalidatePath(`/trip/${trip.slug}/day/[id]`, "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to add day:", error);
    return { success: false, error: "日付の追加に失敗しました" };
  }
}

export async function getAllLocations() {
  try {
    return await prisma.location.findMany();
  } catch (error) {
    console.error("Failed to fetch locations:", error);
    return [];
  }
}

export async function createEventAction(dayId: string, data: unknown) {
  await checkAdmin();
  const result = eventSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: "Invalid data" };
  }

  try {
    const { yataiStops, ...eventData } = result.data;

    // 現在の最大オーダーを取得
    const maxOrder = await prisma.event.aggregate({
      where: { dayId },
      _max: { order: true },
    });
    const nextOrder = (maxOrder._max.order ?? -1) + 1;

    const event = await prisma.event.create({
      data: {
        ...eventData,
        dayId,
        order: nextOrder,
        time: result.data.time || "00:00",
        type: result.data.type || "basic",
        yataiStops: yataiStops
          ? {
              create: yataiStops.map((stop, index) => ({
                time: stop.time,
                stop: stop.stop,
                desc: stop.desc ?? "",
                order: index,
              })),
            }
          : undefined,
      },
      include: { day: { include: { trip: true } } },
    });

    revalidatePath(`/trip/${event.day.trip.slug}`);
    revalidateTag(`trip-${event.day.trip.slug}`, "default");
    return { success: true };
  } catch (error) {
    console.error("Failed to create event:", error);
    return { success: false, error: "Failed to create" };
  }
}

export async function updateEventAction(eventId: string, data: unknown) {
  await checkAdmin();
  const result = eventSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: "Invalid data" };
  }

  try {
    const { yataiStops, ...eventData } = result.data;
    const event = await prisma.event.update({
      where: { id: eventId },
      data: {
        ...eventData,
        time: result.data.time,
        yataiStops: yataiStops
          ? {
              deleteMany: {},
              create: yataiStops.map((stop, index) => ({
                time: stop.time,
                stop: stop.stop,
                desc: stop.desc ?? "",
                order: index,
              })),
            }
          : undefined,
      },
      include: { day: { include: { trip: true } } },
    });

    revalidatePath(`/trip/${event.day.trip.slug}`);
    revalidateTag(`trip-${event.day.trip.slug}`, "default");
    return { success: true };
  } catch (error) {
    console.error("Failed to update event:", error);
    return { success: false, error: "Failed to update" };
  }
}

export async function deleteEventAction(eventId: string) {
  await checkAdmin();
  try {
    const event = await prisma.event.delete({
      where: { id: eventId },
      include: { day: { include: { trip: true } } },
    });
    revalidatePath(`/trip/${event.day.trip.slug}`);
    revalidateTag(`trip-${event.day.trip.slug}`, "default");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete event:", error);
    return { success: false, error: "削除に失敗しました" };
  }
}

export async function toggleEventConfirmation(eventId: string, isConfirmed: boolean) {
  try {
    await prisma.event.update({
      where: { id: eventId },
      data: { isConfirmed },
    });
    revalidatePath("/trip/[slug]/day/[id]", "page");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle event confirmation:", error);
    return { success: false, error: String(error) };
  }
}

export async function updateDayAction(dayId: string, data: { title?: string; highlight?: string; notes?: string }) {
  await checkAdmin();
  try {
    const day = await prisma.day.update({
      where: { id: dayId },
      data,
      include: { trip: true },
    });
    revalidatePath(`/trip/${day.trip.slug}`);
    revalidatePath(`/trip/${day.trip.slug}/day/${day.dayNumber}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update day:", error);
    return { success: false, error: "日付の更新に失敗しました" };
  }
}

export async function toggleDayCompletionAction(dayId: string, isCompleted: boolean) {
  try {
    const day = await prisma.day.update({
      where: { id: dayId },
      data: { isCompleted },
      include: { trip: true },
    });
    revalidatePath(`/trip/${day.trip.slug}`);
    revalidatePath(`/trip/${day.trip.slug}/day/${day.dayNumber}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle day completion:", error);
    return { success: false, error: String(error) };
  }
}

export async function addPhotoToEvent(eventId: string, photoUrl: string) {
  try {
    await prisma.media.create({
      data: {
        url: photoUrl,
        eventId: eventId,
        type: "image",
      },
    });

    revalidatePath("/trip/[slug]/day/[id]", "page");
    revalidatePath("/trip/[slug]/memories", "page");
    return { success: true };
  } catch (error) {
    console.error("Failed to add photo:", error);
    return { success: false, error: String(error) };
  }
}

export async function deletePhotoFromEvent(eventId: string, photoUrl: string) {
  try {
    const media = await prisma.media.findFirst({
      where: {
        url: photoUrl,
        eventId: eventId,
      },
    });

    if (media) {
      await prisma.media.delete({
        where: { id: media.id },
      });
    }

    try {
      const token = process.env.BLOB_READ_WRITE_TOKEN;
      await del(photoUrl, { token });
    } catch (blobError) {
      console.error("Blob deletion failed:", blobError);
    }

    revalidatePath("/trip/[slug]/day/[id]", "page");
    revalidatePath("/trip/[slug]/memories", "page");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete photo:", error);
    return { success: false, error: String(error) };
  }
}

export async function createTipAction(
  tripId: string,
  data: {
    title: string;
    body: string;
    venue?: string;
    imageUrl?: string;
    isWarning: boolean;
    isConfirmed: boolean;
    category: string;
    deepLevel: number;
  },
) {
  await checkAdmin();
  try {
    await prisma.tip.create({
      data: {
        tripId,
        ...data,
      },
    });
    revalidatePath("/trip/[slug]/tips", "page");
    return { success: true };
  } catch (error) {
    console.error("Failed to create tip:", error);
    return { success: false, error: "作成に失敗しました" };
  }
}

export async function updateTipAction(
  tipId: string,
  data: {
    title: string;
    body: string;
    venue?: string;
    imageUrl?: string;
    isWarning: boolean;
    isConfirmed: boolean;
    category: string;
    deepLevel: number;
  },
) {
  await checkAdmin();
  try {
    await prisma.tip.update({
      where: { id: tipId },
      data,
    });
    revalidatePath("/trip/[slug]/tips", "page");
    return { success: true };
  } catch (error) {
    console.error("Failed to update tip:", error);
    return { success: false, error: "更新に失敗しました" };
  }
}

export async function toggleTipConfirmation(tipId: string, isConfirmed: boolean) {
  await checkAdmin();
  try {
    await prisma.tip.update({
      where: { id: tipId },
      data: { isConfirmed },
    });
    revalidatePath("/trip/[slug]/tips", "page");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle tip confirmation:", error);
    return { success: false, error: String(error) };
  }
}

export async function deleteTipAction(tipId: string) {
  await checkAdmin();
  try {
    await prisma.tip.delete({
      where: { id: tipId },
    });
    revalidatePath("/trip/[slug]/tips", "page");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete tip:", error);
    return { success: false, error: "削除に失敗しました" };
  }
}

export async function addPackingItemAction(tripId: string, name: string, category: string) {
  try {
    await prisma.packingItem.create({
      data: { tripId, name, category },
    });
    revalidatePath("/trip/[slug]/info", "page");
    return { success: true };
  } catch (error) {
    console.error("Failed to add packing item:", error);
    return { success: false, error: String(error) };
  }
}

export async function togglePackingItemAction(id: string, isPacked: boolean) {
  try {
    await prisma.packingItem.update({
      where: { id },
      data: { isPacked },
    });
    revalidatePath("/trip/[slug]/info", "page");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle packing item:", error);
    return { success: false, error: String(error) };
  }
}

export async function deletePackingItemAction(id: string) {
  try {
    await prisma.packingItem.delete({
      where: { id },
    });
    revalidatePath("/trip/[slug]/info", "page");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete packing item:", error);
    return { success: false, error: String(error) };
  }
}

export async function addGourmetAwardAction(
  tripId: string,
  data: { category: string; title: string; comment?: string; imageUrl?: string; eventId?: string },
) {
  await checkAdmin();
  try {
    await prisma.gourmetAward.create({
      data: { tripId, ...data },
    });
    revalidatePath("/trip/[slug]/memories", "page");
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
    revalidatePath("/trip/[slug]/memories", "page");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}
