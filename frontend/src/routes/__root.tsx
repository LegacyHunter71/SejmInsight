import * as React from "react";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { type RouterContext } from "@/main";
import NavBar from "@/components/navbar";

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <NavBar />
      <Outlet />
    </React.Fragment>
  );
}
