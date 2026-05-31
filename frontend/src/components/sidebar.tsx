import { Link } from "@tanstack/react-router";
import { useAuth } from "@/auth/AuthProvider";
import { useTranslation } from "react-i18next";

type SidebarLinkProps = {
  to: string;
  text: React.ReactNode;
};

function SidebarLink({ to, text }: SidebarLinkProps) {
  return (
    <Link
      to={to}
      className="flex items-center gap-4 px-4 py-3 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors font-medium text-lg"
      activeProps={{
        className:
          "font-bold bg-white dark:bg-slate-800 shadow-sm text-maroon-800 dark:text-maroon-400",
      }}
    >
      {text}
    </Link>
  );
}

export default function Sidebar() {
  const { t } = useTranslation();
  const { isAuthenticated, keycloak } = useAuth();
  const roles = keycloak.realmAccess?.roles || [];
  const isAdmin =
    isAuthenticated && roles.some((r) => (r || "").toUpperCase() === "ADMIN");

  return (
    <aside className="h-full w-1/4 max-w-70 bg-gray-50/50 dark:bg-slate-900/50 border-r border-gray-200 dark:border-slate-800 flex flex-col p-4 overflow-y-auto transition-colors">
      {/* Główna nawigacja */}
      <nav className="flex flex-col space-y-1">
        <SidebarLink to="/" text={t("sidebar.home")} />
        <SidebarLink to="/deputies" text={t("sidebar.deputies")} />
        <SidebarLink to="/debates" text={t("sidebar.debates")} />
        <SidebarLink to="/about" text={t("sidebar.about")} />
        {isAdmin ? <SidebarLink to="/admin" text={t("sidebar.admin")} /> : null}
      </nav>
    </aside>
  );
}
