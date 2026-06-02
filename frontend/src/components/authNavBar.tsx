import SejmInsightLogo from "@/assets/icons/sejminsight_logo.svg?react";
import { useAuth } from "@/auth/AuthProvider";
import { useTheme } from "@/hooks/useTheme";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export default function AuthNavBar() {
  const { login } = useAuth();
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();

  return (
    <div className="fixed top-0 z-50 w-screen h-16 border-b border-b-gray-300/50 dark:border-b-slate-800/60 flex items-center justify-between px-4 bg-slate-100/70 dark:bg-slate-950/60 backdrop-blur">
      <div className="col-2 flex justify-center items-center">
        <SejmInsightLogo className="h-16 w-20 py-1 col-1 text-black dark:text-white" />
        <span className="font-bold text-2xl text-slate-900 dark:text-slate-100">
          SejmInsight
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex bg-gray-200/50 dark:bg-slate-800/50 rounded-lg p-1 gap-1">
          <button
            onClick={() => void i18n.changeLanguage("pl")}
            className={`flex justify-center px-2 py-2 rounded-md transition-colors cursor-pointer text-xs font-bold ${
              i18n.resolvedLanguage === "pl"
                ? "bg-white dark:bg-slate-700 shadow-sm text-gray-900 dark:text-white"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
            title="Polski"
            type="button"
          >
            PL
          </button>
          <button
            onClick={() => void i18n.changeLanguage("en")}
            className={`flex justify-center px-2 py-2 rounded-md transition-colors cursor-pointer text-xs font-bold ${
              i18n.resolvedLanguage === "en"
                ? "bg-white dark:bg-slate-700 shadow-sm text-gray-900 dark:text-white"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
            title="English"
            type="button"
          >
            EN
          </button>
          <button
            onClick={() => void i18n.changeLanguage("de")}
            className={`flex justify-center px-2 py-2 rounded-md transition-colors cursor-pointer text-xs font-bold ${
              i18n.resolvedLanguage === "de"
                ? "bg-white dark:bg-slate-700 shadow-sm text-gray-900 dark:text-white"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
            title="Deutsch"
            type="button"
          >
            DE
          </button>
          <button
            onClick={() => void i18n.changeLanguage("uk")}
            className={`flex justify-center px-2 py-2 rounded-md transition-colors cursor-pointer text-xs font-bold ${
              i18n.resolvedLanguage === "uk"
                ? "bg-white dark:bg-slate-700 shadow-sm text-gray-900 dark:text-white"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
            title="Українська"
            type="button"
          >
            UA
          </button>
        </div>
        <div className="flex bg-gray-200/50 dark:bg-slate-800/50 rounded-lg p-1 gap-1 mr-2 sm:flex">
          <button
            onClick={() => setTheme("light")}
            className={`flex justify-center p-2 rounded-md transition-colors cursor-pointer ${
              theme === "light"
                ? "bg-white dark:bg-slate-700 shadow-sm text-gray-900 dark:text-white"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
            title={t("theme.light")}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </button>
          <button
            onClick={() => setTheme("system")}
            className={`flex justify-center p-2 rounded-md transition-colors cursor-pointer ${
              theme === "system"
                ? "bg-white dark:bg-slate-700 shadow-sm text-gray-900 dark:text-white"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
            title={t("theme.system")}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`flex justify-center p-2 rounded-md transition-colors cursor-pointer ${
              theme === "dark"
                ? "bg-white dark:bg-slate-700 shadow-sm text-gray-900 dark:text-white"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
            title={t("theme.dark")}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          </button>
        </div>
        <button
          onClick={() => void login()}
          className="text-slate-700 dark:text-slate-200 font-medium hover:text-blue-700 dark:hover:text-blue-400 px-4 py-2 transition-all active:scale-95 duration-200 hover:cursor-pointer"
        >
          {t("nav.login")}
        </button>
        <Link
          to="/register"
          className="hero-gradient text-white px-6 py-2 rounded-xl font-bold hover:opacity-90 transition-all active:scale-95 duration-200 shadow-lg shadow-maroon-800/20 hover:cursor-pointer"
        >
          {t("nav.register")}
        </Link>
      </div>
    </div>
  );
}
