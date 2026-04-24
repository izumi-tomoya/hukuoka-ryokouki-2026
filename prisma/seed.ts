import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as dotenv from 'dotenv';
import { 
  day1Events, 
  day2Events, 
  day1Tips, 
  day2Tips,
  itoshimaEvents,
  itoshimaTips
} from '../src/data/tripData';
import { YataiStop, TransitStep } from "../src/features/trip/types/trip";

// Load .env file
dotenv.config();

const url = process.env.DATABASE_PUBLIC_URL || process.env.DATABASE_URL;

if (!url) {
  console.error('❌ Error: DATABASE_URL or DATABASE_PUBLIC_URL is not set.');
  process.exit(1);
}

// Log connection info (masked)
const maskedUrl = url.replace(/:[^:@]+@/, ':****@');
console.log(`🔗 Attempting to connect to: ${maskedUrl}`);

const pool = new pg.Pool({
  connectionString: url,
  ssl: {
    rejectUnauthorized: false,
  },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter, log: ['error', 'warn'] });

async function main() {
  console.log('🌱 Start seeding...');

  // ==========================================
  // 1. 福岡プラン (fukuoka-2026)
  // ==========================================
  const tripFukuoka = await prisma.trip.upsert({
    where: { slug: 'fukuoka-2026' },
    update: {
      title: '福岡、静寂と躍動の二日間',
      description: '二人の記憶を刻む、洗練された博多の旅',
      image: 'linear-gradient(135deg, #1a1c2c 0%, #4a192c 100%)',
    },
    create: {
      slug: 'fukuoka-2026',
      title: '福岡、静寂と躍動の二日間',
      description: '二人の記憶を刻む、洗練された博多の旅',
      location: 'Fukuoka, Japan',
      startDate: new Date('2026-05-24T07:30:00Z'),
      endDate: new Date('2026-05-25T23:59:59Z'),
      image: 'linear-gradient(135deg, #1a1c2c 0%, #4a192c 100%)',
      accentColor: '#F5C842',
      status: 'Upcoming',
    },
  });

  console.log(`✅ Trip created/updated: ${tripFukuoka.title}`);

  const d1 = await prisma.day.upsert({
    where: { tripId_dayNumber: { tripId: tripFukuoka.id, dayNumber: 1 } },
    update: {
      title: '博多、彩りの追憶',
      highlight: '都会の洗練と伝統が交差する街。最高のスタートを。',
    },
    create: {
      tripId: tripFukuoka.id,
      dayNumber: 1,
      date: new Date('2026-05-24'),
      title: '博多、彩りの追憶',
      highlight: '都会の洗練と伝統が交差する街。最高のスタートを。',
    },
  });

  const d2 = await prisma.day.upsert({
    where: { tripId_dayNumber: { tripId: tripFukuoka.id, dayNumber: 2 } },
    update: {
      title: '海風と、語り継がれる風景',
      highlight: '海風を感じながら、心に刻まれる穏やかな時間を。',
    },
    create: {
      tripId: tripFukuoka.id,
      dayNumber: 2,
      date: new Date('2026-05-25'),
      title: '海風と、語り継がれる風景',
      highlight: '海風を感じながら、心に刻まれる穏やかな時間を。',
    },
  });

  await prisma.event.deleteMany({ where: { dayId: { in: [d1.id, d2.id] } } });

  // Add Day 1 Events
  for (const [index, event] of day1Events.entries()) {
    await prisma.event.create({
      data: {
        dayId: d1.id,
        time: event.time,
        type: event.type,
        title: event.title || null,
        desc: event.desc || null,
        tag: event.tag || null,
        tagLabel: event.tagLabel || null,
        locationUrl: event.locationUrl || null,
        foodName: event.foodName || null,
        foodDesc: event.foodDesc || null,
        highlight: event.highlight || null,
        isYatai: event.isYatai || false,
        order: index,
        yataiStops: event.yataiStops ? {
          create: event.yataiStops.map((stop: YataiStop, sIndex: number) => ({
            time: stop.time,
            stop: stop.stop,
            desc: stop.desc,
            order: sIndex,
          })),
        } : undefined,
        transitSteps: event.transitSteps ? {
          create: event.transitSteps.map((step: TransitStep, sIndex: number) => ({
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
        } : undefined,
      },
    });
  }

  // Add Day 2 Events
  for (const [index, event] of day2Events.entries()) {
    await prisma.event.create({
      data: {
        dayId: d2.id,
        time: event.time,
        type: event.type,
        title: event.title || null,
        desc: event.desc || null,
        tag: event.tag || null,
        tagLabel: event.tagLabel || null,
        locationUrl: event.locationUrl || null,
        foodName: event.foodName || null,
        foodDesc: event.foodDesc || null,
        highlight: event.highlight || null,
        isYatai: event.isYatai || false,
        order: index,
        transitSteps: event.transitSteps ? {
          create: event.transitSteps.map((step: TransitStep, sIndex: number) => ({
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
        } : undefined,
      },
    });
  }

  // Tips
  await prisma.tip.deleteMany({ where: { tripId: tripFukuoka.id } });
  for (const [index, tip] of day1Tips.entries()) {
    await prisma.tip.create({
      data: { tripId: tripFukuoka.id, title: tip.title, body: tip.body, isWarning: tip.isWarning || false, order: index },
    });
  }
  for (const [index, tip] of day2Tips.entries()) {
    await prisma.tip.create({
      data: { tripId: tripFukuoka.id, title: tip.title, body: tip.body, isWarning: tip.isWarning || false, order: index + 100 },
    });
  }

  // ==========================================
  // 2. 糸島プラン (itoshima-drive)
  // ==========================================
  const tripItoshima = await prisma.trip.upsert({
    where: { slug: 'itoshima-drive' },
    update: {
      title: '糸島、碧に溶ける休日',
      description: '絶景とカフェを巡る、心洗われるシーサイド・エスケープ',
      startDate: new Date('2026-05-24T00:00:00Z'),
      endDate: new Date('2026-05-24T23:59:59Z'),
    },
    create: {
      slug: 'itoshima-drive',
      title: '糸島、碧に溶ける休日',
      description: '絶景とカフェを巡る、心洗われるシーサイド・エスケープ',
      location: 'Itoshima, Fukuoka',
      startDate: new Date('2026-05-24T00:00:00Z'),
      endDate: new Date('2026-05-24T23:59:59Z'),
      image: 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)',
      accentColor: '#42F5E0',
      status: 'Planning',
    },
  });

  console.log(`✅ Trip created/updated: ${tripItoshima.title}`);

  const di1 = await prisma.day.upsert({
    where: { tripId_dayNumber: { tripId: tripItoshima.id, dayNumber: 1 } },
    update: {
      date: new Date('2026-05-24'),
    },
    create: {
      tripId: tripItoshima.id,
      dayNumber: 1,
      date: new Date('2026-05-24'),
      title: '潮騒に癒やされる一日',
      highlight: '青い海、白い鳥居、お洒落なカフェ。都会の喧騒を離れて、最高の癒やしタイムを。',
    },
  });

  await prisma.event.deleteMany({ where: { dayId: di1.id } });

  for (const [index, event] of itoshimaEvents.entries()) {
    await prisma.event.create({
      data: {
        dayId: di1.id,
        time: event.time,
        type: event.type,
        title: event.title || null,
        desc: event.desc || null,
        tag: event.tag || null,
        tagLabel: event.tagLabel || null,
        locationUrl: event.locationUrl || null,
        foodName: event.foodName || null,
        foodDesc: event.foodDesc || null,
        highlight: event.highlight || null,
        isYatai: event.isYatai || false,
        order: index,
      },
    });
  }

  await prisma.tip.deleteMany({ where: { tripId: tripItoshima.id } });
  for (const [index, tip] of itoshimaTips.entries()) {
    await prisma.tip.create({
      data: { tripId: tripItoshima.id, title: tip.title, body: tip.body, isWarning: tip.isWarning || false, order: index },
    });
  }

  console.log('✅ Seeding finished!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
