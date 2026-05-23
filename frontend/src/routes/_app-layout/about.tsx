import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app-layout/about")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="max-w-3xl p-8 space-y-6">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-[Manrope]">
        O projekcie SejmInsight
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
        SejmInsight to nowoczesna platforma analityczno-społecznościowa budująca
        przestrzeń do debaty publicznej. Naszym celem jest transparentność i
        udostępnienie narzędzi pozwalających każdemu obywatelowi na ocenę
        działań swoich przedstawicieli.
      </p>
      <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-transparent dark:border-blue-800/50 p-4 rounded-xl text-sm">
        Projekt jest w fazie wczesnego rozwoju. Funkcjonalności takie jak
        logowanie czy agregacja danych z API Sejmu są systematycznie wdrażane.
      </div>
    </div>
  );
}
