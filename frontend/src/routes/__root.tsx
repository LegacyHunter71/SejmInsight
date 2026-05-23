import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { type RouterContext } from "@/main";

// import "@/styles/shared.css";

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => <Outlet />,
});
