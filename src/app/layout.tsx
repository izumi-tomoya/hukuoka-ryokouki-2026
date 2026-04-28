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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
                  if (!theme && supportDarkMode) theme = 'dark';
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else if (theme === 'system' || !theme) {
                    if (supportDarkMode) document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-background dark:bg-zinc-950 text-foreground dark:text-zinc-100 flex flex-col min-h-screen transition-colors duration-300">
        <SessionProvider session={session}>
          <Header session={session} />
          <Suspense fallback={<div className="flex-1 animate-pulse bg-stone-100 dark:bg-zinc-900" />}>
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
