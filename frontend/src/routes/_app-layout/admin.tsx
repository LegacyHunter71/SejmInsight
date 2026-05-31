import { adminGuard } from "@/auth/adminGuard";
import { syncDeputies, syncVotings } from "@/api/admin";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_app-layout/admin")({
  beforeLoad: adminGuard,
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  const [syncDeputiesState, setSyncDeputiesState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [syncVotingsState, setSyncVotingsState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [lastError, setLastError] = useState<string | null>(null);

  const runSyncDeputies = async () => {
    setLastError(null);
    setSyncDeputiesState("loading");
    try {
      await syncDeputies();
      setSyncDeputiesState("success");
      window.setTimeout(() => setSyncDeputiesState("idle"), 2500);
    } catch (e: any) {
      setSyncDeputiesState("error");
      setLastError(String(e?.message ?? t("admin.syncDeputies.errorFallback")));
    }
  };

  const runSyncVotings = async () => {
    setLastError(null);
    setSyncVotingsState("loading");
    try {
      await syncVotings();
      setSyncVotingsState("success");
      window.setTimeout(() => setSyncVotingsState("idle"), 2500);
    } catch (e: any) {
      setSyncVotingsState("error");
      setLastError(String(e?.message ?? t("admin.syncVotings.errorFallback")));
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-[Manrope]">
          {t("admin.title")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {t("admin.onlyForAdmin")}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {t("admin.actionsTitle")}
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {t("admin.actionsDesc")}
        </p>

        {lastError ? (
          <div className="mt-4 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50/70 dark:bg-red-950/30 p-3 text-sm text-red-800 dark:text-red-200">
            {lastError}
          </div>
        ) : null}

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-gray-200 dark:border-slate-700 p-4">
            <div className="font-semibold text-gray-900 dark:text-white">
              {t("admin.syncDeputies.title")}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t("admin.syncDeputies.desc")}
            </div>
            <button
              onClick={runSyncDeputies}
              disabled={syncDeputiesState === "loading"}
              className="mt-3 px-4 py-2 rounded-xl font-bold text-white bg-maroon-800 hover:bg-maroon-900 dark:bg-maroon-700 dark:hover:bg-maroon-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {syncDeputiesState === "loading"
                ? t("admin.syncDeputies.pending")
                : syncDeputiesState === "success"
                  ? t("admin.syncDeputies.success")
                  : t("admin.syncDeputies.idle")}
            </button>
          </div>
          <div className="rounded-2xl border border-gray-200 dark:border-slate-700 p-4">
            <div className="font-semibold text-gray-900 dark:text-white">
              {t("admin.syncVotings.title")}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t("admin.syncVotings.desc")}
            </div>
            <button
              onClick={runSyncVotings}
              disabled={syncVotingsState === "loading"}
              className="mt-3 px-4 py-2 rounded-xl font-bold text-white bg-maroon-800 hover:bg-maroon-900 dark:bg-maroon-700 dark:hover:bg-maroon-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {syncVotingsState === "loading"
                ? t("admin.syncVotings.pending")
                : syncVotingsState === "success"
                  ? t("admin.syncVotings.success")
                  : t("admin.syncVotings.idle")}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {t("admin.moderation.title")}
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {t("admin.moderation.desc")}
        </p>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-slate-700">
                <th className="py-3 pr-4">{t("admin.moderation.author")}</th>
                <th className="py-3 pr-4">{t("admin.moderation.content")}</th>
                <th className="py-3 pr-4">{t("admin.moderation.date")}</th>
                <th className="py-3 pr-4">{t("admin.moderation.signals")}</th>
                <th className="py-3 pr-4">{t("admin.moderation.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((row) => (
                <tr
                  key={row}
                  className="border-b border-gray-100 dark:border-slate-700/60 text-gray-800 dark:text-gray-100"
                >
                  <td className="py-3 pr-4 font-semibold whitespace-nowrap">
                    @uzytkownik{row}
                  </td>
                  <td className="py-3 pr-4 min-w-88">
                    <span className="text-gray-500 dark:text-gray-400 italic">
                      {t("admin.moderation.contentPlaceholder")}
                    </span>
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                    2026-05-31 12:0{row}
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <span className="inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-2.5 py-1 text-xs font-bold">
                      score: {row * 12}
                    </span>
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-colors"
                        disabled
                        title={t("admin.moderation.placeholderTitle")}
                      >
                        {t("admin.moderation.approve")}
                      </button>
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white font-bold transition-colors"
                        disabled
                        title={t("admin.moderation.placeholderTitle")}
                      >
                        {t("admin.moderation.reject")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
