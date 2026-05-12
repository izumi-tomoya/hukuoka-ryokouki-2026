import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getWeatherData } from "@/lib/weather";

export async function GET(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const location = searchParams.get("location") || "Fukuoka";

  try {
    const weather = await getWeatherData(location);

    if (!weather) {
      return NextResponse.json({ error: "Weather unavailable" }, { status: 500 });
    }

    const forecast = weather.forecast.map(
      (day: {
        date: string;
        tempMax: number;
        tempMin: number;
        text: string;
        rainChance: number;
        uvIndex: number;
        windSpeed: number;
        sunrise: string;
        sunset: string;
      }) => ({
        date: day.date,
        temp: {
          max: day.tempMax,
          min: day.tempMin,
        },
        condition: day.text,
        humidity: 0,
        rainChance: day.rainChance,
        uvIndex: day.uvIndex,
        windSpeed: day.windSpeed,
        sunrise: day.sunrise,
        sunset: day.sunset,
      }),
    );

    return NextResponse.json(forecast);
  } catch (error) {
    console.error("Weather API Error:", error);
    return NextResponse.json({ error: "Weather unavailable" }, { status: 500 });
  }
}
