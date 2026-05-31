import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const Route = createFileRoute("/_app-layout/")({
  component: RouteComponent,
});

// Mockowe dane do wizualizacji statystyk z dokumentacji (attendance klubów)
const mockAttendanceData = [
  { name: "KO", attendance: 95 },
  { name: "PiS", attendance: 92 },
  { name: "TD", attendance: 96 },
  { name: "Lewica", attendance: 98 },
  { name: "Konfederacja", attendance: 91 },
];

function RouteComponent() {
  const { t } = useTranslation();

  return (
    <div className="p-8 space-y-8 w-full">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-[Manrope]">
          {t("home.title")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">{t("home.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm transition-colors">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            {t("home.charts.attendanceTitle")}
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockAttendanceData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  opacity={0.2}
                />
                <XAxis dataKey="name" tick={{ fill: "#6B7280" }} />
                <YAxis domain={[0, 100]} tick={{ fill: "#6B7280" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  cursor={{ fill: "rgba(115, 20, 34, 0.05)" }}
                />
                <Bar
                  dataKey="attendance"
                  fill="#731422"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm flex flex-col transition-colors">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            {t("home.cards.mostActiveDeputies")}
          </h2>
          <div className="flex-1 flex items-center justify-center text-sm font-medium text-gray-400 dark:text-gray-500 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl">
            {t("home.cards.listLoading")}
          </div>
        </div>
      </div>
    </div>
  );
}
