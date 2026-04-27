/**
 * 渡された URL を適切なマップアプリの形式へ変換する
 */
export const getMapLink = (url: string): string => {
  if (typeof window === 'undefined') return url;

  // iOS/Android ならネイティブアプリへ飛ばす URL Scheme を優先する場合のロジック
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  if (isMobile && url.includes('google.com/maps')) {
    return url.replace('https://www.google.com/maps', 'comgooglemaps://');
  }

  return url;
};

/**
 * 複数の地点（名称または住所）から Google Maps のルート（Directions）URLを生成する
 */
export const getDirectionsUrl = (locations: string[]): string => {
  const validLocs = locations.filter(loc => !!loc && loc.trim().length > 0);
  if (validLocs.length < 2) return validLocs[0] || "";

  // 最初の地点を出発点、最後を目的地、間を経由地とする
  const origin = encodeURIComponent(validLocs[0]);
  const destination = encodeURIComponent(validLocs[validLocs.length - 1]);
  const waypoints = validLocs.slice(1, -1).map(loc => encodeURIComponent(loc)).join('|');

  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypoints ? `&waypoints=${waypoints}` : ""}&travelmode=walking`;
};
