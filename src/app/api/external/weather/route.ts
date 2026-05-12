import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDetailedWeather } from "@/lib/external/openMeteo";

export async function GET(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) return NextResponse.json({ error: "Lat and Lng are required" }, { status: 400 });

  const weather = await getDetailedWeather(parseFloat(lat), parseFloat(lng));
  return NextResponse.json(weather);
}
