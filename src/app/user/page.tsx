import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { UserSettingsForm } from "@/features/user/components/client/UserSettingsForm";
import { LogoutButton } from "@/features/trip/components/client/LogoutButton";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Mail, Map, Calendar, Image as ImageIcon, ChevronRight, Quote } from "lucide-react";
import { UserAvatar } from "@/features/user/components/client/UserAvatar";
import Link from "next/link";

export default async function UserPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // DBから最新のユーザー情報を取得
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!dbUser) {
    redirect("/auth/signin");
  }

  // 統計データの取得
  const tripsCount = await prisma.trip.count();
  const eventsCount = await prisma.event.count();
  const photosCount = await prisma.media.count();

  // 進行中または予定されている旅を取得（クイックアクセス用）
  const activeTrips = await prisma.trip.findMany({
    orderBy: { startDate: 'asc' },
    take: 3,
  });

  return (
    <div className="min-h-screen bg-memoir-bg dark:bg-background pt-24 pb-12 transition-colors">
      <Container>
        <SectionHeader 
          title="User Profile" 
          subtitle="あなたの旅の記録と設定"
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          {/* 左サイドバー: プロフィール概要 & 統計 */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-rose-100 to-amber-50 dark:from-rose-900/20 dark:to-amber-900/10 opacity-50" />
              
              <div className="relative z-10">
                <UserAvatar src={session.user.image || dbUser.image} name={dbUser.name} />
              </div>
              
              <h2 className="text-2xl font-playfair font-black text-zinc-900 dark:text-zinc-100 mt-6 mb-1">{dbUser.name}</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">{dbUser.email}</p>
              
              {dbUser.motto && (
                <div className="relative p-6 bg-stone-50 dark:bg-zinc-800/50 rounded-2xl mb-6 italic text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  <Quote size={16} className="absolute top-3 left-3 text-rose-200 dark:text-rose-800" />
                  「{dbUser.motto}」
                </div>
              )}
              
              <div className="flex flex-wrap gap-2 justify-center">
                {session.user.isAdmin ? (
                  <Badge variant="default" className="bg-rose-500 text-white border-none font-black px-4 py-1.5 rounded-full shadow-sm text-[10px] uppercase tracking-wider">
                    <ShieldCheck size={12} className="mr-1.5" />
                    Administrator
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-stone-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 px-4 py-1.5 rounded-full text-[10px] uppercase tracking-wider">
                    Explorer
                  </Badge>
                )}
              </div>
            </div>

            {/* 統計セクション */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-6 shadow-sm">
              <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-6 px-2 flex items-center justify-between">
                Travel Statistics
                <span className="w-1 h-1 bg-rose-500 rounded-full" />
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center p-4 rounded-2xl bg-stone-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 transition-transform hover:scale-[1.02]">
                  <Map size={18} className="text-rose-500 mb-2" />
                  <span className="text-xl font-playfair font-black text-zinc-900 dark:text-zinc-100">{tripsCount}</span>
                  <span className="text-[9px] font-black text-zinc-400 uppercase mt-1">Trips</span>
                </div>
                <div className="flex flex-col items-center p-4 rounded-2xl bg-stone-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 transition-transform hover:scale-[1.02]">
                  <Calendar size={18} className="text-rose-500 mb-2" />
                  <span className="text-xl font-playfair font-black text-zinc-900 dark:text-zinc-100">{eventsCount}</span>
                  <span className="text-[9px] font-black text-zinc-400 uppercase mt-1">Spots</span>
                </div>
                <div className="flex flex-col items-center p-4 rounded-2xl bg-stone-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 transition-transform hover:scale-[1.02]">
                  <ImageIcon size={18} className="text-rose-500 mb-2" />
                  <span className="text-xl font-playfair font-black text-zinc-900 dark:text-zinc-100">{photosCount}</span>
                  <span className="text-[9px] font-black text-zinc-400 uppercase mt-1">Photos</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[1.5rem] p-3 shadow-sm">
              <LogoutButton>
                <div className="w-full py-4 px-4 rounded-xl bg-stone-50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 transition-all text-center font-black text-xs uppercase tracking-widest border border-zinc-100 dark:border-zinc-800">
                  Logout
                </div>
              </LogoutButton>
            </div>
          </div>

          {/* 右メイン: 進行中の旅 & 設定フォーム */}
          <div className="lg:col-span-8 space-y-8">
            {/* クイックアクセス */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 lg:p-10 shadow-sm">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-8 flex items-center">
                <span className="w-1.5 h-6 bg-rose-500 rounded-full mr-4 shadow-[0_0_10px_rgba(244,63,94,0.3)]"></span>
                Quick Access
              </h3>
              
              <div className="grid gap-4">
                {activeTrips.length > 0 ? activeTrips.map((trip) => (
                  <Link 
                    key={trip.id} 
                    href={`/trip/${trip.slug}`}
                    className="group flex items-center gap-6 p-6 bg-stone-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800 rounded-3xl transition-all hover:bg-white dark:hover:bg-zinc-800 hover:shadow-xl hover:-translate-y-1"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center shrink-0">
                      <Map className="text-rose-500" size={24} />
                    </div>
                    <div className="grow min-w-0">
                      <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 truncate">{trip.title}</h4>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-2 mt-1">
                        <Calendar size={14} />
                        {new Date(trip.startDate).toLocaleDateString()} — {new Date(trip.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-700 flex items-center justify-center shadow-sm border border-zinc-100 dark:border-zinc-600 group-hover:bg-rose-500 group-hover:text-white transition-all">
                      <ChevronRight size={20} />
                    </div>
                  </Link>
                )) : (
                  <p className="text-center py-10 text-zinc-400 italic">作成された旅がまだありません</p>
                )}
              </div>
            </div>

            {/* 設定フォーム */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 lg:p-10 shadow-sm">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-8 flex items-center">
                <span className="w-1.5 h-6 bg-rose-500 rounded-full mr-4 shadow-[0_0_10px_rgba(244,63,94,0.3)]"></span>
                Account Settings
              </h3>
              
              <div className="max-w-xl">
                <UserSettingsForm initialName={dbUser.name} initialMotto={dbUser.motto} />
              </div>
              
              <div className="mt-12 pt-10 border-t border-zinc-100 dark:border-zinc-800">
                <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-6">
                  Account Details
                </h4>
                <div className="max-w-md">
                  <div className="flex items-start gap-4 p-5 rounded-3xl bg-stone-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800">
                    <div className="p-3 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-700">
                      <Mail size={18} className="text-zinc-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-zinc-400 uppercase mb-1">メールアドレス</p>
                      <p className="text-sm text-zinc-900 dark:text-zinc-100 font-bold">{dbUser.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
