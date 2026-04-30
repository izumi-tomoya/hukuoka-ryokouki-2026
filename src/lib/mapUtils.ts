/**
 * 渡された URL を適切なマップアプリの形式へ変換する
 * Qiita記事を参考に、iOS/Android ネイティブアプリへの遷移を最適化
 */
export const getMapLink = (url: string): string => {
  if (typeof window === 'undefined') return url;

  const userAgent = navigator.userAgent;
  const isiOS = /iPhone|iPad|iPod/i.test(userAgent);
  const isAndroid = /Android/i.test(userAgent);
  
  if (isiOS) {
    // iOSの場合、Apple Maps (maps://) か Google Maps (comgooglemaps://) かを選択可能
    // ここでは汎用性を考え、標準的な場所検索や経路検索を Apple Maps 形式に変換する
    if (url.includes('google.com/maps/dir')) {
      return url.replace('https://www.google.com/maps/dir/?api=1&', 'maps://?');
    }
    if (url.includes('google.com/maps/search')) {
      return url.replace('https://www.google.com/maps/search/?api=1&query=', 'maps://?q=');
    }
    // Apple Maps の標準リンク
    return url.replace('https://www.google.com/maps', 'maps://');
  }

  if (isAndroid) {
    // Androidの場合、google.navigation: などのインテントも使えるが、
    // 基本的には https:// リンクでアプリが自動起動するため、そのままでも機能する。
    // 明示的にアプリを呼び出す場合は URL を google.navigation: に変換するなどの処理が可能。
    return url;
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
