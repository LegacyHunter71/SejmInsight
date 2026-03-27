/// <reference types="vite-plugin-svgr/client" />

import { Link } from "@tanstack/react-router";

import "@/styles/shared.css";
import SejmInsightLogo from "@/assets/icons/sejminsight_logo.svg?react";
import { useAuth } from "@/auth/AuthProvider";
// import type { RouterContext } from "@/main";

// export default function NavBar({ auth }: RouterContext) {
export default function NavBar() {
  const { user, isAuthenticated, removeUser, signoutRedirect } = useAuth();

  return (
    <div className="w-screen h-16 bg-gray-100 border-b border-b-gray-300/50 flex items-center justify-between px-4">
      <div className="col-2 flex justify-center items-center gap-5">
        <SejmInsightLogo className="h-16 w-20 py-1 col-1" />
        <Link to="/" activeProps={{ className: "text-blue-500 font-bold" }}>
          Main Page
        </Link>
        <Link
          to="/about"
          activeProps={{ className: "text-blue-500 font-bold" }}
        >
          About
        </Link>
        <Link
          to="/profile"
          activeProps={{ className: "text-blue-500 font-bold" }}
        >
          Profile
        </Link>
      </div>
      <div>
        {isAuthenticated ? (
          <>
            <span>
              Zalogowany jako:{" "}
              {user?.profile?.email ??
                user?.profile?.preferred_username ??
                "unknown"}
            </span>
            <button
              style={{ marginLeft: 12 }}
              onClick={async () => {
                await removeUser();
                await signoutRedirect();
              }}
            >
              Wyloguj
            </button>
          </>
        ) : (
          <span>Nie zalogowano</span>
        )}
      </div>
    </div>
  );
}
