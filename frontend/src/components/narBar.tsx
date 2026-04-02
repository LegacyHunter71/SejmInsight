/// <reference types="vite-plugin-svgr/client" />

import { Link } from "@tanstack/react-router";

import SejmInsightLogo from "@/assets/icons/sejminsight_logo.svg?react";

import NavProfileMenu from "./navProfileMenu";

export default function NavBar() {
  return (
    <div className="w-screen h-16 bg-gray-100 border-b border-b-gray-300/50 flex items-center justify-between px-4">
      <div className="col-2 flex justify-center items-center gap-15">
        <div className="flex flex-row justify-center items-center">
          <SejmInsightLogo className="h-16 w-20 py-1 col-1" />
          <span className="font-bold text-2xl">SejmInsight</span>
        </div>
        <div className="flex flex-row gap-5">
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
      </div>
      <NavProfileMenu />
    </div>
  );
}
