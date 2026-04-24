import { signIn } from "@/lib/auth";
import { Lock } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white p-12 rounded-[3rem] shadow-sm border border-rose-50 text-center">
        {/* アイコン */}
        <div className="mx-auto h-16 w-16 mb-8 rounded-[2rem] bg-rose-50 flex items-center justify-center text-rose-500 shadow-inner">
          <Lock size={28} />
        </div>
        
        {/* タイトル */}
        <div className="space-y-2 mb-10">
          <h1 className="font-playfair text-2xl font-bold text-stone-900 tracking-tight">Sign In</h1>
          <p className="text-sm font-medium text-stone-400">アカウントでログイン</p>
        </div>
        
        {/* ボタン */}
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/" });
          }}
        >
          <button 
            type="submit" 
            className="w-full py-4 rounded-2xl bg-stone-900 text-white font-bold text-sm tracking-widest uppercase transition-all hover:bg-stone-800 hover:shadow-lg active:scale-[0.98]"
          >
            Google でログイン
          </button>
        </form>
      </div>
    </div>
  );
}
