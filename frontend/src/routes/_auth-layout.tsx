import AuthNavBar from "@/components/authNavBar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth-layout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <AuthNavBar />
      <Outlet />
    </>
  );
}
