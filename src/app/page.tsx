import Link from "next/link";
import { Sparkles, MapPin, Calendar, ChevronRight } from "lucide-react";

export default function PortalPage() {
  const trips = [
    {
      id: "fukuoka-2026",
      title: "ふたりの福岡大満喫トリップ",
      date: "2026.05.24 - 05.25",
      location: "Fukuoka, Japan",
      image: "linear-gradient(135deg, #071A3D 0%, #0A2E7A 100%)",
      status: "Upcoming",
      accent: "#F5C842",
    },
    {
      id: "kyoto-future",
      title: "古都を巡る癒やしの旅（計画中）",
      date: "2026 Autumn",
      location: "Kyoto, Japan",
      image: "linear-gradient(135deg, #3D0707 0%, #7A0A0A 100%)",
      status: "Planning",
      accent: "#F5A623",
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf9f6] selection:bg-amber-100">
      {/* Portal Hero */}
      <header className="relative overflow-hidden bg-[#050B17] pt-24 pb-20 px-6">
        <div className="absolute inset-0 bg-linear-to-br from-[#071A3D] via-[#050B17] to-black opacity-90" />
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />
        
        <div className="relative mx-auto max-w-screen-xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
            <Sparkles size={14} className="text-amber-400" />
            <span className="text-[10px] font-black tracking-[4px] text-white/70 uppercase">Our Collection</span>
          </div>
          <h1 className="font-playfair text-[44px] md:text-[64px] font-bold text-white leading-tight mb-4 tracking-tighter">
            Memoir
          </h1>
          <p className="text-white/40 text-[14px] md:text-[16px] font-medium max-w-lg mx-auto leading-relaxed">
            ふたりで巡った場所、これから行きたい場所。<br />
            すべての旅の大切な記録を、ここに。
          </p>
        </div>
      </header>

      {/* Trip Grid */}
      <main className="mx-auto max-w-screen-xl px-6 md:px-12 -mt-10 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {trips.map((trip) => (
            <Link
              key={trip.id}
              href={trip.id === "fukuoka-2026" ? `/trip/${trip.id}` : "#"}
              className="group relative block overflow-hidden rounded-[40px] bg-white shadow-2xl shadow-stone-200/50 transition-all hover:-translate-y-2"
            >
              {/* Card Image/Cover */}
              <div 
                className="relative h-64 w-full"
                style={{ background: trip.image }}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                <div className="absolute top-6 right-6">
                  <span className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-[10px] font-black text-white uppercase tracking-widest">
                    {trip.status}
                  </span>
                </div>
                <div className="absolute bottom-6 left-8 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin size={14} style={{ color: trip.accent }} />
                    <span className="text-[11px] font-bold tracking-widest uppercase opacity-80">{trip.location}</span>
                  </div>
                  <h2 className="font-playfair text-[28px] font-bold leading-tight drop-shadow-md">
                    {trip.title}
                  </h2>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-stone-300" />
                  <span className="text-[14px] font-bold text-stone-500">{trip.date}</span>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-50 text-stone-300 group-hover:bg-[#050B17] group-hover:text-white transition-all shadow-sm">
                  <ChevronRight size={20} />
                </div>
              </div>
            </Link>
          ))}
          
          {/* Add Future Trip Placeholder */}
          <div className="relative overflow-hidden rounded-[40px] border-2 border-dashed border-stone-200 p-12 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-stone-50 transition-all">
            <div className="h-16 w-16 rounded-full bg-stone-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-3xl text-stone-400">+</span>
            </div>
            <h3 className="text-stone-400 font-bold text-[18px]">次の旅を計画する</h3>
            <p className="text-stone-300 text-[12px] mt-2">新しい思い出を書き留めよう</p>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="py-12 border-t border-stone-100 text-center">
        <p className="text-[11px] font-black tracking-[4px] text-stone-300 uppercase">
          &copy; 2026 Memoir — Private Travel Journal
        </p>
      </footer>
    </div>
  );
}
