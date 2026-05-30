import { redirect } from "@tanstack/react-router";
import { keycloak } from "./AuthProvider";

export const adminGuard = async ({ location }: { location: any }) => {
  if (!keycloak.authenticated) {
    throw redirect({
      to: "/login",
      search: {
        redirect: location.href,
      },
    });
  }

  const roles = keycloak.realmAccess?.roles || [];
  const isAdmin = roles.some((r) => (r || "").toUpperCase() === "ADMIN");

  if (!isAdmin) {
    throw redirect({
      to: "/",
    });
  }
};
