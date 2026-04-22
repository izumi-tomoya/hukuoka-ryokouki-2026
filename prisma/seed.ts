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
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Start seeding...');

  // ==========================================
  // 1. 福岡プラン (fukuoka-2026)
  // ==========================================
  const tripFukuoka = await prisma.trip.upsert({
    where: { slug: 'fukuoka-2026' },
    update: {
      title: 'ふたりの福岡大満喫トリップ',
      description: '美味しい博多グルメと歴史を巡る1泊2日',
    },
    create: {
      slug: 'fukuoka-2026',
      title: 'ふたりの福岡大満喫トリップ',
      description: '美味しい博多グルメと歴史を巡る1泊2日',
      location: 'Fukuoka, Japan',
      startDate: new Date('2026-05-24T00:00:00Z'),
      endDate: new Date('2026-05-25T23:59:59Z'),
      image: 'linear-gradient(135deg, #071A3D 0%, #0A2E7A 100%)',
      accentColor: '#F5C842',
      status: 'Upcoming',
    },
  });

  console.log(`✅ Trip created/updated: ${tripFukuoka.title}`);

  const d1 = await prisma.day.upsert({
    where: { tripId_dayNumber: { tripId: tripFukuoka.id, dayNumber: 1 } },
    update: {},
    create: {
      tripId: tripFukuoka.id,
      dayNumber: 1,
      date: new Date('2026-05-24'),
      title: '⛩️ 太宰府 → 博多グルメ → 屋台ハシゴ！',
      highlight: '千年の歴史が息づく太宰府を参拝し、博多グルメを満喫！夜は中洲の屋台街でシメのラーメンまで、博多の魅力をぎゅっと詰め込んだ最高の一日🔥',
    },
  });

  const d2 = await prisma.day.upsert({
    where: { tripId_dayNumber: { tripId: tripFukuoka.id, dayNumber: 2 } },
    update: {},
    create: {
      tripId: tripFukuoka.id,
      dayNumber: 2,
      date: new Date('2026-05-25'),
      title: '🍲 水炊き & サプライズ',
      highlight: '伝統の水炊きに舌鼓。午後は海辺の公園を散策し、旅のフィナーレは福岡タワーからの絶景！心に残る最高の思い出を✨',
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
          create: event.yataiStops.map((stop, sIndex) => ({
            time: stop.time,
            stop: stop.stop,
            desc: stop.desc,
            order: sIndex,
          }))
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
      title: '🌊 糸島シーサイド・ドライブ',
      description: '絶景とカフェを巡る最高の休日',
      startDate: new Date('2026-05-24T00:00:00Z'),
      endDate: new Date('2026-05-24T23:59:59Z'),
    },
    create: {
      slug: 'itoshima-drive',
      title: '🌊 糸島シーサイド・ドライブ',
      description: '絶景とカフェを巡る最高の休日',
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
      title: '🚙 海風を感じる糸島一周旅',
      highlight: '青い海、白い鳥居、オシャレなカフェ。都会の喧騒を離れて、最高の癒やしタイムを。',
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
