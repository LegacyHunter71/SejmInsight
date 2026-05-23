import SejmInsightLogo from "@/assets/icons/sejminsight_logo.svg?react";
import { useAuth } from "@/auth/AuthProvider";

export default function SimpleNavBar() {
  const { login, register } = useAuth();

  return (
    <div className="fixed top-0 w-screen h-16 border-b border-b-gray-300/50 dark:border-b-slate-800/60 flex items-center justify-between px-4 bg-slate-100/70 dark:bg-slate-950/60 backdrop-blur">
      <div className="col-2 flex justify-center items-center">
        <SejmInsightLogo className="h-16 w-20 py-1 col-1" />
        <span className="font-bold text-2xl text-slate-900 dark:text-slate-100">
          SejmInsight
        </span>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => login()}
          className="text-slate-700 dark:text-slate-200 font-medium hover:text-blue-700 dark:hover:text-blue-400 px-4 py-2 transition-all active:scale-95 duration-200 hover:cursor-pointer"
        >
          Zaloguj się
        </button>
        <button
          onClick={() => register()}
          className="hero-gradient text-white px-6 py-2 rounded-xl font-bold hover:opacity-90 transition-all active:scale-95 duration-200 shadow-lg shadow-maroon-800/20 hover:cursor-pointer"
        >
          Zarejestruj się
        </button>
      </div>
    </div>
  );
}
