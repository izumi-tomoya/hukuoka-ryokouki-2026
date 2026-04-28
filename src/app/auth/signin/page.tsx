import { signIn } from "@/lib/auth";
import { LogIn, Sparkles, Map } from "lucide-react";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-stone-100 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      
      {/* Large background text like a magazine */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
        <span className="font-playfair text-[40vw] font-black text-stone-200/20 leading-none select-none">M</span>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl p-10 md:p-16 rounded-[4rem] shadow-2xl shadow-rose-100/20 border border-white/50 text-center ring-1 ring-rose-100/30">
          
          {/* Brand Logo/Icon */}
          <div className="mx-auto h-20 w-20 mb-10 relative">
            <div className="absolute inset-0 bg-rose-500 rounded-[2.5rem] rotate-6 opacity-10 animate-pulse" />
            <div className="absolute inset-0 bg-white rounded-[2.2rem] shadow-sm border border-rose-50 flex items-center justify-center text-rose-500 relative z-10">
              <Sparkles size={32} />
            </div>
          </div>
          
          {/* Title Section */}
          <div className="space-y-4 mb-12">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-stone-900 tracking-tight">Memoir</h1>
            <div className="flex items-center justify-center gap-2">
              <div className="h-px w-8 bg-rose-100" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-400">Exclusive Access</p>
              <div className="h-px w-8 bg-rose-100" />
            </div>
            <p className="text-sm font-medium text-stone-500 leading-relaxed max-w-[240px] mx-auto pt-2">
              旅の続きを、ふたりで。<br />
              新しい記憶を刻む準備はできましたか？
            </p>
          </div>
          
          {/* Sign In Button */}
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/" });
            }}
            className="space-y-6"
          >
            <button 
              type="submit" 
              className="group relative w-full overflow-hidden rounded-[2rem] bg-stone-900 p-[1px] transition-all hover:shadow-2xl hover:shadow-stone-200 active:scale-[0.98]"
            >
              {/* Button inner gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-stone-800 to-stone-700 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative bg-stone-900 group-hover:bg-transparent rounded-[1.95rem] py-5 px-8 flex items-center justify-center gap-4 transition-colors">
                <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                  <Image src="https://www.google.com/favicon.ico" alt="G" width={14} height={14} />
                </div>
                <span className="text-[12px] font-black text-white uppercase tracking-[0.2em]">
                  Sign In with Google
                </span>
              </div>
            </button>
            
            <p className="text-[9px] font-bold text-stone-300 uppercase tracking-widest">
              Secured by Google Authentication
            </p>
          </form>

          {/* Footer Decoration */}
          <div className="mt-16 pt-8 border-t border-stone-50 flex justify-center gap-6 text-stone-300">
             <Map size={14} />
             <div className="h-4 w-px bg-stone-100" />
             <LogIn size={14} />
          </div>
        </div>
        
        {/* Helper bottom link */}
        <p className="mt-8 text-center text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">
          &copy; 2026 Fukuoka Memoir Project
        </p>
      </div>
    </div>
  );
}
