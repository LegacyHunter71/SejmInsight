import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { authFetch } from "@/auth/authFetch";

type Deputy = {
  id: number;
  first_name: string;
  last_name: string;
  club: string;
  districtName: string;
  active: boolean;
  attendanceRate: number;
};

type PageResponse<T> = {
  content: T[];
  totalPages: number;
  totalElements: number;
};

export const Route = createFileRoute("/_app-layout/deputies/")({
  loader: async () => {
    // Pobieramy do 500 rekordów, by mieć wszystkich 460 posłów od razu i móc ich filtrować
    const res = await authFetch(
      "https://sejm-insight.duckdns.org/api/deputies?page=0&size=500&sort=lastName",
    );
    console.log(res.status, res.statusText);
    if (!res.ok) throw new Error("Failed to fetch deputies data");
    const data = (await res.json()) as PageResponse<Deputy>;
    console.log(data);
    return data.content;
  },
  component: RouteComponent,
});

function RouteComponent() {
  const deputies = Route.useLoaderData();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDeputies = deputies.filter((deputy) => {
    const fullName = `${deputy.first_name} ${deputy.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  console.log(filteredDeputies[0]);

  return (
    <div className="p-8 space-y-8 w-full">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-[Manrope]">
            Katalog Posłów
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Przeglądaj, filtruj i sprawdzaj statystyki parlamentarzystów.
          </p>
        </div>
        <div className="w-full md:w-1/3">
          <input
            type="text"
            placeholder="Szukaj po nazwisku..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-maroon-800 dark:focus:ring-maroon-600 focus:outline-none transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDeputies.map((deputy) => (
          <Link
            key={deputy.id}
            to="/deputies/$deputyId"
            params={{ deputyId: deputy.id.toString() }}
            className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
          >
            <div className="w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-full mb-4 flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold">
              {deputy.first_name.charAt(0)}
              {deputy.last_name.charAt(0)}
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-maroon-800 dark:group-hover:text-maroon-400 transition-colors">
              {deputy.first_name} {deputy.last_name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {deputy.club} • {deputy.districtName}
            </p>
            <div className="mt-4 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              Frekwencja: {deputy.attendanceRate}%
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
