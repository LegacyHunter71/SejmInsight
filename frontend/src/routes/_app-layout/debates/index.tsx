import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_app-layout/debates/")({
  component: RouteComponent,
});

const mockDebates = [
  {
    id: 1,
    title: "#UstawaBudżetowa",
    description:
      "Projekt ustawy budżetowej na rok 2026. Analiza wydatków na obronność i edukację.",
    posts: "12.5k",
  },
  {
    id: 2,
    title: "#ReformaZdrowia",
    description:
      "Zmiany w składce zdrowotnej oraz dofinansowanie szpitali powiatowych.",
    posts: "8.2k",
  },
  {
    id: 3,
    title: "#Głosowanie234",
    description: "Głosowanie nad wotum nieufności dla Ministra Cyfryzacji.",
    posts: "5.1k",
  },
];

function RouteComponent() {
  return (
    <div className="p-8 space-y-8 w-full">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-[Manrope]">
          Debaty i Ustawy
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Dołącz do dyskusji na temat najnowszych projektów legislacyjnych.
          Twoje opinie pomagają budować wgląd społeczny.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {mockDebates.map((item) => (
          <Link
            key={item.id}
            to="/debates/$debateId"
            params={{ debateId: item.id.toString() }}
            className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md dark:hover:shadow-slate-900 transition-shadow cursor-pointer block"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-maroon-800 dark:text-maroon-400 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {item.description}
                </p>
              </div>
              <span className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                {item.posts} opinii
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
