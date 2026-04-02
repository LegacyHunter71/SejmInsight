import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/_auth-layout/login")({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { auth } = Route.useRouteContext();
  const { redirect } = Route.useSearch();

  console.log(`REDIRECT: ${redirect}`);

  return (
    <>
      <div className="absolute inset-0 -z-100 max-h-[60vh]">
        <img
          src="src/assets/images/parliament_inside.jpg"
          alt="background"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-linear-to-b from-white via-white/70 to-transparent"></div>
        <div className="absolute inset-0 bg-linear-to-t from-white via-transparent to-transparent"></div>
      </div>
      <main>
        <section className="max-w-7xl mx-auto px-8 pt-24 pb-32 flex flex-col items-start gap-12">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-maroon-800 font-headline text-6xl md:text-8xl font-extrabold tracking-tighter leading-[1.05]">
              Twoje zdanie ma znaczenie w sercu parlamentu
            </h1>
            <h3 className="text-xl md:text-2xl text-on-surface-variant max-w-2xl leading-relaxed">
              Dołącz do społeczności SejmInsight, komentuj głosowania, oceniaj
              posłów i buduj kulturę polityczną.
            </h3>
          </div>
          <div className="flex flex-wrap gap-4 pt-4">
            <button
              className="hero-gradient text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 hover:shadow-2xl hover:shadow-maroon-900/40 transition-all active:scale-95"
              onClick={() =>
                auth.signinRedirect({
                  state: {
                    redirect,
                  },
                } as any)
              }
            >
              Zaloguj się
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
