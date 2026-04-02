import SejmInsightLogo from "@/assets/icons/sejminsight_logo.svg?react";
import { useAuth } from "@/auth/AuthProvider";

export default function SimpleNavBar() {
  const { signinRedirect, signupRedirect } = useAuth();

  return (
    <div className="w-screen h-16 border-b border-b-gray-300/50 flex items-center justify-between px-4">
      <div className="col-2 flex justify-center items-center">
        <SejmInsightLogo className="h-16 w-20 py-1 col-1" />
        <span className="font-bold text-2xl">SejmInsight</span>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => signinRedirect()}
          className="text-slate-700 font-medium hover:text-blue-700 px-4 py-2 transition-all active:scale-95 duration-200"
        >
          Zaloguj się
        </button>
        <button
          onClick={() => signupRedirect()}
          className="hero-gradient text-white px-6 py-2 rounded-xl font-bold hover:opacity-90 transition-all active:scale-95 duration-200 shadow-lg shadow-maroon-800/20"
        >
          Zarejestruj się
        </button>
      </div>
    </div>
  );
}
