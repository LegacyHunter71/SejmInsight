import { authGuard } from "@/auth/authGuard";
import { useAuth } from "@/auth/AuthProvider";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app-layout/profile")({
  beforeLoad: authGuard,
  component: RouteComponent,
});

function RouteComponent() {
  const { userProfile, isAuthenticated, keycloak } = useAuth();

  if (!isAuthenticated) return null;

  const roles = keycloak.realmAccess?.roles || [];
  const initial = (userProfile?.name || userProfile?.preferred_username || "U")
    .charAt(0)
    .toUpperCase();

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
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
              {userProfile?.name || "Użytkownik SejmInsight"}
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              {userProfile?.email}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {roles.map((role) => (
              <span
                key={role}
                className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-bold border border-blue-200 dark:border-blue-800/50"
              >
                {role}
              </span>
            ))}
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
