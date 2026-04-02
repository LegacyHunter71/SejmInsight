import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { userManager } from "@/auth/AuthProvider";

export const Route = createFileRoute("/_auth-layout/silent-callback")({
  component: RouteComponent,
});

function RouteComponent() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    userManager.signinSilentCallback().catch((e) => {
      if (cancelled) return;
      setError(e instanceof Error ? e.message : String(e));
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) return <pre>Silent renew error: {error}</pre>;
  return <div>silent</div>;
}
