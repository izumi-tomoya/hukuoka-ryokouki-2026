import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import pg from "pg";
import {
  day1Events,
  day1Tips,
  day2Events,
  day2Tips,
  itoshimaEvents,
  itoshimaTips,
  packingList,
} from "../src/data/tripData";
import type { TransitStep, TripEvent, YataiStop } from "../src/features/trip/types/trip";
import { LOCATION_COORDINATES } from "../src/features/trip/utils/locationCatalog";

// Load .env file
dotenv.config();

const url = process.env.DATABASE_PUBLIC_URL || process.env.DATABASE_URL;

if (!url) {
  console.error("❌ Error: DATABASE_URL or DATABASE_PUBLIC_URL is not set.");
  process.exit(1);
}

// Log connection info (masked)
const maskedUrl = url.replace(/:[^:@]+@/, ":****@");
console.log(`🔗 Attempting to connect to: ${maskedUrl}`);

const pool = new pg.Pool({
  connectionString: url,
  ssl: {
    rejectUnauthorized: false,
  },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter, log: ["error", "warn"] });

async function createEvents(dayId: string, events: TripEvent[]) {
  for (const [index, event] of events.entries()) {
    // Find existing event to preserve live data
    const existingEvent = await prisma.event.findFirst({
      where: { dayId, time: event.time, title: event.title || event.foodName },
    });

    const eventData = {
      time: event.time,
      type: event.type,
      title: event.title || null,
      formalName: event.formalName || null,
      desc: event.desc || null,
      tag: event.tag || null,
      tagLabel: event.tagLabel || null,
      locationUrl: event.locationUrl || null,
      foodName: event.foodName || null,
      foodDesc: event.foodDesc || null,
      highlight: event.highlight || null,
      isYatai: event.isYatai || false,
      isConfirmed: event.isConfirmed || false,
      order: index,
      plannedBudget: event.plannedBudget || null,
    };

    const createdEvent = await prisma.event.upsert({
      where: { id: existingEvent?.id || "new-event" },
      update: eventData,
      create: {
        ...eventData,
        dayId: dayId,
      },
    });

    // Transit steps and Yatai stops are replaced to ensure sync
    if (event.yataiStops) {
      await prisma.yataiStop.deleteMany({ where: { eventId: createdEvent.id } });
      await prisma.yataiStop.createMany({
        data: event.yataiStops.map((stop: YataiStop, sIndex: number) => ({
          eventId: createdEvent.id,
          time: stop.time,
          stop: stop.stop,
          desc: stop.desc,
          order: sIndex,
        })),
      });
    }

    if (event.transitSteps) {
      await prisma.transitStep.deleteMany({ where: { eventId: createdEvent.id } });
      await prisma.transitStep.createMany({
        data: event.transitSteps.map((step: TransitStep, sIndex: number) => ({
          eventId: createdEvent.id,
          time: step.time,
          station: step.station,
          mode: step.mode,
          lineName: step.lineName,
          duration: step.duration,
          fare: step.fare,
          platform: step.platform,
          exit: step.exit,
          isTransfer: step.isTransfer || false,
          order: sIndex,
        })),
      });
    }

    // Preserve existing media unless explicitly provided in static data
    if (event.photos && Array.isArray(event.photos) && event.photos.length > 0) {
      for (const photoUrl of event.photos as unknown as string[]) {
        await prisma.media.upsert({
          where: { id: `media-${createdEvent.id}-${photoUrl}` }, // Synthetic ID for seed
          update: {},
          create: {
            url: photoUrl,
            eventId: createdEvent.id,
            type: "image",
          },
        });
      }
    }
  }
}

// ... In main function, remove:
// await prisma.event.deleteMany({ where: { dayId: { in: [d1.id, d2.id] } } });
// Replace with a more targeted approach if needed, or just let upsert handle it.

async function main() {
  console.log("🌱 Start seeding...");

  // ==========================================
  // 0. Location Master
  // ==========================================
  console.log("Adding Location master data...");
  for (const [name, [lat, lng]] of Object.entries(LOCATION_COORDINATES)) {
    await prisma.location.upsert({
      where: { name },
      update: { lat, lng },
      create: { name, lat, lng },
    });
  }

  // ==========================================
  // 1. 福岡プラン (fukuoka-2026)
  // ==========================================
  const tripFukuoka = await prisma.trip.upsert({
    where: { slug: "fukuoka-2026" },
    update: {
      title: "福岡、静寂と躍動の二日間",
      description: "二人の記憶を刻む、洗練された博多の旅",
      image: "linear-gradient(135deg, #1a1c2c 0%, #4a192c 100%)",
    },
    create: {
      slug: "fukuoka-2026",
      title: "福岡、静寂と躍動の二日間",
      description: "二人の記憶を刻む、洗練された博多の旅",
      location: "Fukuoka, Japan",
      startDate: new Date("2026-05-24T07:30:00Z"),
      endDate: new Date("2026-05-25T23:59:59Z"),
      image: "linear-gradient(135deg, #1a1c2c 0%, #4a192c 100%)",
      accentColor: "#F5C842",
      status: "Upcoming",
    },
  });

  console.log(`✅ Trip created/updated: ${tripFukuoka.title}`);

  const d1 = await prisma.day.upsert({
    where: { tripId_dayNumber: { tripId: tripFukuoka.id, dayNumber: 1 } },
    update: {
      title: "博多、彩りの追憶",
      highlight: "都会の洗練と伝統が交差する街。最高のスタートを。",
    },
    create: {
      tripId: tripFukuoka.id,
      dayNumber: 1,
      date: new Date("2026-05-24"),
      title: "博多、彩りの追憶",
      highlight: "都会の洗練と伝統が交差する街。最高のスタートを。",
    },
  });

  const d2 = await prisma.day.upsert({
    where: { tripId_dayNumber: { tripId: tripFukuoka.id, dayNumber: 2 } },
    update: {
      title: "海風と、語り継がれる風景",
      highlight: "海風を感じながら、心に刻まれる穏やかな時間を。",
    },
    create: {
      tripId: tripFukuoka.id,
      dayNumber: 2,
      date: new Date("2026-05-25"),
      title: "海風と、語り継がれる風景",
      highlight: "海風を感じながら、心に刻まれる穏やかな時間を。",
    },
  });

  // For events, we now use upsert inside createEvents which is safer.
  // await prisma.event.deleteMany({ where: { dayId: { in: [d1.id, d2.id] } } });

  console.log("Adding Day 1 events...");
  await createEvents(d1.id, day1Events);

  console.log("Adding Day 2 events...");
  await createEvents(d2.id, day2Events);

  // Packing Items (Safer update)
  for (const [index, item] of packingList.entries()) {
    await prisma.packingItem.upsert({
      where: { id: `pack-${tripFukuoka.id}-${item.name}` }, // Synthetic ID for seed
      update: { order: index },
      create: {
        tripId: tripFukuoka.id,
        name: item.name,
        category: item.category,
        order: index,
        isPacked: false,
      },
    });
  }

  // Tips (Safer update)
  for (const [index, tip] of day1Tips.entries()) {
    await prisma.tip.upsert({
      where: { id: `tip-${tripFukuoka.id}-${tip.title}` }, // Synthetic ID for seed
      update: { body: tip.body, order: index },
      create: {
        tripId: tripFukuoka.id,
        title: tip.title,
        body: tip.body,
        isWarning: tip.isWarning || false,
        order: index,
      },
    });
  }
  for (const [index, tip] of day2Tips.entries()) {
    await prisma.tip.upsert({
      where: { id: `tip-${tripFukuoka.id}-${tip.title}` }, // Synthetic ID for seed
      update: { body: tip.body, order: index + 100 },
      create: {
        tripId: tripFukuoka.id,
        title: tip.title,
        body: tip.body,
        isWarning: tip.isWarning || false,
        order: index + 100,
      },
    });
  }

  // ==========================================
  // 2. 糸島プラン (itoshima-drive)
  // ==========================================
  const tripItoshima = await prisma.trip.upsert({
    where: { slug: "itoshima-drive" },
    update: {
      title: "糸島、碧に溶ける休日",
      description: "絶景とカフェを巡る、心洗われるシーサイド・エスケープ",
      startDate: new Date("2026-05-24T00:00:00Z"),
      endDate: new Date("2026-05-24T23:59:59Z"),
    },
    create: {
      slug: "itoshima-drive",
      title: "糸島、碧に溶ける休日",
      description: "絶景とカフェを巡る、心洗われるシーサイド・エスケープ",
      location: "Itoshima, Fukuoka",
      startDate: new Date("2026-05-24T00:00:00Z"),
      endDate: new Date("2026-05-24T23:59:59Z"),
      image: "linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)",
      accentColor: "#42F5E0",
      status: "Planning",
    },
  });

  console.log(`✅ Trip created/updated: ${tripItoshima.title}`);

  const di1 = await prisma.day.upsert({
    where: { tripId_dayNumber: { tripId: tripItoshima.id, dayNumber: 1 } },
    update: {
      date: new Date("2026-05-24"),
    },
    create: {
      tripId: tripItoshima.id,
      dayNumber: 1,
      date: new Date("2026-05-24"),
      title: "潮騒に癒やされる一日",
      highlight: "青い海、白い鳥居、お洒落なカフェ。都会の喧騒を離れて、最高の癒やしタイムを。",
    },
  });

  console.log("Adding Itoshima Day 1 events...");
  // await prisma.event.deleteMany({ where: { dayId: di1.id } });
  await createEvents(di1.id, itoshimaEvents);

  // Tips for Itoshima
  for (const [index, tip] of itoshimaTips.entries()) {
    await prisma.tip.upsert({
      where: { id: `tip-${tripItoshima.id}-${tip.title}` },
      update: { body: tip.body, order: index },
      create: {
        tripId: tripItoshima.id,
        title: tip.title,
        body: tip.body,
        isWarning: tip.isWarning || false,
        order: index,
      },
    });
  }

  console.log("✅ Seeding finished!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
