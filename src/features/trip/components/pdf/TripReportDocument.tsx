import path from "node:path";
import { Document, Font, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import React from "react";
import type { TripWithRelations } from "@/features/trip/api/tripActions";

export type ReportTemperatureLog = {
  id: string;
  eventId: string;
  eventTitle: string;
  eventTime: string;
  dayNumber?: number;
  mood: "joy" | "calm" | "tired" | "surprised" | "again";
  energy: number;
  revisit: boolean;
  note?: string;
  createdAt: string;
};

const PDF_FONT_FAMILY = "IPAexGothic";
const FONT_PATH = path.join(process.cwd(), "public/fonts/ipaexg.ttf");

// IPAexGothic の TTF を使用（CORS やリンク切れを避けるためローカルに配置）
Font.register({
  family: PDF_FONT_FAMILY,
  fonts: [
    { src: FONT_PATH, fontWeight: 400 },
    { src: FONT_PATH, fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 46,
    paddingHorizontal: 34,
    fontFamily: PDF_FONT_FAMILY,
    backgroundColor: "#fffdf8",
    color: "#1f2937",
    fontSize: 10,
    lineHeight: 1.5,
  },
  coverPage: {
    paddingTop: 42,
    paddingBottom: 42,
    paddingHorizontal: 34,
    fontFamily: PDF_FONT_FAMILY,
    backgroundColor: "#fcf7ef",
    color: "#1f2937",
  },
  coverHero: {
    backgroundColor: "#1f2937",
    borderRadius: 20,
    padding: 28,
    minHeight: 300,
    justifyContent: "space-between",
  },
  eyebrow: {
    fontSize: 10,
    letterSpacing: 2.2,
    textTransform: "uppercase",
    color: "#fbbf24",
  },
  coverTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: "#ffffff",
    lineHeight: 1.2,
    marginTop: 14,
  },
  coverSubtitle: {
    fontSize: 12,
    color: "#fde68a",
    marginTop: 10,
  },
  coverMetaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 18,
  },
  coverMetaCard: {
    width: "48%",
    marginRight: "4%",
    marginBottom: 12,
    padding: 12,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  coverMetaCardRight: {
    marginRight: 0,
  },
  coverMetaLabel: {
    fontSize: 9,
    color: "#d1d5db",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  coverMetaValue: {
    fontSize: 13,
    color: "#ffffff",
    fontWeight: 700,
    marginTop: 6,
  },
  coverSummary: {
    marginTop: 20,
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#fff7ed",
    borderWidth: 1,
    borderColor: "#fed7aa",
  },
  coverSummaryTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: "#9a3412",
    textTransform: "uppercase",
    letterSpacing: 1.8,
  },
  coverSummaryText: {
    marginTop: 8,
    fontSize: 11,
    color: "#7c2d12",
    lineHeight: 1.7,
  },
  contentsCard: {
    marginTop: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    overflow: "hidden",
  },
  contentsHeader: {
    padding: 16,
    backgroundColor: "#111827",
  },
  contentsHeaderTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#ffffff",
  },
  contentsHeaderText: {
    marginTop: 6,
    fontSize: 10,
    color: "#d1d5db",
  },
  contentsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  contentsLeft: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "82%",
  },
  contentsDayBadge: {
    width: 56,
    fontSize: 9,
    color: "#c2410c",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1.4,
  },
  contentsTitleWrap: {
    flexShrink: 1,
  },
  contentsTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: "#111827",
  },
  contentsMeta: {
    marginTop: 3,
    fontSize: 9,
    color: "#6b7280",
  },
  contentsPage: {
    fontSize: 10,
    fontWeight: 700,
    color: "#111827",
  },
  dividerPage: {
    paddingTop: 42,
    paddingBottom: 42,
    paddingHorizontal: 34,
    fontFamily: PDF_FONT_FAMILY,
    backgroundColor: "#fff7ed",
    color: "#1f2937",
  },
  dividerCard: {
    flex: 1,
    borderRadius: 22,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#fed7aa",
    padding: 28,
    justifyContent: "space-between",
    position: "relative",
  },
  bookmarkRibbon: {
    position: "absolute",
    top: 0,
    right: 36,
    width: 28,
    height: 92,
    backgroundColor: "#c2410c",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  dividerEyebrow: {
    fontSize: 10,
    color: "#c2410c",
    textTransform: "uppercase",
    letterSpacing: 1.8,
  },
  dividerTitle: {
    marginTop: 10,
    fontSize: 34,
    fontWeight: 700,
    color: "#111827",
  },
  dividerSubTitle: {
    marginTop: 10,
    fontSize: 14,
    color: "#374151",
  },
  dividerSummary: {
    marginTop: 18,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#fff7ed",
  },
  dividerSummaryText: {
    fontSize: 11,
    color: "#7c2d12",
    lineHeight: 1.7,
  },
  dividerStatsRow: {
    flexDirection: "row",
    marginTop: 20,
  },
  dividerStatCard: {
    flexGrow: 1,
    flexBasis: 0,
    marginRight: 10,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 12,
  },
  dividerStatCardLast: {
    marginRight: 0,
  },
  dividerStatLabel: {
    fontSize: 9,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 1.3,
  },
  dividerStatValue: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: 700,
    color: "#111827",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 12,
  },
  sectionSubTitle: {
    fontSize: 10,
    color: "#6b7280",
    marginBottom: 12,
  },
  dayHeader: {
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  dayKicker: {
    fontSize: 10,
    color: "#c2410c",
    textTransform: "uppercase",
    letterSpacing: 1.8,
  },
  dayTitle: {
    fontSize: 22,
    fontWeight: 700,
    marginTop: 6,
    color: "#111827",
  },
  dayDate: {
    marginTop: 4,
    fontSize: 11,
    color: "#4b5563",
  },
  statsRow: {
    flexDirection: "row",
    marginTop: 12,
  },
  statCard: {
    flexGrow: 1,
    flexBasis: 0,
    marginRight: 10,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 10,
  },
  statCardLast: {
    marginRight: 0,
  },
  statLabel: {
    fontSize: 9,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 1.3,
  },
  statValue: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: 700,
    color: "#111827",
  },
  timelineCard: {
    marginBottom: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  timelineTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  timeBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
    backgroundColor: "#111827",
    color: "#ffffff",
    fontSize: 9,
    fontWeight: 700,
  },
  eventTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: "#111827",
    maxWidth: 360,
  },
  eventType: {
    marginTop: 3,
    fontSize: 9,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  eventMetaBlock: {
    marginTop: 10,
  },
  eventMetaLabel: {
    fontSize: 8,
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  eventMetaText: {
    marginTop: 2,
    fontSize: 10,
    color: "#374151",
    lineHeight: 1.5,
  },
  moodCard: {
    marginTop: 14,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#fbcfe8",
    backgroundColor: "#fff1f2",
  },
  moodCardTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: "#9f1239",
    textTransform: "uppercase",
    letterSpacing: 1.4,
  },
  moodCardText: {
    marginTop: 8,
    fontSize: 10,
    color: "#4c0519",
    lineHeight: 1.6,
  },
  photoPageTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 4,
  },
  photoPageSubtitle: {
    fontSize: 10,
    color: "#6b7280",
    marginBottom: 16,
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  photoCard: {
    width: "48%",
    marginBottom: 16,
  },
  photoImage: {
    width: "100%",
    height: 180,
    borderRadius: 16,
    objectFit: "cover",
    backgroundColor: "#e5e7eb",
  },
  photoCaption: {
    marginTop: 8,
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  photoCaptionTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: "#111827",
  },
  photoCaptionMeta: {
    marginTop: 4,
    fontSize: 9,
    color: "#6b7280",
  },
  photoCaptionText: {
    marginTop: 6,
    fontSize: 9,
    color: "#374151",
    lineHeight: 1.5,
  },
  closingCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 12,
  },
  closingTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 8,
  },
  closingBody: {
    fontSize: 10,
    color: "#374151",
    lineHeight: 1.6,
  },
  listItem: {
    marginBottom: 8,
    fontSize: 10,
    color: "#374151",
    lineHeight: 1.6,
  },
  footer: {
    position: "absolute",
    bottom: 18,
    left: 34,
    right: 34,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#9ca3af",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 8,
  },
});

type TripDay = TripWithRelations["days"][number];
type TripEvent = TripDay["events"][number];

function formatDate(value: string | Date, options?: Intl.DateTimeFormatOptions) {
  return new Date(value).toLocaleDateString("ja-JP", options);
}

function formatCurrency(value: number) {
  return `¥${value.toLocaleString("ja-JP")}`;
}

function getEventTitle(event: TripEvent) {
  return event.title || event.foodName || "Untitled Event";
}

function getEventDescription(event: TripEvent) {
  return event.desc || event.foodDesc || event.highlight || event.notes || "記録メモなし";
}

function getEventLocation(event: TripEvent, day: TripDay, trip: TripWithRelations) {
  return event.title || event.foodName || day.title || trip.location;
}

function getEventTypeLabel(type: string) {
  const labels: Record<string, string> = {
    food: "Food",
    transport: "Transport",
    sightseeing: "Sightseeing",
    hotel: "Hotel",
    shopping: "Shopping",
    surprise: "Surprise",
    basic: "Basic",
  };

  return labels[type] || type;
}

function buildTripSummary(trip: TripWithRelations) {
  const eventCount = trip.days.reduce((sum, day) => sum + day.events.length, 0);
  const photoCount = trip.days.reduce(
    (sum, day) => sum + day.events.reduce((eventSum, event) => eventSum + event.photos.length, 0),
    0,
  );
  const actualTotal = trip.days.reduce(
    (sum, day) => sum + day.events.reduce((eventSum, event) => eventSum + (event.actualExpense || 0), 0),
    0,
  );

  return { eventCount, photoCount, actualTotal };
}

function buildPhotoMoments(day: TripDay, trip: TripWithRelations) {
  return day.events.flatMap((event) =>
    event.photos.map((photo) => ({
      id: photo.id,
      url: photo.url,
      title: getEventTitle(event),
      time: event.time,
      date: formatDate(day.date, { month: "long", day: "numeric", weekday: "short" }),
      location: getEventLocation(event, day, trip),
      description: getEventDescription(event),
    })),
  );
}

function chunkPhotos<T>(items: T[], size: number) {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

function estimateDayStartPages(trip: TripWithRelations) {
  let page = 3;
  return trip.days.map((day) => {
    const photoPages = Math.max(1, Math.ceil(buildPhotoMoments(day, trip).length / 4));
    const current = page;
    page += 2 + photoPages;
    return {
      id: day.id,
      page: current,
      photoPages,
    };
  });
}

const moodLabels: Record<ReportTemperatureLog["mood"], string> = {
  joy: "楽しい",
  calm: "落ち着く",
  tired: "疲れた",
  surprised: "ときめき",
  again: "また来たい",
};

function buildDayTemperatureLogs(logs: ReportTemperatureLog[], dayNumber: number) {
  return logs.filter((log) => log.dayNumber === dayNumber).sort((a, b) => a.eventTime.localeCompare(b.eventTime));
}

export default function TripReportDocument({
  trip,
  temperatureLogs = [],
}: {
  trip: TripWithRelations;
  temperatureLogs?: ReportTemperatureLog[];
}) {
  const summary = buildTripSummary(trip);
  const contents = estimateDayStartPages(trip);

  return (
    <Document title={`${trip.title} Album`}>
      <Page size="A4" style={styles.coverPage}>
        <View style={styles.coverHero}>
          <View>
            <Text style={styles.eyebrow}>Travel Album PDF</Text>
            <Text style={styles.coverTitle}>{trip.title}</Text>
            <Text style={styles.coverSubtitle}>
              {trip.location} / {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            </Text>

            <View style={styles.coverMetaGrid}>
              <View style={styles.coverMetaCard}>
                <Text style={styles.coverMetaLabel}>Days</Text>
                <Text style={styles.coverMetaValue}>{trip.days.length} days</Text>
              </View>
              <View style={[styles.coverMetaCard, styles.coverMetaCardRight]}>
                <Text style={styles.coverMetaLabel}>Moments</Text>
                <Text style={styles.coverMetaValue}>{summary.eventCount} events</Text>
              </View>
              <View style={styles.coverMetaCard}>
                <Text style={styles.coverMetaLabel}>Photos</Text>
                <Text style={styles.coverMetaValue}>{summary.photoCount} shots</Text>
              </View>
              <View style={[styles.coverMetaCard, styles.coverMetaCardRight]}>
                <Text style={styles.coverMetaLabel}>Actual Spend</Text>
                <Text style={styles.coverMetaValue}>{formatCurrency(summary.actualTotal)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.coverSummary}>
            <Text style={styles.coverSummaryTitle}>Album Summary</Text>
            <Text style={styles.coverSummaryText}>
              旅程、写真、支出、メモをひとつのアルバムに統合した。各日ごとに「いつ・どこで・何をしたか」を追える構成で、
              あとから見返しても流れが崩れないように整理している。
            </Text>
          </View>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Contents</Text>
        <Text style={styles.sectionSubTitle}>冊子として読み返しやすいように章立てした。</Text>

        <View style={styles.contentsCard}>
          <View style={styles.contentsHeader}>
            <Text style={styles.contentsHeaderTitle}>旅のしおり</Text>
            <Text style={styles.contentsHeaderText}>各 Day は中表紙、行動タイムライン、写真ページで構成。</Text>
          </View>

          {trip.days.map((day, index) => {
            const dayPhotos = buildPhotoMoments(day, trip);
            return (
              <View key={day.id} style={styles.contentsRow}>
                <View style={styles.contentsLeft}>
                  <Text style={styles.contentsDayBadge}>Day {day.dayNumber}</Text>
                  <View style={styles.contentsTitleWrap}>
                    <Text style={styles.contentsTitle}>{day.title || trip.location}</Text>
                    <Text style={styles.contentsMeta}>
                      {formatDate(day.date, { month: "long", day: "numeric", weekday: "short" })} / {day.events.length}{" "}
                      events / {dayPhotos.length} photos
                    </Text>
                  </View>
                </View>
                <Text style={styles.contentsPage}>P.{contents[index]?.page ?? "-"}</Text>
              </View>
            );
          })}

          <View style={styles.contentsRow}>
            <View style={styles.contentsLeft}>
              <Text style={styles.contentsDayBadge}>Last</Text>
              <View style={styles.contentsTitleWrap}>
                <Text style={styles.contentsTitle}>Closing Notes</Text>
                <Text style={styles.contentsMeta}>Tips と Gourmet Awards のまとめ</Text>
              </View>
            </View>
            <Text style={styles.contentsPage}>Final</Text>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text>{trip.title}</Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>

      {trip.days.map((day) => {
        const dayPhotos = buildPhotoMoments(day, trip);
        const photoChunks = chunkPhotos(dayPhotos, 4);
        const actualTotal = day.events.reduce((sum, event) => sum + (event.actualExpense || 0), 0);
        const plannedTotal = day.events.reduce((sum, event) => sum + (event.plannedBudget || 0), 0);
        const leadEvent = day.events[0];
        const dayTemperatureLogs = buildDayTemperatureLogs(temperatureLogs, day.dayNumber);

        return (
          <React.Fragment key={day.id}>
            <Page size="A4" style={styles.dividerPage}>
              <View style={styles.dividerCard}>
                <View style={styles.bookmarkRibbon} />
                <View>
                  <Text style={styles.dividerEyebrow}>Day Chapter</Text>
                  <Text style={styles.dividerTitle}>Day {day.dayNumber}</Text>
                  <Text style={styles.dividerSubTitle}>{day.title || trip.location}</Text>
                  <Text style={[styles.dayDate, { marginTop: 12 }]}>
                    {formatDate(day.date, { year: "numeric", month: "long", day: "numeric", weekday: "long" })}
                  </Text>

                  <View style={styles.dividerSummary}>
                    <Text style={styles.dividerSummaryText}>
                      {leadEvent
                        ? `${leadEvent.time} に ${getEventTitle(leadEvent)} から始まる一日。`
                        : "この日の記録。"}
                      {day.highlight ? ` ハイライト: ${day.highlight}` : ""}
                    </Text>
                  </View>
                  {dayTemperatureLogs.length > 0 && (
                    <View style={styles.dividerSummary}>
                      <Text style={styles.dividerSummaryText}>
                        気分ログ: {dayTemperatureLogs[0].eventTime} の {dayTemperatureLogs[0].eventTitle} で「
                        {moodLabels[dayTemperatureLogs[0].mood]}」。
                        {dayTemperatureLogs[0].note ? ` ${dayTemperatureLogs[0].note}` : ""}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.dividerStatsRow}>
                  <View style={styles.dividerStatCard}>
                    <Text style={styles.dividerStatLabel}>Events</Text>
                    <Text style={styles.dividerStatValue}>{day.events.length}</Text>
                  </View>
                  <View style={styles.dividerStatCard}>
                    <Text style={styles.dividerStatLabel}>Photos</Text>
                    <Text style={styles.dividerStatValue}>{dayPhotos.length}</Text>
                  </View>
                  <View style={[styles.dividerStatCard, styles.dividerStatCardLast]}>
                    <Text style={styles.dividerStatLabel}>Budget</Text>
                    <Text style={styles.dividerStatValue}>
                      {formatCurrency(actualTotal)} / {formatCurrency(plannedTotal)}
                    </Text>
                  </View>
                </View>
              </View>
            </Page>

            <Page size="A4" style={styles.page} wrap>
              <View style={styles.dayHeader}>
                <Text style={styles.dayKicker}>Day {day.dayNumber}</Text>
                <Text style={styles.dayTitle}>{day.title || "Travel Itinerary"}</Text>
                <Text style={styles.dayDate}>
                  {formatDate(day.date, { year: "numeric", month: "long", day: "numeric", weekday: "long" })}
                </Text>

                <View style={styles.statsRow}>
                  <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Events</Text>
                    <Text style={styles.statValue}>{day.events.length}</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Photos</Text>
                    <Text style={styles.statValue}>{dayPhotos.length}</Text>
                  </View>
                  <View style={[styles.statCard, styles.statCardLast]}>
                    <Text style={styles.statLabel}>Spend</Text>
                    <Text style={styles.statValue}>{formatCurrency(actualTotal)}</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.sectionTitle}>Timeline</Text>
              <Text style={styles.sectionSubTitle}>その日に起きたことを、時間順に整理。</Text>

              {day.events.map((event) => (
                <View key={event.id} style={styles.timelineCard} wrap={false}>
                  <View style={styles.timelineTop}>
                    <View>
                      <Text style={styles.eventTitle}>{getEventTitle(event)}</Text>
                      <Text style={styles.eventType}>{getEventTypeLabel(event.type)}</Text>
                    </View>
                    <Text style={styles.timeBadge}>{event.time}</Text>
                  </View>

                  <View style={styles.eventMetaBlock}>
                    <Text style={styles.eventMetaLabel}>Where</Text>
                    <Text style={styles.eventMetaText}>{getEventLocation(event, day, trip)}</Text>
                  </View>

                  <View style={styles.eventMetaBlock}>
                    <Text style={styles.eventMetaLabel}>What</Text>
                    <Text style={styles.eventMetaText}>{getEventDescription(event)}</Text>
                  </View>

                  <View style={styles.eventMetaBlock}>
                    <Text style={styles.eventMetaLabel}>Budget</Text>
                    <Text style={styles.eventMetaText}>
                      予定 {formatCurrency(event.plannedBudget || 0)} / 実績 {formatCurrency(event.actualExpense || 0)}
                    </Text>
                  </View>
                </View>
              ))}

              {dayTemperatureLogs.length > 0 && (
                <View style={styles.moodCard}>
                  <Text style={styles.moodCardTitle}>Day {day.dayNumber} Temperature Log</Text>
                  {dayTemperatureLogs.slice(0, 5).map((log) => (
                    <Text key={log.id} style={styles.moodCardText}>
                      {log.eventTime} / {log.eventTitle} / {moodLabels[log.mood]}
                      {log.revisit ? " / また来たい" : ""}
                      {log.note ? ` / ${log.note}` : ""}
                    </Text>
                  ))}
                </View>
              )}

              <View style={styles.footer} fixed>
                <Text>{trip.title}</Text>
                <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
              </View>
            </Page>

            {Math.max(photoChunks.length, 1) > 0 &&
              (photoChunks.length > 0 ? photoChunks : [[]]).map((chunk) => (
                <Page
                  size="A4"
                  style={styles.page}
                  key={`${day.id}-photos-${chunk[0]?.id || "empty"}`}
                >
                  <Text style={styles.photoPageTitle}>Day {day.dayNumber} Photo Album</Text>
                  <Text style={styles.photoPageSubtitle}>
                    {day.title || trip.location} /{" "}
                    {formatDate(day.date, { month: "long", day: "numeric", weekday: "short" })}
                  </Text>

                  {chunk.length > 0 ? (
                    <View style={styles.photoGrid}>
                      {chunk.map((photo) => (
                        <View style={styles.photoCard} key={photo.id} wrap={false}>
                          {/* eslint-disable-next-line jsx-a11y/alt-text */}
                          <Image src={photo.url} style={styles.photoImage} />
                          <View style={styles.photoCaption}>
                            <Text style={styles.photoCaptionTitle}>{photo.title}</Text>
                            <Text style={styles.photoCaptionMeta}>
                              {photo.date} / {photo.time} / {photo.location}
                            </Text>
                            <Text style={styles.photoCaptionText}>{photo.description}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <View style={styles.closingCard}>
                      <Text style={styles.closingBody}>この日はまだ写真が登録されていない。</Text>
                    </View>
                  )}

                  <View style={styles.footer} fixed>
                    <Text>{trip.title}</Text>
                    <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
                  </View>
                </Page>
              ))}
          </React.Fragment>
        );
      })}

      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Closing Notes</Text>
        <Text style={styles.sectionSubTitle}>旅の終わりに残しておきたい情報。</Text>

        <View style={styles.closingCard}>
          <Text style={styles.closingTitle}>Travel Tips</Text>
          {trip.tips.length > 0 ? (
            trip.tips.slice(0, 8).map((tip) => (
              <Text key={tip.id} style={styles.listItem}>
                ・{tip.title} {tip.venue ? `@ ${tip.venue}` : ""} {tip.body}
              </Text>
            ))
          ) : (
            <Text style={styles.closingBody}>Tips はまだ登録されていない。</Text>
          )}
        </View>

        <View style={styles.closingCard}>
          <Text style={styles.closingTitle}>Gourmet Awards</Text>
          {trip.gourmetAwards.length > 0 ? (
            trip.gourmetAwards.slice(0, 6).map((award) => (
              <Text key={award.id} style={styles.listItem}>
                ・{award.category}: {award.title} {award.comment ? `- ${award.comment}` : ""}
              </Text>
            ))
          ) : (
            <Text style={styles.closingBody}>アワードはまだ未登録。</Text>
          )}
        </View>

        <View style={styles.footer} fixed>
          <Text>{trip.title}</Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
