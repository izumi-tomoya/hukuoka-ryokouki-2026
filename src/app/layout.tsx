import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "@/features/trip/components/DesktopHeader";
import Footer from "@/features/trip/components/Footer";
import { DynamicEventModal } from "@/features/trip/components/client/DynamicEventModal";
import "./globals.css";
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
  const session = await auth();

  return (
    <html lang="ja" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground flex flex-col min-h-screen">
        <SessionProvider session={session}>
          <Header session={session} />
          <Suspense fallback={<div className="flex-1 animate-pulse bg-stone-100" />}>
            <main className="grow">
              {children}
            </main>
          </Suspense>
          <Footer />
          <DynamicEventModal />
        </SessionProvider>
      </body>
    </html>
  );
}
