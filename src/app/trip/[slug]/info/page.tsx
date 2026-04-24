import { CheckCircle2, Luggage, Wallet, Phone, ClipboardList } from 'lucide-react';
import TripLayout from '@/components/trip/TripLayout';
import { Container } from '@/components/ui/Container';
import { MagazineCard } from '@/components/ui/MagazineCard';
import { auth } from '@/lib/auth';

export default async function TripInfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth();
  const isAdmin = !!session?.user?.isAdmin;

  const categories = [
    { title: "必須の貴重品", icon: Wallet, items: ["航空券/チケット", "財布・クレジットカード", "保険証/身分証明書", "現金(予備含む)"] },
    { title: "衣類・身だしなみ", icon: Luggage, items: ["着替え(2日分)", "歩きやすい靴", "羽織もの(体温調節用)", "洗面用具/メイク道具"] },
    { title: "デジタル・ツール", icon: Phone, items: ["スマートフォン", "モバイルバッテリー", "充電ケーブル", "イヤホン"] },
    { title: "その他", icon: ClipboardList, items: ["常備薬/絆創膏", "折りたたみ傘", "エコバッグ", "雨具/ハンカチ"] },
  ];

  return (
    <TripLayout 
      slug={slug} 
      activePath={`/trip/${slug}/info`} 
      isSecretMode={isAdmin} 
      title="Trip Essentials"
      subtitle="忘れ物はない？二人の旅を完璧に楽しむためのリスト"
    >
      <Container className="pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat, i) => (
            <MagazineCard key={i} className="flex flex-col gap-8">
              <div className="flex items-center gap-4">
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
            </MagazineCard>
          ))}
        </div>
      </Container>
    </TripLayout>
  );
}
