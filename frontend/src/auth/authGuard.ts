// src/auth/authGuard.ts
import { redirect } from "@tanstack/react-router";
import { userManager } from "./AuthProvider";

export const authGuard = async ({ location }: { location: any }) => {
  const user = await userManager.getUser();

  if (!user || user.expired) {
    throw redirect({
      to: "/login",
      search: {
        redirect: location.href,
      },
    });
  }
};
