export async function getWeatherData(location: string) {
  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) return null;

  try {
    // WeatherAPIを使用して天気データを取得
    const res = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(location)}&aqi=no&lang=ja`
    );
    
    if (!res.ok) {
      console.error(`Weather API Error for ${location}:`, await res.text());
      return null;
    }
    
    const data = await res.json();
    
    // 天気テキストに基づいてアイコンをマッピング
    const conditionText = data.current.condition.text;
    const icon = conditionText.includes('晴') ? '☀️' : 
                 conditionText.includes('雨') ? '🌧️' : 
                 conditionText.includes('雪') ? '❄️' : '☁️';

    return {
      temp: Math.round(data.current.temp_c),
      condition: icon,
    };
  } catch (e) {
    console.error("Weather API Exception:", e);
    return null;
  }
}
