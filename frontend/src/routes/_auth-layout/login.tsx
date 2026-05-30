import { useAuth } from "@/auth/AuthProvider";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/_auth-layout/login")({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { login } = useAuth();
  const { redirect } = Route.useSearch();

  console.log(`REDIRECT: ${redirect}`);

  return (
    <div className="transition-colors duration-200 text-slate-900 dark:text-slate-100 h-full">
      <div className="absolute inset-0 -z-100 max-h-[60vh]">
        <img
          src="src/assets/images/parliament_inside.jpg"
          alt="background"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-linear-to-b from-white dark:from-slate-950 via-white/60 dark:via-slate-950/70 to-transparent dark:to-transparent"></div>
        <div className="absolute inset-0 bg-linear-to-t from-white dark:from-slate-950 via-transparent dark:via-transparent to-transparent dark:to-transparent"></div>
      </div>
      <main className="mt-16">
        <section className="max-w-7xl mx-auto px-8 pt-24 pb-32 flex flex-col items-start gap-12">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-maroon-800 dark:text-maroon-200 text-6xl md:text-8xl font-extrabold tracking-tighter leading-[1.05] font-[Manrope]">
              Twoje zdanie ma znaczenie w sercu parlamentu
            </h1>
            <h3 className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Dołącz do społeczności SejmInsight, komentuj głosowania, oceniaj
              posłów i buduj kulturę polityczną.
            </h3>
          </div>
          <div className="flex flex-wrap gap-4 pt-4">
            <button
              className="hero-gradient text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 hover:shadow-2xl hover:shadow-maroon-900/40 transition-all active:scale-95 hover:cursor-pointer"
              onClick={() => login(redirect)}
            >
              Dołącz do inteligencji demokratycznej
            </button>
          </div>
        </section>
        <section className="max-w-7xl mx-auto px-8 pb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            <div className="p-10 rounded-xl shadow-sm transition-all bg-white dark:bg-slate-900">
              <svg
                className="size-8 text-emerald-800 dark:text-emerald-400 bg-emerald-700/10 dark:bg-emerald-400/10 box-content p-3 rounded"
                fill="currentColor"
                viewBox="0 -32 576 576"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M416 192c0-88.4-93.1-160-208-160S0 103.6 0 192c0 34.3 14.1 65.9 38 92-13.4 30.2-35.5 54.2-35.8 54.5-2.2 2.3-2.8 5.7-1.5 8.7S4.8 352 8 352c36.6 0 66.9-12.3 88.7-25 32.2 15.7 70.3 25 111.3 25 114.9 0 208-71.6 208-160zm122 220c23.9-26 38-57.7 38-92 0-66.9-53.5-124.2-129.3-148.1.9 6.6 1.3 13.3 1.3 20.1 0 105.9-107.7 192-240 192-10.8 0-21.3-.8-31.7-1.9C207.8 439.6 281.8 480 368 480c41 0 79.1-9.2 111.3-25 21.8 12.7 52.1 25 88.7 25 3.2 0 6.1-1.9 7.3-4.8 1.3-2.9.7-6.3-1.5-8.7-.3-.3-22.4-24.2-35.8-54.5z" />
              </svg>
              <h3 className="text-3xl font-[Manrope] font-bold mt-6 text-slate-900 dark:text-white">
                Dyskutuj o ustawach
              </h3>
              <p className="text-lg text-gray-500 dark:text-gray-300 mt-4">
                Twój głos w debacie publicznej zyskuje realny wpływ na
                kształtowanie prawa.
              </p>
            </div>
            <div className="p-10 rounded-xl shadow-sm transition-all bg-maroon-800 dark:bg-maroon-900">
              <svg
                className="size-8 text-white bg-maroon-100/15 box-content p-3 rounded"
                fill="currentColor"
                viewBox="0 -64 640 640"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M608 320h-64v64h22.4c5.3 0 9.6 3.6 9.6 8v16c0 4.4-4.3 8-9.6 8H73.6c-5.3 0-9.6-3.6-9.6-8v-16c0-4.4 4.3-8 9.6-8H96v-64H32c-17.7 0-32 14.3-32 32v96c0 17.7 14.3 32 32 32h576c17.7 0 32-14.3 32-32v-96c0-17.7-14.3-32-32-32zm-96 64V64.3c0-17.9-14.5-32.3-32.3-32.3H160.4C142.5 32 128 46.5 128 64.3V384h384zM211.2 202l25.5-25.3c4.2-4.2 11-4.2 15.2.1l41.3 41.6 95.2-94.4c4.2-4.2 11-4.2 15.2.1l25.3 25.5c4.2 4.2 4.2 11-.1 15.2L300.5 292c-4.2 4.2-11 4.2-15.2-.1l-74.1-74.7c-4.3-4.2-4.2-11 0-15.2z" />
              </svg>
              <h3 className="text-3xl font-[Manrope] font-bold mt-6 text-white">
                Oceniaj posłów
              </h3>
              <p className="text-lg text-maroon-50/80 dark:text-maroon-100/80 mt-4">
                Sprawdzaj frekwencję, aktywność i głosuj za zaufaniem dla swoich
                reprezentantów.
              </p>
            </div>
            <div className="p-10 rounded-xl shadow-sm transition-all bg-white dark:bg-slate-900">
              <svg
                className="size-8 text-emerald-800 dark:text-emerald-400 bg-emerald-700/10 dark:bg-emerald-400/10 box-content p-3 rounded"
                fill="currentColor"
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M496 384H64V80c0-8.84-7.16-16-16-16H16C7.16 64 0 71.16 0 80v336c0 17.67 14.33 32 32 32h464c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16zM464 96H345.94c-21.38 0-32.09 25.85-16.97 40.97l32.4 32.4L288 242.75l-73.37-73.37c-12.5-12.5-32.76-12.5-45.25 0l-68.69 68.69c-6.25 6.25-6.25 16.38 0 22.63l22.62 22.62c6.25 6.25 16.38 6.25 22.63 0L192 237.25l73.37 73.37c12.5 12.5 32.76 12.5 45.25 0l96-96 32.4 32.4c15.12 15.12 40.97 4.41 40.97-16.97V112c.01-8.84-7.15-16-15.99-16z" />
              </svg>
              <h3 className="text-3xl font-[Manrope] font-bold mt-6 text-slate-900 dark:text-white">
                Twórz analizy
              </h3>
              <p className="text-lg text-gray-500 dark:text-gray-300 mt-4">
                Dziel się swoją wiedzą i twórz głębokie raporty na temat
                polityki państwa.
              </p>
            </div>
          </div>
        </section>
        <section className="max-w-7xl mx-auto px-8 pb-32">
          <div className="bg-maroon-800/4 dark:bg-slate-900/60 rounded-xl p-8 md:p-16 flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2 space-y-8">
              <h2 className="text-4xl font-[Manrope] font-extrabold text-slate-900 dark:text-white">
                Analiza społeczna w czasie rzeczywistym
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <svg
                    className="size-8 text-emerald-800 dark:text-emerald-400 bg-white dark:bg-slate-800 box-content p-3 rounded"
                    fill="currentColor"
                    viewBox="0 0 512 512"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M332.8 320h38.4c6.4 0 12.8-6.4 12.8-12.8V172.8c0-6.4-6.4-12.8-12.8-12.8h-38.4c-6.4 0-12.8 6.4-12.8 12.8v134.4c0 6.4 6.4 12.8 12.8 12.8zm96 0h38.4c6.4 0 12.8-6.4 12.8-12.8V76.8c0-6.4-6.4-12.8-12.8-12.8h-38.4c-6.4 0-12.8 6.4-12.8 12.8v230.4c0 6.4 6.4 12.8 12.8 12.8zm-288 0h38.4c6.4 0 12.8-6.4 12.8-12.8v-70.4c0-6.4-6.4-12.8-12.8-12.8h-38.4c-6.4 0-12.8 6.4-12.8 12.8v70.4c0 6.4 6.4 12.8 12.8 12.8zm96 0h38.4c6.4 0 12.8-6.4 12.8-12.8V108.8c0-6.4-6.4-12.8-12.8-12.8h-38.4c-6.4 0-12.8 6.4-12.8 12.8v198.4c0 6.4 6.4 12.8 12.8 12.8zM496 384H64V80c0-8.84-7.16-16-16-16H16C7.16 64 0 71.16 0 80v336c0 17.67 14.33 32 32 32h464c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16z" />
                  </svg>
                  <div>
                    <h4 className="font-bold text-xl font-[Manrope] text-slate-900 dark:text-white">
                      Sentyment obywatelski
                    </h4>
                    <p className="text-lg text-gray-500 dark:text-gray-300 ">
                      Dziel się swoją wiedzą i twórz głębokie raporty na temat
                      polityki państwa.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <svg
                    className="size-8 text-emerald-800 dark:text-emerald-400 bg-white dark:bg-slate-800 box-content p-3 rounded"
                    fill="currentColor"
                    viewBox="0 0 512 512"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
                  </svg>
                  <div>
                    <h4 className="font-bold text-xl font-[Manrope] text-slate-900 dark:text-white">
                      Transparentność
                    </h4>
                    <p className="text-lg text-gray-500 dark:text-gray-300 ">
                      Koniec z politycznymi grami w cieniu. Każda decyzja jest
                      pod lupą społeczności.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="bg-white/70 dark:bg-slate-950/60 rounded-2xl p-6 shadow-2xl z-10 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-b-gray-300/50 dark:border-b-slate-700/60">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      @JanKowalski
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    2 min temu
                  </span>
                </div>
                <p className="text-sm font-medium italic text-slate-800 dark:text-slate-200">
                  "Analiza ustawy o cyfryzacji pokazuje, że realne oszczędności
                  dla budżetu pojawią się dopiero w 2026. Czy ktoś jeszcze
                  zauważył ten zapis w art. 14?"
                </p>
                <div className="flex gap-4 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  <span>124 głosy</span>
                  <span>42 odpowiedzi</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full py-12 px-8 border-t border-t-gray-300/50 dark:border-t-slate-800/60 bg-white/70 dark:bg-slate-950/60 backdrop-blur flex flex-col md:flex-row gap-2 md:gap-0 justify-between items-center">
        <span className="font-bold text-2xl text-slate-900 dark:text-slate-100">
          SejmInsight
        </span>
        <div className="flex md:gap-4 xl:gap-8 text-sm">
          <a
            className="text-slate-500 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-400 font-semibold hover:underline"
            href="#"
          >
            Polityka prywatności
          </a>
          <a
            className="text-slate-500 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-400 font-semibold hover:underline"
            href="#"
          >
            Regulamin
          </a>
          <a
            className="text-slate-500 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-400 font-semibold hover:underline"
            href="#"
          >
            Kontakt
          </a>
        </div>
        <span className="text-slate-500 dark:text-slate-400">
          © 2026 SejmInsight. Inteligencja Demokratyczna.
        </span>
      </footer>
    </div>
  );
}
