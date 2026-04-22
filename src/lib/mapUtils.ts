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
