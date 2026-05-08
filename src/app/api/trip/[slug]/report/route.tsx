import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { getTripBySlug } from "@/features/trip/api/tripActions";
import TripReportDocument, { type ReportTemperatureLog } from "@/features/trip/components/pdf/TripReportDocument";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedMoods = new Set<ReportTemperatureLog["mood"]>(["joy", "calm", "tired", "surprised", "again"]);

function normalizeTemperatureLogs(input: unknown): ReportTemperatureLog[] {
  if (!Array.isArray(input)) return [];

  return input
    .flatMap((item) => {
      if (!item || typeof item !== "object") return [];
      const candidate = item as Record<string, unknown>;
      if (
        typeof candidate.id !== "string" ||
        typeof candidate.eventId !== "string" ||
        typeof candidate.eventTitle !== "string" ||
        typeof candidate.eventTime !== "string" ||
        typeof candidate.mood !== "string" ||
        !allowedMoods.has(candidate.mood as ReportTemperatureLog["mood"]) ||
        typeof candidate.createdAt !== "string"
      ) {
        return [];
      }

      return [{
        id: candidate.id,
        eventId: candidate.eventId,
        eventTitle: candidate.eventTitle,
        eventTime: candidate.eventTime,
        dayNumber: typeof candidate.dayNumber === "number" ? candidate.dayNumber : undefined,
        mood: candidate.mood as ReportTemperatureLog["mood"],
        energy: typeof candidate.energy === "number" ? candidate.energy : 0,
        revisit: Boolean(candidate.revisit),
        note: typeof candidate.note === "string" && candidate.note.trim() ? candidate.note.trim().slice(0, 300) : undefined,
        createdAt: candidate.createdAt,
      } satisfies ReportTemperatureLog];
    });
}

async function buildPdfResponse(
  slug: string,
  trip: NonNullable<Awaited<ReturnType<typeof getTripBySlug>>>,
  temperatureLogs: ReportTemperatureLog[]
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(React.createElement(TripReportDocument, { trip, temperatureLogs }) as any);
  return new Response(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${slug}-report.pdf"`,
    },
  });
}

function errorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

async function renderPdf(slug: string, temperatureLogs: ReportTemperatureLog[] = []) {
  const trip = await getTripBySlug(slug);

  if (!trip) {
    return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  }

  try {
    return await buildPdfResponse(slug, trip, temperatureLogs);
  } catch (error) {
    console.error("PDF Generation Error:", error);
    if (temperatureLogs.length > 0) {
      try {
        const fallback = await buildPdfResponse(slug, trip, []);
        fallback.headers.set("X-Report-Warning", "temperature-logs-skipped");
        return fallback;
      } catch (fallbackError) {
        console.error("PDF Fallback Error:", fallbackError);
        return NextResponse.json(
          {
            error: "Failed to generate PDF",
            detail: errorMessage(fallbackError),
            originalDetail: errorMessage(error),
          },
          { status: 500 }
        );
      }
    }
    return NextResponse.json(
      { error: "Failed to generate PDF", detail: errorMessage(error) },
      { status: 500 }
    );
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  return renderPdf(slug);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const body = await request.json().catch(() => ({}));
    const temperatureLogs = normalizeTemperatureLogs((body as { temperatureLogs?: unknown }).temperatureLogs);
    return renderPdf(slug, temperatureLogs);
  } catch (error) {
    console.error("PDF Request Error:", error);
    return NextResponse.json(
      { error: "Failed to parse PDF payload", detail: errorMessage(error) },
      { status: 400 }
    );
  }
}
