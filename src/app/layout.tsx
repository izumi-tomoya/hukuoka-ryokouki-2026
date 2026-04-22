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
  title: {
    template: "%s | Memoir — ふたりの旅の記憶",
    default: "Memoir — ふたりの旅の記憶 ✨",
  },
  description: "ふたりで巡った場所、これから行きたい場所。すべての旅の大切な記録。",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "Memoir — ふたりの旅の記憶",
    description: "ふたりだけの特別な旅行記・しおりポータル",
    siteName: "Memoir",
    locale: "ja_JP",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
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
        className={`${notoSansJP.variable} ${playfairDisplay.variable} font-sans antialiased bg-[#FFFCF9]`}
      >
        {/* Desktop top-nav spacer — only on md+ */}
        <div className="hidden md:block h-14" aria-hidden="true" />
        <main className="min-h-screen bg-white pb-24 md:pb-0">
          {children}
        </main>
        <TabNavigation isSecretMode={isSecretMode} />
        <EventDetailModal />
      </body>
    </html>
  );
}
