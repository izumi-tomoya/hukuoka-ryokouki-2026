import type { Metadata } from "next";
import TabNavigation from "@/components/trip/TabNavigation";
import EventDetailModal from "@/components/trip/client/EventDetailModal";
import "./globals.css";
import { cookies } from "next/headers";
import { SECRET_MODE_COOKIE_NAME } from "@/config/constants";

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
      <body className="font-sans antialiased bg-[#FFFCF9]">
        <main className="min-h-screen bg-white">
          {children}
        </main>
        <TabNavigation isSecretMode={isSecretMode} />
        <EventDetailModal />
      </body>
    </html>
  );
}
