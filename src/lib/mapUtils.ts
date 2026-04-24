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
 * 複数の地点URLから Google Maps のルート（Directions）URLを生成する
 */
export const getDirectionsUrl = (urls: string[]): string => {
  const validUrls = urls.filter(Boolean);
  if (validUrls.length < 2) return validUrls[0] || "";

  // 最初の地点を出発点、最後を目的地、間を経由地とする
  const origin = encodeURIComponent(validUrls[0]);
  const destination = encodeURIComponent(validUrls[validUrls.length - 1]);
  const waypoints = validUrls.slice(1, -1).map(u => encodeURIComponent(u)).join('|');

  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypoints ? `&waypoints=${waypoints}` : ""}&travelmode=walking`;
};
