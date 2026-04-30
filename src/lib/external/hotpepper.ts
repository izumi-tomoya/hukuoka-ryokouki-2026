/**
 * ホットペッパー グルメサーチAPI
 * 店名から詳細情報を取得する
 * ※APIキーが必要なため、環境変数を参照
 */

export async function searchGourmet(keyword: string, lat?: number, lng?: number) {
  const apiKey = process.env.HOTPEPPER_API_KEY;
  if (!apiKey) return null;

  try {
    let url = `https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=${apiKey}&keyword=${encodeURIComponent(keyword)}&format=json&count=1`;
    
    if (lat && lng) {
      url += `&lat=${lat}&lng=${lng}&range=3`; // 2000m以内
    }

    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    const shop = data.results.shop?.[0];
    
    if (!shop) return null;

    return {
      name: shop.name,
      address: shop.address,
      logo: shop.logo_image,
      photo: shop.photo.pc.l,
      open: shop.open,
      catch: shop.genre.catch,
      url: shop.urls.pc,
      budget: shop.budget.name,
      barrier_free: shop.barrier_free,
      pet: shop.pet,
      card: shop.card,
      wifi: shop.wifi,
      coupon: shop.coupon_urls.pc,
    };
  } catch (e) {
    console.error("HotPepper Error:", e);
    return null;
  }
}
