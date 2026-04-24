import { ReactNode } from "react";
import CategoryTabs from "./CategoryTabs";

interface Props {
  slug: string;
  activePath: string;
  isSecretMode: boolean;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function TripLayout({ slug, activePath, isSecretMode, title, subtitle, children }: Props) {
  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <header className="px-6 pt-16 pb-8 mx-auto max-w-5xl">
        <div className="mb-10 text-center md:text-left">
          <h1 className="font-playfair text-5xl font-extrabold text-stone-900 mb-4 tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-stone-400 text-xs font-bold tracking-[0.2em] uppercase">
              {subtitle}
            </p>
          )}
        </div>

        <CategoryTabs slug={slug} activePath={activePath} isSecretMode={isSecretMode} />
      </header>

      <main className="mx-auto max-w-5xl px-6">
        {children}
      </main>
    </div>
  );
}
