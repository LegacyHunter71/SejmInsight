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

      {/* Sekcja trendów */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-800">
        <h3 className="px-4 text-sm font-extrabold text-gray-900 dark:text-white mb-4 font-[Manrope]">
          Popularne debaty
        </h3>
        <div className="flex flex-col space-y-4 px-4">
          <div className="cursor-pointer group">
            <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-maroon-700 dark:group-hover:text-maroon-400 transition-colors">
              Sejm • Na czasie
            </p>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-200 mt-0.5 group-hover:text-maroon-800 dark:group-hover:text-maroon-400 transition-colors">
              #UstawaBudżetowa
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              12.5k postów
            </p>
          </div>
          <div className="cursor-pointer group">
            <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-maroon-700 dark:group-hover:text-maroon-400 transition-colors">
              Polityka • Na czasie
            </p>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-200 mt-0.5 group-hover:text-maroon-800 dark:group-hover:text-maroon-400 transition-colors">
              #Głosowanie234
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              8.2k postów
            </p>
          </div>
          <div className="cursor-pointer group">
            <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-maroon-700 dark:group-hover:text-maroon-400 transition-colors">
              Obywatele • Na czasie
            </p>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-200 mt-0.5 group-hover:text-maroon-800 dark:group-hover:text-maroon-400 transition-colors">
              #ReformaZdrowia
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              5.1k postów
            </p>
          </div>
        </div>
      </div>

      {/* Główna akcja (CTA) */}
      <div className="mt-auto pt-6 px-2 pb-4">
        <button className="w-full bg-maroon-800 dark:bg-maroon-700 text-white font-bold py-3.5 rounded-full hover:bg-maroon-900 dark:hover:bg-maroon-600 hover:shadow-lg hover:shadow-maroon-900/30 dark:hover:shadow-maroon-900/50 transition-all active:scale-95 cursor-pointer">
          Dodaj wpis
        </button>
      </div>
    </aside>
  );
}
