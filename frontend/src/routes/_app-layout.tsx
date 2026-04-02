import { createFileRoute, Outlet } from "@tanstack/react-router";
import NavBar from "@/components/narBar";

export const Route = createFileRoute("/_app-layout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <NavBar />
      <div className="flex flex-row h-[calc(100vh-4rem)]">
        <aside className="h-full w-1/6 max-w-80 bg-red-500">asd</aside>
        <Outlet />
      </div>
    </>
  );
}
