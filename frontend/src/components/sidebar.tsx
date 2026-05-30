import { Link } from "@tanstack/react-router";

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
  return (
    <aside className="h-full w-1/4 max-w-70 bg-gray-50/50 dark:bg-slate-900/50 border-r border-gray-200 dark:border-slate-800 flex flex-col p-4 overflow-y-auto transition-colors">
      {/* Główna nawigacja */}
      <nav className="flex flex-col space-y-1">
        <SidebarLink to="/" text="Strona główna" />
        <SidebarLink to="/deputies" text="Posłowie" />
        <SidebarLink to="/debates" text="Debaty i Ustawy" />
        <SidebarLink to="/about" text="O nas" />
      </nav>
    </aside>
  );
}
