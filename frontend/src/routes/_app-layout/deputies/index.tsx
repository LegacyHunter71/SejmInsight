import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_app-layout/deputies/")({
  component: RouteComponent,
});

// Mockup danych do zastąpienia API w przyszłości
const mockDeputies = [
  {
    id: "1",
    name: "Jan Kowalski",
    club: "Koalicja Obywatelska",
    attendance: "98%",
  },
  {
    id: "2",
    name: "Anna Nowak",
    club: "Prawo i Sprawiedliwość",
    attendance: "95%",
  },
  {
    id: "3",
    name: "Piotr Wiśniewski",
    club: "Trzecia Droga",
    attendance: "89%",
  },
  { id: "4", name: "Katarzyna Lewandowska", club: "Lewica", attendance: "99%" },
  { id: "5", name: "Michał Wójcik", club: "Konfederacja", attendance: "91%" },
];

function RouteComponent() {
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
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-maroon-800 dark:focus:ring-maroon-600 focus:outline-none transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockDeputies.map((deputy) => (
          <Link
            key={deputy.id}
            to="/deputies/$deputyId"
            params={{ deputyId: deputy.id }}
            className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
          >
            <div className="w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-full mb-4 flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold">
              {deputy.name.charAt(0)}
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-maroon-800 dark:group-hover:text-maroon-400 transition-colors">
              {deputy.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {deputy.club}
            </p>
            <div className="mt-4 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              Frekwencja: {deputy.attendance}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
