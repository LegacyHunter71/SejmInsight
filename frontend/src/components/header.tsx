/// <reference types="vite-plugin-svgr/client" />

import SejmInsightLogo from "@/assets/icons/sejminsight_logo.svg?react";
import HeaderProfileMenu from "./headerProfileMenu";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 w-full h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-4 transition-colors">
      {/* Lewa strona - Logo wyrównane z Sidebar */}
      <div className="flex items-center gap-3 w-1/4 max-w-70">
        <SejmInsightLogo className="h-10 w-12" />
        <span className="font-extrabold text-2xl tracking-tight text-gray-900 dark:text-white hidden sm:block">
          SejmInsight
        </span>
      </div>

      {/* Środek - Wyszukiwarka (charakterystyczna dla social media) */}
      <div className="flex-1 max-w-xl px-4 hidden md:block">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-maroon-800 dark:group-focus-within:text-maroon-400 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder={t("common.searchPlaceholder")}
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-slate-700 rounded-full leading-5 bg-gray-100 dark:bg-slate-800 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-maroon-800 dark:focus:border-maroon-600 focus:ring-1 focus:ring-maroon-800 dark:focus:ring-maroon-600 transition-all sm:text-sm"
          />
        </div>
      </div>

      {/* Prawa strona - Profil */}
      <div className="flex items-center justify-end w-1/4 max-w-70">
        <HeaderProfileMenu />
      </div>
    </header>
  );
}
