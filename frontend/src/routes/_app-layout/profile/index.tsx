import { authGuard } from "@/auth/authGuard";
import { useAuth } from "@/auth/AuthProvider";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app-layout/profile/")({
  beforeLoad: authGuard,
  component: RouteComponent,
});

function RouteComponent() {
  const { userProfile, isAuthenticated, keycloak } = useAuth();

  if (!isAuthenticated) return null;

  const roles = keycloak.realmAccess?.roles || [];
  const initial = (userProfile?.firstName || "U")
    .charAt(0)
    .toUpperCase();

  return (
    <div className="p-8 min-w-[60%] max-w-9xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-[Manrope]">
            Twój Profil
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Zarządzaj swoimi danymi i uprawnieniami w systemie.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row items-start gap-8 transition-colors">
        <div className="w-32 h-32 bg-maroon-800 text-white rounded-full shrink-0 flex items-center justify-center text-5xl font-bold shadow-lg shadow-maroon-900/20">
          {initial}
        </div>

        <div className="space-y-4 flex-1">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white font-[Manrope]">
              {userProfile?.firstName + " " + userProfile?.lastName || "Użytkownik SejmInsight"}
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              {userProfile?.email}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {(() => {
              const important = ["CITIZEN", "ANALYST", "ADMIN"]
              const shown = (roles || []).filter((r: string) => important.includes((r || "").toUpperCase()))

              if (shown.length === 0) {
                return (
                  <span className="text-sm text-gray-500 dark:text-gray-400">Brak specjalnej roli</span>
                )
              }

              return shown.map((role) => {
                const r = (role || "").toUpperCase()
                let className =
                  "px-3 py-1 rounded-full text-sm font-bold"
                let label = role

                if (r === "CITIZEN") {
                  className += " bg-maroon-100 text-maroon-800 dark:bg-maroon-800 dark:text-white border border-maroon-200 dark:border-maroon-700"
                  label = "Obywatel"
                } else if (r === "ANALYST") {
                  className += " bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50"
                  label = "Analityk"
                } else if (r === "ADMIN") {
                  className += " bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800/50"
                  label = "Administrator"
                }

                return (
                  <span key={role} className={className}>
                    {label}
                  </span>
                )
              })
            })()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Szczegóły konta
          </h3>
          <ul className="space-y-3">
            <li className="flex justify-between border-b border-gray-100 dark:border-slate-700 pb-2">
              <span className="text-gray-500 dark:text-gray-400">Username</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {userProfile?.preferred_username}
              </span>
            </li>
            <li className="flex justify-between border-b border-gray-100 dark:border-slate-700 pb-2">
              <span className="text-gray-500 dark:text-gray-400">Status</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                Aktywny (SSO)
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Twoja Aktywność
          </h3>
          <div className="flex items-center justify-center h-32 bg-gray-50 dark:bg-slate-900/50 border border-dashed border-gray-200 dark:border-slate-700 rounded-xl text-gray-400 dark:text-gray-500">
            Historia komentarzy wkrótce...
          </div>
        </div>
      </div>
    </div>
  );
}
