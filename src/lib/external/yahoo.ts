/**
 * Yahoo! ローカルサーチAPI
 * 周辺のスポットを検索する
 */

export async function searchNearbySpots(lat: number, lng: number, keyword: string = "") {
  const clientId = process.env.YAHOO_CLIENT_ID;
  if (!clientId) return [];

  try {
    const url = `https://map.yahooapis.jp/search/local/V1/localSearch?appid=${clientId}&lat=${lat}&lon=${lng}&dist=2&query=${encodeURIComponent(keyword)}&output=json&sort=dist`;
    
    const res = await fetch(url);
    if (!res.ok) return [];

    const data = await res.json();
    return data.Feature?.map((f: any) => ({
      name: f.Name,
      address: f.Property.Address,
      category: f.Property.Genre?.[0]?.Name,
      lat: f.Geometry.Coordinates.split(',')[1],
      lng: f.Geometry.Coordinates.split(',')[0],
    })) || [];
  } catch (e) {
    console.error("Yahoo Error:", e);
    return [];
  }
}
