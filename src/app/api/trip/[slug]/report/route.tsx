import { NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import React from "react";
import { getTripBySlug } from "@/features/trip/api/tripActions";
import TripReportDocument from "@/features/trip/components/pdf/TripReportDocument";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);

  if (!trip) {
    return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  }

  try {
    const stream = await renderToStream(React.createElement(TripReportDocument, { trip }));
    const response = new NextResponse(stream as never);
    response.headers.set("Content-Type", "application/pdf");
    response.headers.set("Content-Disposition", `attachment; filename="${slug}-report.pdf"`);
    return response;
  } catch (error) {
    console.error("PDF Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
