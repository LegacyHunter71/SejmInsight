import { registerUser } from "@/api/users";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";

export const Route = createFileRoute("/_auth-layout/register" as any)({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  component: RouteComponent,
});

type FormState = {
  email: string;
  firstName: string;
  lastName: string;
};

function RouteComponent() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const redirect = ("redirect" in search ? search.redirect : undefined) as
    | string
    | undefined;

  const [form, setForm] = useState<FormState>({
    email: "",
    firstName: "",
    lastName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await registerUser({
        email: form.email.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
      });

      setSuccess(true);

      // After successful registration, send user to login (Keycloak login still used for auth)
      void navigate({
        to: "/login",
        search: redirect ? { redirect } : undefined,
      });
    } catch (e: any) {
      const msg =
        e?.details?.message ??
        e?.message ??
        "Nie udało się utworzyć konta. Spróbuj ponownie.";
      setError(String(msg));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="transition-colors duration-200 text-slate-900 dark:text-slate-100 h-full">
      <main className="mt-16">
        <section className="max-w-2xl mx-auto px-6 pt-16 pb-24">
          <h1 className="text-4xl font-[Manrope] font-extrabold tracking-tight text-maroon-800 dark:text-maroon-200">
            Załóż konto
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Zarejestruj się w SejmInsight. Po utworzeniu konta wrócisz do
            logowania.
          </p>

          <form
            onSubmit={onSubmit}
            className="mt-10 bg-white/70 dark:bg-slate-950/60 backdrop-blur rounded-2xl border border-gray-200/60 dark:border-slate-800/60 p-6 md:p-8 space-y-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Imię
                </span>
                <input
                  value={form.firstName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, firstName: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300/70 dark:border-slate-700/70 bg-white dark:bg-slate-900 px-4 py-3 outline-none focus:ring-2 focus:ring-maroon-600/40"
                  autoComplete="given-name"
                  required
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Nazwisko
                </span>
                <input
                  value={form.lastName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, lastName: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300/70 dark:border-slate-700/70 bg-white dark:bg-slate-900 px-4 py-3 outline-none focus:ring-2 focus:ring-maroon-600/40"
                  autoComplete="family-name"
                  required
                />
              </label>
            </div>

            <label className="space-y-2 block">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Email
              </span>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                className="w-full rounded-lg border border-gray-300/70 dark:border-slate-700/70 bg-white dark:bg-slate-900 px-4 py-3 outline-none focus:ring-2 focus:ring-maroon-600/40"
                autoComplete="email"
                required
              />
            </label>

            {error && (
              <div className="rounded-lg border border-red-300/60 bg-red-50/70 dark:bg-red-950/40 p-3 text-sm text-red-800 dark:text-red-200">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-lg border border-emerald-300/60 bg-emerald-50/70 dark:bg-emerald-950/40 p-3 text-sm text-emerald-800 dark:text-emerald-200">
                Konto utworzone. Przekierowanie do logowania…
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between pt-2">
              <button
                disabled={isSubmitting}
                className="hero-gradient text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all active:scale-95 duration-200 shadow-lg shadow-maroon-800/20 disabled:opacity-60 disabled:cursor-not-allowed"
                type="submit"
              >
                {isSubmitting ? "Tworzenie konta…" : "Zarejestruj się"}
              </button>

              <Link
                to="/login"
                search={redirect ? { redirect } : undefined}
                className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 hover:underline"
              >
                Masz już konto? Zaloguj się
              </Link>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
