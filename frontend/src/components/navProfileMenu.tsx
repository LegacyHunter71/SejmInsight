import { useEffect, useMemo, useRef, useState } from "react";

import { useAuth } from "@/auth/AuthProvider";

import "@/styles/nav.css";

import logo from "@/assets/icons/sejminsight_logo.svg";

import "@/utils/nav";

export default function NavProfileMenu() {
  const { user, isAuthenticated, signoutRedirect } = useAuth();

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
      user?.profile?.name ??
      user?.profile?.preferred_username ??
      user?.profile?.email ??
      "User",
    [user],
  );

  return (
    <div className="flex justify-end items-center">
      <div
        ref={containerRef}
        className="relative inline-block text-left w-12 h-12"
      >
        <button
          id="nav-profile-button"
          className="hover:bg-black/20 rounded-full w-full h-full"
          type="button"
          onClick={() => setOpen((prev) => !prev)}
        >
          <img
            src={logo}
            alt="Profile"
            className="rounded-full border w-full h-full"
          />
        </button>

        {open ? (
          <div id="profile-menu">
            {isAuthenticated ? (
              <div className="absolute inset-e-0 mt-2 w-40 bg-gray-200 border border-gray-500 rounded-xl shadow-2xl z-100 overflow-hidden backdrop-blur-md">
                <div className="py-1">
                  <span className="text-center p-2">{displayName}</span>
                  <hr />
                  <button className="profile-menu-button" type="button">
                    Settings
                  </button>
                  <button
                    className="profile-menu-button"
                    onClick={() => signoutRedirect()}
                    type="button"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="absolute inset-e-0 mt-2 w-40 bg-gray-200 border border-gray-500 rounded-xl shadow-2xl z-100 overflow-hidden backdrop-blur-md">
                <div className="py-1">
                  <span className="profile-menu-button"></span>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
