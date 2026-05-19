import { Calendar, ChevronRight, Image as ImageIcon, Mail, Map as MapIcon, Quote, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { LogoutButton } from "@/features/trip/components/client/LogoutButton";
import { UserAvatar } from "@/features/user/components/client/UserAvatar";
import { UserSettingsForm } from "@/features/user/components/client/UserSettingsForm";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
    orderBy: { startDate: "asc" },
    take: 3,
  });

  return (
    <div className="bg-memoir-bg dark:bg-background min-h-screen pt-24 pb-12 transition-colors">
      <Container>
        <SectionHeader title="User Profile" subtitle="あなたの旅の記録と設定" />

        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          {/* 左サイドバー: プロフィール概要 & 統計 */}
          <div className="space-y-6 lg:col-span-4">
            <div className="relative flex flex-col items-center overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="absolute top-0 left-0 h-24 w-full bg-gradient-to-br from-rose-100 to-amber-50 opacity-50 dark:from-rose-900/20 dark:to-amber-900/10" />

              <div className="relative z-10">
                <UserAvatar src={session.user.image || dbUser.image} name={dbUser.name} />
              </div>

              <h2 className="font-playfair mt-6 mb-1 text-2xl font-black text-zinc-900 dark:text-zinc-100">
                {dbUser.name}
              </h2>
              <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">{dbUser.email}</p>

              {dbUser.motto && (
                <div className="relative mb-6 rounded-2xl bg-stone-50 p-6 text-sm leading-relaxed text-zinc-600 italic dark:bg-zinc-800/50 dark:text-zinc-400">
                  <Quote size={16} className="absolute top-3 left-3 text-rose-200 dark:text-rose-800" />「{dbUser.motto}
                  」
                </div>
              )}

              <div className="flex flex-wrap justify-center gap-2">
                {session.user.isAdmin ? (
                  <Badge
                    variant="default"
                    className="rounded-full border-none bg-rose-500 px-4 py-1.5 text-[10px] font-black tracking-wider text-white uppercase shadow-sm"
                  >
                    <ShieldCheck size={12} className="mr-1.5" />
                    Administrator
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="rounded-full border-zinc-200 bg-stone-100 px-4 py-1.5 text-[10px] tracking-wider text-zinc-600 uppercase dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
                  >
                    Explorer
                  </Badge>
                )}
              </div>
            </div>

            {/* 統計セクション */}
            <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="mb-6 flex items-center justify-between px-2 text-[10px] font-black tracking-[0.2em] text-zinc-400 uppercase">
                Travel Statistics
                <span className="h-1 w-1 rounded-full bg-rose-500" />
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center rounded-2xl border border-zinc-100 bg-stone-50 p-4 transition-transform hover:scale-[1.02] dark:border-zinc-800 dark:bg-zinc-800/50">
                  <MapIcon size={18} className="mb-2 text-rose-500" />
                  <span className="font-playfair text-xl font-black text-zinc-900 dark:text-zinc-100">
                    {tripsCount}
                  </span>
                  <span className="mt-1 text-[9px] font-black text-zinc-400 uppercase">Trips</span>
                </div>
                <div className="flex flex-col items-center rounded-2xl border border-zinc-100 bg-stone-50 p-4 transition-transform hover:scale-[1.02] dark:border-zinc-800 dark:bg-zinc-800/50">
                  <Calendar size={18} className="mb-2 text-rose-500" />
                  <span className="font-playfair text-xl font-black text-zinc-900 dark:text-zinc-100">
                    {eventsCount}
                  </span>
                  <span className="mt-1 text-[9px] font-black text-zinc-400 uppercase">Spots</span>
                </div>
                <div className="flex flex-col items-center rounded-2xl border border-zinc-100 bg-stone-50 p-4 transition-transform hover:scale-[1.02] dark:border-zinc-800 dark:bg-zinc-800/50">
                  <ImageIcon size={18} className="mb-2 text-rose-500" />
                  <span className="font-playfair text-xl font-black text-zinc-900 dark:text-zinc-100">
                    {photosCount}
                  </span>
                  <span className="mt-1 text-[9px] font-black text-zinc-400 uppercase">Photos</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <LogoutButton>
                <div className="w-full rounded-xl border border-zinc-100 bg-stone-50 px-4 py-4 text-center text-xs font-black tracking-widest text-zinc-600 uppercase transition-all hover:bg-rose-50 hover:text-rose-600 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400 dark:hover:bg-rose-900/20">
                  Logout
                </div>
              </LogoutButton>
            </div>
          </div>

          {/* 右メイン: 進行中の旅 & 設定フォーム */}
          <div className="space-y-8 lg:col-span-8">
            {/* クイックアクセス */}
            <div className="rounded-[2.5rem] border border-zinc-200 bg-white p-8 shadow-sm lg:p-10 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="mb-8 flex items-center text-xl font-bold text-zinc-900 dark:text-zinc-100">
                <span className="mr-4 h-6 w-1.5 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]"></span>
                Quick Access
              </h3>

              <div className="grid gap-4">
                {activeTrips.length > 0 ? (
                  activeTrips.map((trip) => (
                    <Link
                      key={trip.id}
                      href={`/trip/${trip.slug}`}
                      className="group flex items-center gap-6 rounded-3xl border border-zinc-100 bg-stone-50 p-6 transition-all hover:-translate-y-1 hover:bg-white hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-800/30 dark:hover:bg-zinc-800"
                    >
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-900/30">
                        <MapIcon className="text-rose-500" size={24} />
                      </div>
                      <div className="min-w-0 grow">
                        <h4 className="truncate text-lg font-bold text-zinc-900 dark:text-zinc-100">{trip.title}</h4>
                        <p className="mt-1 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                          <Calendar size={14} />
                          {new Date(trip.startDate).toLocaleDateString()} —{" "}
                          {new Date(trip.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-100 bg-white shadow-sm transition-all group-hover:bg-rose-500 group-hover:text-white dark:border-zinc-600 dark:bg-zinc-700">
                        <ChevronRight size={20} />
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="py-10 text-center text-zinc-400 italic">作成された旅がまだありません</p>
                )}
              </div>
            </div>

            {/* 設定フォーム */}
            <div className="rounded-[2.5rem] border border-zinc-200 bg-white p-8 shadow-sm lg:p-10 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="mb-8 flex items-center text-xl font-bold text-zinc-900 dark:text-zinc-100">
                <span className="mr-4 h-6 w-1.5 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]"></span>
                Account Settings
              </h3>

              <div className="max-w-xl">
                <UserSettingsForm initialName={dbUser.name} initialMotto={dbUser.motto} />
              </div>

              <div className="mt-12 border-t border-zinc-100 pt-10 dark:border-zinc-800">
                <h4 className="mb-6 text-[10px] font-black tracking-[0.2em] text-zinc-400 uppercase">
                  Account Details
                </h4>
                <div className="max-w-md">
                  <div className="flex items-start gap-4 rounded-3xl border border-zinc-100 bg-stone-50 p-5 dark:border-zinc-800 dark:bg-zinc-800/30">
                    <div className="rounded-xl border border-zinc-100 bg-white p-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
                      <Mail size={18} className="text-zinc-400" />
                    </div>
                    <div>
                      <p className="mb-1 text-[10px] font-black text-zinc-400 uppercase">メールアドレス</p>
                      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{dbUser.email}</p>
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
