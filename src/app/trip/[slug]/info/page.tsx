import { CheckCircle2, Luggage, Wallet, Phone, ClipboardList } from 'lucide-react';
import CategoryTabs from '@/components/trip/CategoryTabs';
import { cookies } from 'next/headers';
import { SECRET_MODE_COOKIE_NAME } from '@/config/constants';

export default async function TripInfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const isSecretMode = cookieStore.get(SECRET_MODE_COOKIE_NAME)?.value === "true";

  const categories = [
    {
      title: "必須の貴重品",
      icon: Wallet,
      items: ["航空券/チケット", "財布・クレジットカード", "保険証/身分証明書", "現金(予備含む)"],
    },
    {
      title: "衣類・身だしなみ",
      icon: Luggage,
      items: ["着替え(2日分)", "歩きやすい靴", "羽織もの(体温調節用)", "洗面用具/メイク道具"],
    },
    {
      title: "デジタル・ツール",
      icon: Phone,
      items: ["スマートフォン", "モバイルバッテリー", "充電ケーブル", "イヤホン"],
    },
    {
      title: "その他",
      icon: ClipboardList,
      items: ["常備薬/絆創膏", "折りたたみ傘", "エコバッグ", "雨具/ハンカチ"],
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <header className="px-6 pt-16 pb-8 mx-auto max-w-5xl">
        <CategoryTabs slug={slug} activePath={`/trip/${slug}/info`} isSecretMode={isSecretMode} />
        
        <div className="mt-12 text-center md:text-left">
          <h1 className="font-playfair text-5xl font-extrabold text-stone-900 mb-4 tracking-tight">Trip Essentials</h1>
          <p className="text-stone-400 text-xs font-bold tracking-[0.2em] uppercase">忘れ物はない？二人の旅を完璧に楽しむためのリスト</p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat, i) => (
            <div key={i} className="rounded-[2.5rem] bg-white p-10 shadow-sm border border-rose-50">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 shadow-sm">
                  <cat.icon size={22} />
                </div>
                <h2 className="text-xl font-bold text-stone-900">{cat.title}</h2>
              </div>
              <ul className="space-y-4">
                {cat.items.map((item, j) => (
                  <li key={j} className="flex items-center gap-4 text-stone-600 font-medium">
                    <div className="h-5 w-5 rounded-full bg-rose-50 flex items-center justify-center">
                      <CheckCircle2 size={14} className="text-rose-400" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
