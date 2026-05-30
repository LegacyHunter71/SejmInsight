import { useEffect, useMemo, useRef, useState } from "react";

import { useAuth } from "@/auth/AuthProvider";
import { useTheme } from "@/hooks/useTheme";

import { Link } from "@tanstack/react-router";

// import "@/styles/nav.css";

import "@/utils/nav";

export default function HeaderProfileMenu() {
  const { userProfile, isAuthenticated, logout, login, register } = useAuth();
  const { theme, setTheme } = useTheme();

  const [open, setOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      const root = containerRef.current;
      if (!root) return;
      if (!root.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const displayName = useMemo(
    () =>
      userProfile?.name ??
      userProfile?.preferred_username ??
      userProfile?.email ??
      "User",
    [userProfile],
  );

  // Pobieramy pierwszą literę nazwy do awatara
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex justify-end items-center">
      <div ref={containerRef} className="relative inline-block text-left">
        <button
          id="nav-profile-button"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-maroon-800 text-white font-bold hover:ring-2 hover:ring-maroon-800 hover:ring-offset-2 transition-all focus:outline-none select-none cursor-pointer"
          type="button"
          onClick={() => setOpen((prev) => !prev)}
        >
          {initial}
        </button>

        {open ? (
          <div id="profile-menu">
            {isAuthenticated ? (
              <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 overflow-hidden transform transition-all origin-top-right">
                <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex items-center gap-3">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-maroon-800 text-white flex items-center justify-center text-xl font-bold">
                    {initial}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-semibold text-gray-900 dark:text-white truncate">
                      {displayName}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {userProfile?.email || "Brak email"}
                    </span>
                  </div>
                </div>

                <div className="p-2">
                  <Link
                    to="/profile"
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-3 cursor-pointer"
                  >
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                    Profil
                  </Link>

                  <Link
                    to="/profile/settings"
                    className="w-full text-left px-4 py-2 mt-1 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-3 cursor-pointer"
                  >
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Ustawienia konta
                  </Link>
                </div>

                <div className="p-3 border-t border-gray-100 dark:border-slate-700">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block px-1">
                    Motyw
                  </span>
                  <div className="flex bg-gray-100 dark:bg-slate-900 rounded-lg p-1 gap-1">
                    <button
                      onClick={() => setTheme("light")}
                      className={`flex-1 flex justify-center py-2 rounded-md transition-colors cursor-pointer ${theme === "light"
                          ? "bg-white dark:bg-slate-700 shadow-sm text-gray-900 dark:text-white"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        }`}
                      title="Jasny"
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
                      className={`flex-1 flex justify-center py-2 rounded-md transition-colors cursor-pointer ${theme === "system"
                          ? "bg-white dark:bg-slate-700 shadow-sm text-gray-900 dark:text-white"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        }`}
                      title="Systemowy"
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
                      className={`flex-1 flex justify-center py-2 rounded-md transition-colors cursor-pointer ${theme === "dark"
                          ? "bg-white dark:bg-slate-700 shadow-sm text-gray-900 dark:text-white"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        }`}
                      title="Ciemny"
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
                </div>

                <div className="p-2 border-t border-gray-100 dark:border-slate-700">
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors flex items-center gap-3 font-medium cursor-pointer"
                    onClick={() => logout()}
                    type="button"
                  >
                    <svg
                      className="w-5 h-5 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Wyloguj się
                  </button>
                </div>
              </div>
            ) : (
              <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 overflow-hidden transform transition-all origin-top-right">
                <div className="p-2">
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-3 cursor-pointer"
                    onClick={() => login()}
                    type="button"
                  >
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 16l4-4m0 0l-4-4m4 4H3m6 4v1a3 3 0 003 3h6a3 3 0 003-3V7a3 3 0 00-3-3h-6a3 3 0 00-3 3v1"
                      />
                    </svg>
                    Zaloguj się
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 mt-1 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-3 cursor-pointer"
                    onClick={() => register()}
                    type="button"
                  >
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                    Zarejestruj się
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
