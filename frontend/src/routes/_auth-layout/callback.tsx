import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth, userManager } from "@/auth/AuthProvider";

export const Route = createFileRoute("/_auth-layout/callback")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { loadUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    userManager
      .signinRedirectCallback()
      .then(async (user) => {
        await loadUser();

        const state = user?.state as { redirect?: string } | undefined;
        let to = state?.redirect || "/";

        if (!to || to.includes("/callback") || to.includes("/login")) {
          to = "/";
        }

        navigate({ to, replace: true });
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : String(e));
      });

    return () => {
      cancelled = true;
    };
  }, [navigate, loadUser]);

  if (error) {
    return (
      <div>
        <h2>Nie udało się zalogować</h2>
        <pre>{error}</pre>
      </div>
    );
  }

  return <div>Logowanie…</div>;
}
