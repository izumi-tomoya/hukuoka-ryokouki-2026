import { NextResponse } from "next/server";
import { getWeatherData } from "@/lib/weather";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get("location") || "Fukuoka";
  const endDate = searchParams.get("endDate");

  try {
    const weather = await getWeatherData(location);

    if (!weather) {
      return NextResponse.json({ error: "Weather unavailable" }, { status: 500 });
    }

    let forecast = weather.forecast.map(
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

    // 帰着日が指定されている場合、その日までの予報に絞り込む
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      forecast = forecast.filter((day: { date: string }) => new Date(day.date) <= end);
    }

    return NextResponse.json(forecast);
  } catch (error) {
    console.error("Weather API Error:", error);
    return NextResponse.json({ error: "Weather unavailable" }, { status: 500 });
  }
}
