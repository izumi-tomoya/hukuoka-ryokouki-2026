import { NextResponse } from 'next/server';

interface WeatherApiDay {
  date: string;
  day: {
    maxtemp_c: number;
    mintemp_c: number;
    condition: { text: string };
    uv: number;
    avghumidity: number;
    daily_chance_of_rain: number;
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location') || 'Fukuoka';
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'API Key not configured' }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(location)}&days=3&aqi=no&alerts=no`
    );
    
    if (!res.ok) throw new Error('Failed to fetch weather forecast');
    
    const data = await res.json();
    
    // 型定義されたオブジェクトを使用してマップ
    const forecast = data.forecast.forecastday.map((day: WeatherApiDay) => ({
      date: day.date,
      temp: { 
        max: Math.round(day.day.maxtemp_c), 
        min: Math.round(day.day.mintemp_c) 
      },
      condition: day.day.condition.text,
      uvIndex: Math.round(day.day.uv),
      humidity: Math.round(day.day.avghumidity),
      rainChance: day.day.daily_chance_of_rain
    }));

    return NextResponse.json(forecast);
  } catch (error) {
    console.error('Weather API Error:', error);
    return NextResponse.json({ error: 'Weather unavailable' }, { status: 500 });
  }
}
