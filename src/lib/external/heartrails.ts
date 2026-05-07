/**
 * HeartRails Express API (完全無料・キー不要)
 * 駅名から座標を取得、または座標から最寄り駅を検索する
 */

export async function getStationCoordinates(stationName: string) {
  try {
    const url = `https://express.heartrails.com/api/json?method=getStations&name=${encodeURIComponent(stationName)}`;
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    const station = data.response.station?.[0];
    
    if (!station) return null;
    
    return {
      lat: parseFloat(station.y),
      lng: parseFloat(station.x),
      prefecture: station.prefecture,
      line: station.line,
    };
  } catch (e) {
    console.error("HeartRails Error:", e);
    return null;
  }
}

export async function getNearestStations(lat: number, lng: number) {
  try {
    const url = `https://express.heartrails.com/api/json?method=getStations&x=${lng}&y=${lat}`;
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    return data.response.station || [];
  } catch {
    return [];
  }
}
