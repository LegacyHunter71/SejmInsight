import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useDeputies } from "@/hooks/useDeputies";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_app-layout/deputies/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(18);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setSearchQuery(searchTerm.trim()), 350);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    setPage(0);
  }, [searchQuery, size]);

  return (
    <div className="p-8 space-y-8 w-full">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-[Manrope]">
            {t("deputies.catalogTitle")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t("deputies.catalogSubtitle")}
          </p>
        </div>
        <div className="w-full md:w-1/3">
          <input
            type="text"
            placeholder={t("deputies.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-maroon-800 dark:focus:ring-maroon-600 focus:outline-none transition-colors"
          />
        </div>
      </div>

      <DeputiesList
        page={page}
        size={size}
        searchQuery={searchQuery}
        setPage={setPage}
        setSize={setSize}
      />
    </div>
  );
}

function DeputiesList({
  page,
  size,
  searchQuery,
  setPage,
  setSize,
}: {
  page: number;
  size: number;
  searchQuery: string;
  setPage: Dispatch<SetStateAction<number>>;
  setSize: Dispatch<SetStateAction<number>>;
}) {
  const { t } = useTranslation();
  const params = { page, size, sort: ["lastName"], name: searchQuery } as any;
  const { data: deputiesPage, isLoading } = useDeputies(params);

  const list = Array.isArray(deputiesPage)
    ? deputiesPage
    : (deputiesPage?.content ?? []);
  const totalPages = Array.isArray(deputiesPage)
    ? 0
    : (deputiesPage?.total_pages ?? 0);
  const currentPage = Array.isArray(deputiesPage)
    ? page
    : (deputiesPage?.number ?? page);

  console.log("DeputiesPage Data:", deputiesPage);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-1 md:col-span-2 xl:col-span-3 text-center text-gray-500">
            {t("deputies.loading")}
          </div>
        ) : (
          list.map((deputy: any) => (
            <Link
              key={deputy.id}
              to="/deputies/$deputyId"
              params={{ deputyId: deputy.id.toString() }}
              className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
            >
              <div className="w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-full mb-4 flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold">
                {(deputy.first_name ?? deputy.firstName)?.charAt(0)}
                {(deputy.last_name ?? deputy.lastName)?.charAt(0)}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-maroon-800 dark:group-hover:text-maroon-400 transition-colors">
                {deputy.first_name ?? deputy.firstName}{" "}
                {deputy.last_name ?? deputy.lastName}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {deputy.club} • {deputy.district_name ?? deputy.districtName}
              </p>
              <div className="flex flex-row gap-4">
                <div className="mt-4 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                  {t("deputies.attendance")}: {deputy.attendanceRate}%
                </div>
                <div className="mt-4 text-sm font-semibold text-blue-800 dark:text-blue-400">
                  {t("deputies.votings")}: {deputy.presentVotings ?? "—"}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <span>{t("pagination.pageSize")}</span>
          <select
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="px-2 py-1 rounded"
          >
            {[9, 18, 36].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={currentPage <= 0}
            className="px-3 py-2 bg-gray-200 dark:bg-slate-700 rounded"
          >
            {t("pagination.prev")}
          </button>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {t("pagination.page")} {currentPage + 1} / {totalPages || 1}
          </div>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={totalPages ? currentPage + 1 >= totalPages : false}
            className="px-3 py-2 bg-gray-200 dark:bg-slate-700 rounded"
          >
            {t("pagination.next")}
          </button>
        </div>
      </div>
    </>
  );
}
