import { redirect } from "@tanstack/react-router";
import { keycloak } from "./AuthProvider";

export const authGuard = async ({ location }: { location: any }) => {
  // Keycloak.authenticated jest booleanem
  if (!keycloak.authenticated) {
    throw redirect({
      to: "/login",
      search: {
        redirect: location.href,
      },
    });
  }
};
