import React from "react";
import { Document, Font, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { TemperatureLogEntry } from "@/features/trip/utils/clientTripStorage";
import type { InsightEvent, InsightTip } from "@/features/trip/utils/tripInsights";

const FONT_FAMILY = "IPAexGothic";

Font.register({
  family: FONT_FAMILY,
  fonts: [
    { src: "/fonts/ipaexg.ttf", fontWeight: 400 },
    { src: "/fonts/ipaexg.ttf", fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontFamily: FONT_FAMILY,
    fontSize: 10,
    backgroundColor: "#fffdf8",
    color: "#1f2937",
    lineHeight: 1.5,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 11,
    color: "#6b7280",
    marginBottom: 18,
  },
  section: {
    marginTop: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 8,
    color: "#111827",
  },
  card: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    backgroundColor: "#ffffff",
  },
  eventTitle: {
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 3,
  },
  meta: {
    fontSize: 9,
    color: "#6b7280",
    marginBottom: 4,
  },
  body: {
    fontSize: 10,
    color: "#374151",
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  stat: {
    flexGrow: 1,
    flexBasis: 0,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#ffffff",
  },
  statLabel: {
    fontSize: 9,
    color: "#6b7280",
  },
  statValue: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 700,
  },
});

type Props = {
  trip: {
    title: string;
    location: string;
    startDate: string;
    endDate: string;
    slug: string;
  };
  events: InsightEvent[];
  tips: InsightTip[];
  temperatureLogs: TemperatureLogEntry[];
  notes: Array<{ id: string; body: string; createdAt: string }>;
  reportText: string;
  actualTotal: string;
  settlementText: string;
};

const moodLabels: Record<TemperatureLogEntry["mood"], string> = {
  joy: "楽しい",
  calm: "落ち着く",
  tired: "疲れた",
  surprised: "ときめき",
  again: "また来たい",
};

export default function AssistReportDocument({
  trip,
  events,
  tips,
  temperatureLogs,
  notes,
  reportText,
  actualTotal,
  settlementText,
}: Props) {
  const sortedEvents = [...events].sort((a, b) => a.dayNumber - b.dayNumber || a.time.localeCompare(b.time));

  return (
    <Document title={`${trip.slug}-assist-report`}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{trip.title} Assist Report</Text>
        <Text style={styles.subtitle}>
          {trip.location} / {new Date(trip.startDate).toLocaleDateString("ja-JP")} - {new Date(trip.endDate).toLocaleDateString("ja-JP")}
        </Text>

        <View style={styles.row}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>予定数</Text>
            <Text style={styles.statValue}>{sortedEvents.length}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>温度ログ</Text>
            <Text style={styles.statValue}>{temperatureLogs.length}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>実績支出</Text>
            <Text style={styles.statValue}>{actualTotal}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>要約</Text>
          <View style={styles.card}>
            <Text style={styles.body}>{reportText}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>精算メモ</Text>
          <View style={styles.card}>
            <Text style={styles.body}>{settlementText}</Text>
          </View>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>行動タイムライン</Text>
        {sortedEvents.slice(0, 16).map((event) => (
          <View key={event.id} style={styles.card} wrap={false}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.meta}>Day {event.dayNumber} / {event.time} / {event.type}</Text>
            <Text style={styles.body}>{event.desc || "説明なし"}</Text>
          </View>
        ))}
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>旅の温度ログ</Text>
        {temperatureLogs.length > 0 ? (
          temperatureLogs.slice(0, 18).map((log) => (
            <View key={log.id} style={styles.card} wrap={false}>
              <Text style={styles.eventTitle}>{log.eventTitle}</Text>
              <Text style={styles.meta}>Day {log.dayNumber ?? "-"} / {log.eventTime} / {moodLabels[log.mood]}</Text>
              <Text style={styles.body}>{log.note || "メモなし"}</Text>
            </View>
          ))
        ) : (
          <View style={styles.card}><Text style={styles.body}>温度ログはまだありません。</Text></View>
        )}

        <Text style={[styles.sectionTitle, { marginTop: 14 }]}>共有メモ</Text>
        {notes.length > 0 ? notes.slice(0, 8).map((note) => (
          <View key={note.id} style={styles.card} wrap={false}>
            <Text style={styles.body}>{note.body}</Text>
          </View>
        )) : <View style={styles.card}><Text style={styles.body}>共有メモはまだありません。</Text></View>}
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>注意事項と Tips</Text>
        {tips.length > 0 ? tips.slice(0, 20).map((tip) => (
          <View key={tip.id} style={styles.card} wrap={false}>
            <Text style={styles.eventTitle}>{tip.title}</Text>
            <Text style={styles.body}>{tip.body}</Text>
          </View>
        )) : <View style={styles.card}><Text style={styles.body}>Tips はまだありません。</Text></View>}
      </Page>
    </Document>
  );
}
