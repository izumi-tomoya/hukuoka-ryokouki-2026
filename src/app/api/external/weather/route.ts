import { getDetailedWeather } from "@/lib/external/openMeteo";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  
  if (!lat || !lng) return NextResponse.json({ error: "Lat and Lng are required" }, { status: 400 });

  const weather = await getDetailedWeather(parseFloat(lat), parseFloat(lng));
  return NextResponse.json(weather);
}
