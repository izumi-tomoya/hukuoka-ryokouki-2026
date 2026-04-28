import { Ticket, CreditCard, Battery, ShoppingBag, ShieldCheck } from 'lucide-react';
import { MagazineCard } from '@/components/ui/MagazineCard';

export default function EssentialTips() {
  const items = [
    {
      icon: Ticket,
      title: "Mobile Boarding Pass",
      desc: "搭乗券は事前にウォレットに追加するか、スクリーンショットを撮っておくとスムーズです。",
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    {
      icon: CreditCard,
      title: "Transportation",
      desc: "福岡の地下鉄・バスはクレジットカードのタッチ決済が使えます。チャージ不要で非常に便利です。",
      color: "text-emerald-500",
      bg: "bg-emerald-50"
    },
    {
      icon: Battery,
      title: "Mobile Battery",
      desc: "地図やカメラで電池を消耗します。モバイルバッテリーは手荷物に入れて持ち込みましょう。",
      color: "text-amber-500",
      bg: "bg-amber-50"
    },
    {
      icon: ShoppingBag,
      title: "Hands Free",
      desc: "中洲川端や博多駅には大型ロッカーが多いですが、ecbo cloakで事前予約も検討を。",
      color: "text-purple-500",
      bg: "bg-purple-50"
    },
    {
      icon: ShieldCheck,
      title: "Reservation Check",
      desc: "ホテルオークラ福岡や水たき長野など、予約完了メールをすぐに開けるようにしておきましょう。",
      color: "text-rose-500",
      bg: "bg-rose-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, i) => (
        <MagazineCard key={i} padding="md" className="border-stone-100 shadow-sm">
          <div className="flex gap-4 items-start">
            <div className={`p-3 rounded-2xl ${item.bg} ${item.color} shrink-0`}>
              <item.icon size={20} />
            </div>
            <div>
              <h4 className="font-bold text-stone-900 mb-2">{item.title}</h4>
              <p className="text-sm text-stone-500 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        </MagazineCard>
      ))}
    </div>
  );
}
