import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/auth/AuthProvider";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_app-layout/debates/$debateId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  const { debateId } = Route.useParams();
  const { isAuthenticated, login } = useAuth();

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto w-full">
      {/* Karta z detalami debaty */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-8 shadow-sm transition-colors">
        <div className="space-y-4">
          <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs font-bold px-3 py-1 rounded-full">
            {t("debates.printNo")} {debateId}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white font-[Manrope]">
            {t("debates.titleForId", { id: debateId })}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            {t("debates.descriptionPlaceholder")}
          </p>
        </div>
      </div>

      {/* Moduł Społecznościowy */}
      <div className="pt-8 border-t border-gray-200 dark:border-slate-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {t("debates.community")}
        </h2>

        {isAuthenticated ? (
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm mb-8 transition-colors">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              {t("debates.yourVoice")}
            </h3>
            <textarea
              className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-maroon-800 dark:focus:ring-maroon-600 transition-colors resize-none"
              rows={4}
              placeholder={t("debates.commentPlaceholder")}
            ></textarea>
            <div className="mt-4 flex justify-end">
              <button className="bg-maroon-800 dark:bg-maroon-700 text-white font-bold py-2.5 px-6 rounded-full hover:bg-maroon-900 dark:hover:bg-maroon-600 transition-colors cursor-pointer">
                {t("debates.publishComment")}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-2xl p-8 shadow-sm mb-8 flex flex-col items-center justify-center transition-colors">
            <p className="text-gray-500 dark:text-gray-400 mb-4 text-center">
              {t("debates.loginToParticipate")}
            </p>
            <button
              onClick={() => void login(`/debates/${debateId}`)}
              className="bg-maroon-800 dark:bg-maroon-700 text-white font-bold py-2.5 px-8 rounded-full hover:bg-maroon-900 dark:hover:bg-maroon-600 transition-colors cursor-pointer shadow-md"
            >
              {t("deputies.loginWithKeycloak")}
            </button>
          </div>
        )}

        <div className="space-y-4 text-center text-gray-500 dark:text-gray-400">
          {t("debates.opinionsPlaceholder")}
        </div>
      </div>
    </div>
  );
}
