import type { Metadata } from "next";
import { Suspense } from "react";
import TabNavigation from "@/components/trip/TabNavigation";
import DesktopHeader from "@/components/trip/DesktopHeader";
import Footer from "@/components/trip/Footer";
import { DynamicEventModal } from "@/components/trip/client/DynamicEventModal";
import "./globals.css";
import { cookies } from "next/headers";
import { SECRET_MODE_COOKIE_NAME } from "@/config/constants";
import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";

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
  const session = await auth();

  return (
    <html lang="ja" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground flex flex-col min-h-screen">
        <SessionProvider session={session}>
          <DesktopHeader isSecretMode={isSecretMode} session={session} />
          <Suspense fallback={<div className="flex-1 animate-pulse bg-stone-100" />}>
            <main className="grow">
              {children}
            </main>
          </Suspense>
          <Footer />
          <TabNavigation isSecretMode={isSecretMode} />
          <DynamicEventModal />
        </SessionProvider>
      </body>
    </html>
  );
}
