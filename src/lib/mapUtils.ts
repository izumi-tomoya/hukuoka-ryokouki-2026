/**
 * 渡された URL を適切なマップアプリの形式へ変換する
 */
export const getMapLink = (url: string): string => {
  if (typeof window === 'undefined') return url;

  // iOS/Android ならネイティブアプリへ飛ばす URL Scheme を優先
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  if (isMobile) {
    // 経路検索 (directions) の場合
    if (url.includes('google.com/maps/dir')) {
      return url.replace('https://www.google.com/maps/dir/', 'comgooglemaps://?saddr=')
                .replace('&origin=', '')
                .replace('&destination=', '&daddr=')
                .replace('&waypoints=', '&waypoints=');
    }
    // 通常の地図表示
    if (url.includes('google.com/maps')) {
      return url.replace('https://www.google.com/maps', 'comgooglemaps://');
    }
  }

  return url;
};

/**
 * 複数の地点（名称または住所）から Google Maps のルート（Directions）URLを生成する
 */
export const getDirectionsUrl = (locations: string[]): string => {
  const validLocs = locations.filter(loc => !!loc && loc.trim().length > 0);
  if (validLocs.length < 2) return "";

  // 検索精度を上げるため、各地点名に「 福岡」を付与してエンコード
  const formatLoc = (loc: string) => {
    const cleanLoc = loc.replace(/🛬|🏨|🍱|🐟|🍲|🍜|✨|🍰/g, '').trim();
    return encodeURIComponent(`${cleanLoc} 福岡`);
  };

  const origin = formatLoc(validLocs[0]);
  const destination = formatLoc(validLocs[validLocs.length - 1]);
  
  // 3地点以上ある場合は waypoints を使用
  const waypoints = validLocs.slice(1, -1).map(formatLoc).join('|');

  // travelmode は指定しない（Googleマップ側で最適化させる）か、
  // 公共交通機関（transit）をデフォルトにするのが日本の都市部では一般的
  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypoints ? `&waypoints=${waypoints}` : ""}&travelmode=transit`;
};
