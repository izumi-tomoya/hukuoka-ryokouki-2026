/**
 * Open-Meteo API (完全無料・キー不要)
 * 緯度・経度から詳細な天気予報を取得する
 */
export async function getDetailedWeather(lat: number, lng: number) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,precipitation_probability,uv_index&timezone=Asia%2FTokyo`;
    
    const res = await fetch(url);
    if (!res.ok) return null;
    
    const data = await res.json();
    
    // WMO Weather interpretation codes (WW) を簡易変換
    const getWeatherIcon = (code: number) => {
      if (code <= 3) return '☀️';
      if (code <= 48) return '☁️';
      if (code <= 67) return '🌧️';
      if (code <= 77) return '❄️';
      return '⛈️';
    };

    return {
      current: {
        temp: Math.round(data.current_weather.temperature),
        condition: getWeatherIcon(data.current_weather.weathercode),
        windspeed: data.current_weather.windspeed,
      },
      hourly: data.hourly, // 降水確率などの詳細
    };
  } catch (e) {
    console.error("Open-Meteo Error:", e);
    return null;
  }
}
