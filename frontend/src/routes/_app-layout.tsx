import { createFileRoute, Outlet } from "@tanstack/react-router";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { authGuard } from "@/auth/authGuard";

export const Route = createFileRoute("/_app-layout")({
  beforeLoad: authGuard,
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="h-full bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Header />
      <div className="flex flex-row h-[calc(100vh-4rem)]">
        <Sidebar />
        <div className="flex-1 p-4 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
