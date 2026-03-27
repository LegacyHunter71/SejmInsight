import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/login")({
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
    <button
      onClick={() =>
        auth.signinRedirect({
          state: {
            redirect,
          },
        } as any)
      }
    >
      Zaloguj przez Keycloak i wróć do {redirect}
    </button>
  );
}
