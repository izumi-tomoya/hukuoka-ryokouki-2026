export async function getWeatherData(location: string) {
  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) return null;

  try {
    // WeatherAPIを使用して予報データを取得（最大14日分）
    const res = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(location)}&days=14&aqi=no&lang=ja`
    );
    
    if (!res.ok) {
      console.error(`Weather API Error for ${location}:`, await res.text());
      return null;
    }
    
    const data = await res.json();
    
    // 現在の天気に基いてテーマステータスを決定
    const conditionTextEng = data.current.condition.text.toLowerCase();
    let themeStatus = 'cloudy';
    if (conditionTextEng.includes('sun') || conditionTextEng.includes('clear')) {
      themeStatus = 'sunny';
    } else if (conditionTextEng.includes('rain') || conditionTextEng.includes('drizzle')) {
      themeStatus = 'rainy';
    } else if (conditionTextEng.includes('snow')) {
      themeStatus = 'snowy';
    }

    // 予報データをマッピング
    const forecast = data.forecast.forecastday.map((day: {
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        condition: { text: string };
      };
    }) => {
      const text = day.day.condition.text;
      const icon = text.includes('晴') ? '☀️' : 
                   text.includes('雨') ? '🌧️' : 
                   text.includes('雪') ? '❄️' : '☁️';
      
      return {
        date: day.date,
        tempMax: Math.round(day.day.maxtemp_c),
        tempMin: Math.round(day.day.mintemp_c),
        condition: icon,
        text: text,
      };
    });

    return {
      current: {
        temp: Math.round(data.current.temp_c),
        condition: forecast[0].condition,
        text: data.current.condition.text,
      },
      forecast,
      themeStatus,
    };
  } catch (e) {
    console.error("Weather API Exception:", e);
    return null;
  }
}
