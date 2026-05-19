"use client";

import { AlertCircle, Check, Loader2, Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { updateUserProfile } from "../../api/userActions";

interface UserSettingsFormProps {
  initialName: string | null | undefined;
  initialMotto: string | null | undefined;
}

export function UserSettingsForm({ initialName, initialMotto }: UserSettingsFormProps) {
  const [name, setName] = useState(initialName || "");
  const [motto, setMotto] = useState(initialMotto || "");
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // テーマの初期化（localStorageなどから取得）
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | "system" | null;
    if (savedTheme) {
      setTimeout(() => setTheme(savedTheme), 0);
    }
  }, []);

  const applyTheme = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    if (newTheme === "dark" || (newTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const result = (await updateUserProfile({ name, motto })) as { success: boolean; error?: string };
      if (result.success) {
        setMessage({ type: "success", text: "プロフィールを更新しました" });
      } else {
        setMessage({ type: "error", text: result.error || "更新に失敗しました" });
      }
    } catch (error: unknown) {
      console.error("Update Profile Error:", error);
      setMessage({ type: "error", text: "エラーが発生しました" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 基本情報 */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="ml-1 text-xs font-black tracking-widest text-zinc-400 uppercase">
              ユーザー名
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="v2-focus w-full rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-sm font-medium text-zinc-900 transition-all dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
              placeholder="あなたの名前"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="motto" className="ml-1 text-xs font-black tracking-widest text-zinc-400 uppercase">
              旅のモットー / 一言
            </label>
            <textarea
              id="motto"
              value={motto}
              onChange={(e) => setMotto(e.target.value)}
              rows={3}
              className="v2-focus w-full resize-none rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-sm font-medium text-zinc-900 transition-all dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
              placeholder="例：一期一会を大切に。美味しいものを求めて。"
            />
          </div>
        </div>

        {/* テーマ設定 */}
        <fieldset className="space-y-4 border-none p-0">
          <legend className="ml-1 text-xs font-black tracking-widest text-zinc-400 uppercase">画面テーマ</legend>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "light", icon: Sun, label: "Light" },
              { id: "dark", icon: Moon, label: "Dark" },
              { id: "system", icon: Monitor, label: "System" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => applyTheme(item.id as "light" | "dark" | "system")}
                className={`flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all ${
                  theme === item.id
                    ? "border-zinc-900 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                    : "border-zinc-100 bg-stone-50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400"
                }`}
              >
                <item.icon size={20} />
                <span className="text-[10px] font-black tracking-wider uppercase">{item.label}</span>
              </button>
            ))}
          </div>
        </fieldset>

        {message && (
          <div
            className={`animate-in fade-in slide-in-from-top-2 flex items-center gap-3 rounded-2xl p-4 text-sm duration-300 ${
              message.type === "success"
                ? "border border-emerald-100 bg-emerald-50 text-emerald-700"
                : "border border-rose-100 bg-rose-50 text-rose-700"
            }`}
          >
            {message.type === "success" ? <Check size={18} /> : <AlertCircle size={18} />}
            <span className="font-bold">{message.text}</span>
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading || (name === initialName && motto === initialMotto)}
          className="w-full rounded-2xl bg-zinc-900 py-6 text-sm font-black text-white shadow-md transition-all hover:bg-zinc-800 disabled:bg-zinc-100 disabled:text-zinc-400"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 size={18} className="animate-spin" />
              更新中...
            </span>
          ) : (
            "プロフィールを保存"
          )}
        </Button>
      </form>
    </div>
  );
}
