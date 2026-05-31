import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_app-layout/debates/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  const mockDebates = [
    {
      id: 1,
      title: "#UstawaBudżetowa",
      description: t("debates.index.items.budget.description"),
      posts: "12.5k",
    },
    {
      id: 2,
      title: "#ReformaZdrowia",
      description: t("debates.index.items.health.description"),
      posts: "8.2k",
    },
    {
      id: 3,
      title: "#Głosowanie234",
      description: t("debates.index.items.vote.description"),
      posts: "5.1k",
    },
  ];

  return (
    <div className="p-8 space-y-8 w-full">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-[Manrope]">
          {t("debates.index.title")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {t("debates.index.subtitle")}
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
                {item.posts} {t("debates.index.postsSuffix")}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
