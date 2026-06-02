import { adminGuard } from "@/auth/adminGuard";
import {
  syncDeputies,
  syncVotings,
  getPendingComments,
  approveComment,
  rejectComment,
} from "@/api/admin";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
  const [pendingComments, setPendingComments] = useState<
    | import("@/generated/api-types").components["schemas"]["AdminCommentDto"][]
    | null
  >(null);
  const [pendingLoading, setPendingLoading] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>(
    {},
  );

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

  // Load pending comments
  const loadPending = async () => {
    setLastError(null);
    setPendingLoading(true);
    try {
      const list = await getPendingComments();
      setPendingComments(list ?? []);
    } catch (e: any) {
      setLastError(String(e?.message ?? t("admin.moderation.loadError")));
    } finally {
      setPendingLoading(false);
    }
  };

  // load on mount
  useEffect(() => {
    void loadPending();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
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
          {pendingLoading ? (
            <div className="text-center text-gray-500">
              {t("admin.moderation.loading")}
            </div>
          ) : (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-slate-700">
                  <th className="py-3 pr-4">{t("admin.moderation.author")}</th>
                  <th className="py-3 pr-4">{t("admin.moderation.content")}</th>
                  <th className="py-3 pr-4">{t("admin.moderation.date")}</th>
                  <th className="py-3 pr-4">
                    {t("admin.moderation.metadata")}
                  </th>
                  <th className="py-3 pr-4">{t("admin.moderation.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {(pendingComments || []).map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-gray-100 dark:border-slate-700/60 text-gray-800 dark:text-gray-100"
                  >
                    <td className="py-3 pr-4 font-semibold whitespace-nowrap">
                      {c.author_name || c.author_id || "-"}
                    </td>
                    <td className="py-3 pr-4 min-w-88">
                      <div className="text-gray-800 dark:text-gray-100">
                        {c.content}
                      </div>
                    </td>
                    <td className="py-3 pr-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                      {c.created_at
                        ? new Date(c.created_at).toLocaleString()
                        : "-"}
                    </td>
                    <td className="py-3 pr-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        {c.deputy_id != null && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Poseł ID: {c.deputy_id}
                          </span>
                        )}
                        {c.vote_term != null && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Głosowanie: {c.vote_term} / {c.proceeding_no} /{" "}
                            {c.voting_no}
                          </span>
                        )}
                        {c.parent_id && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            W odpowiedzi na: {c.parent_id}
                          </span>
                        )}
                        <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-700 w-fit mt-1 text-gray-700 dark:text-gray-300">
                          Status: {c.moderation_status ?? "PENDING"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={async () => {
                            if (!c.id) return;
                            setActionLoading((s) => ({ ...s, [c.id!]: true }));
                            setLastError(null);
                            try {
                              await approveComment(c.id!);
                              setPendingComments((prev) =>
                                (prev || []).filter((x) => x.id !== c.id),
                              );
                            } catch (e: any) {
                              setLastError(
                                String(
                                  e?.message ??
                                    t("admin.moderation.actionError"),
                                ),
                              );
                            } finally {
                              setActionLoading((s) => ({
                                ...s,
                                [c.id!]: false,
                              }));
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                          disabled={actionLoading[c.id ?? ""]}
                          title={t("admin.moderation.approve")}
                        >
                          {actionLoading[c.id ?? ""]
                            ? t("admin.moderation.processing")
                            : t("admin.moderation.approve")}
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            if (!c.id) return;
                            setActionLoading((s) => ({ ...s, [c.id!]: true }));
                            setLastError(null);
                            try {
                              await rejectComment(c.id!);
                              setPendingComments((prev) =>
                                (prev || []).filter((x) => x.id !== c.id),
                              );
                            } catch (e: any) {
                              setLastError(
                                String(
                                  e?.message ??
                                    t("admin.moderation.actionError"),
                                ),
                              );
                            } finally {
                              setActionLoading((s) => ({
                                ...s,
                                [c.id!]: false,
                              }));
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                          disabled={actionLoading[c.id ?? ""]}
                          title={t("admin.moderation.reject")}
                        >
                          {actionLoading[c.id ?? ""]
                            ? t("admin.moderation.processing")
                            : t("admin.moderation.reject")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
