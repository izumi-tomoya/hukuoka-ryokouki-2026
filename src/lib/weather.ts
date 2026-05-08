import { getLocationCoordinates } from "@/features/trip/utils/locationCatalog";

/**
 * WMO Weather interpretation codes (WW) 
 * https://open-meteo.com/en/docs
 */
const WMO_CODE_MAP: Record<number, { condition: string; text: string; theme: string }> = {
  0: { condition: '☀️', text: '快晴', theme: 'sunny' },
  1: { condition: '☀️', text: '晴れ', theme: 'sunny' },
  2: { condition: '☁️', text: '時々曇り', theme: 'cloudy' },
  3: { condition: '☁️', text: 'くもり', theme: 'cloudy' },
  45: { condition: '☁️', text: '霧', theme: 'cloudy' },
  48: { condition: '☁️', text: '霧', theme: 'cloudy' },
  51: { condition: '🌧️', text: '小雨', theme: 'rainy' },
  53: { condition: '🌧️', text: '雨', theme: 'rainy' },
  55: { condition: '🌧️', text: '強い雨', theme: 'rainy' },
  61: { condition: '🌧️', text: '小雨', theme: 'rainy' },
  63: { condition: '🌧️', text: '雨', theme: 'rainy' },
  65: { condition: '🌧️', text: '強い雨', theme: 'rainy' },
  71: { condition: '❄️', text: '小雪', theme: 'snowy' },
  73: { condition: '❄️', text: '雪', theme: 'snowy' },
  75: { condition: '❄️', text: '強い雪', theme: 'snowy' },
  80: { condition: '🌧️', text: 'にわか雨', theme: 'rainy' },
  81: { condition: '🌧️', text: 'にわか雨', theme: 'rainy' },
  82: { condition: '🌧️', text: '激しい雨', theme: 'rainy' },
  95: { condition: '⛈️', text: '雷雨', theme: 'rainy' },
};

export async function getWeatherData(location: string) {
  const coords = getLocationCoordinates(location) || [33.5902, 130.4017];
  const [lat, lng] = coords;

  try {
    // 詳細な情報を取得するために daily パラメータを増強
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,windspeed_10m_max,sunrise,sunset&timezone=Asia%2FTokyo&forecast_days=14`;
    
    const res = await fetch(url);
    if (!res.ok) return null;
    
    const data = await res.json();
    const currentCode = data.current_weather.weathercode;
    const currentInfo = WMO_CODE_MAP[currentCode] || { condition: '☁️', text: '不明', theme: 'cloudy' };

    const forecast = data.daily.time.map((date: string, index: number) => {
      const code = data.daily.weathercode[index];
      const info = WMO_CODE_MAP[code] || { condition: '☁️', text: '不明', theme: 'cloudy' };
      
      return {
        date,
        tempMax: Math.round(data.daily.temperature_2m_max[index]),
        tempMin: Math.round(data.daily.temperature_2m_min[index]),
        condition: info.condition,
        text: info.text,
        rainChance: data.daily.precipitation_probability_max[index],
        uvIndex: Math.round(data.daily.uv_index_max[index]),
        windSpeed: Math.round(data.daily.windspeed_10m_max[index]),
        sunrise: data.daily.sunrise[index].split('T')[1],
        sunset: data.daily.sunset[index].split('T')[1],
      };
    });

    return {
      current: {
        temp: Math.round(data.current_weather.temperature),
        condition: currentInfo.condition,
        text: currentInfo.text,
        windspeed: data.current_weather.windspeed,
      },
      forecast,
      themeStatus: currentInfo.theme,
    };
  } catch (e) {
    console.error("Open-Meteo API Exception:", e);
    return null;
  }
}
