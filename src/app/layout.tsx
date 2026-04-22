import type { Metadata } from "next";
import { Noto_Sans_JP, Playfair_Display } from "next/font/google";
import TabNavigation from "@/components/trip/TabNavigation";
import EventDetailModal from "@/components/trip/client/EventDetailModal";
import "./globals.css";
import { cookies } from "next/headers";
import { SECRET_MODE_COOKIE_NAME } from "@/config/constants";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ふたりだけの福岡大満喫トリップ 🍜",
  description: "2026.5.24-25 福岡旅行のしおり — 美味しい博多グルメと歴史を巡る1泊2日",
  openGraph: {
    title: "ふたりだけの福岡大満喫トリップ",
    description: "2026.5.24-25 福岡旅行のしおり",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const isSecretMode = cookieStore.get(SECRET_MODE_COOKIE_NAME)?.value === "true";

  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`${notoSansJP.variable} ${playfairDisplay.variable} font-sans antialiased bg-stone-50`}
      >
        <main className="mx-auto min-h-screen max-w-md bg-white pb-20 shadow-xl sm:pb-24">
          {children}
        </main>
        <TabNavigation isSecretMode={isSecretMode} />
        <EventDetailModal />
      </body>
    </html>
  );
}
