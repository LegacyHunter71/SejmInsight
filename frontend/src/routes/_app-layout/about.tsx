import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_app-layout/about")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl p-8 space-y-6">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-[Manrope]">
        {t("about.title")}
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
        {t("about.body")}
      </p>
      <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-transparent dark:border-blue-800/50 p-4 rounded-xl text-sm">
        {t("about.notice")}
      </div>
    </div>
  );
}
