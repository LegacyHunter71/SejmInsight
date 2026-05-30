import { createRouter, RouterProvider } from "@tanstack/react-router";
// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./styles/shared.css";

import { AuthProvider, useAuth } from "./auth/AuthProvider";
import { routeTree } from "./routeTree.gen";
import { StrictMode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export interface RouterContext {
  auth: ReturnType<typeof useAuth>;
}

const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const auth = useAuth();

  if (auth.isLoading) return <div>Loading...</div>;

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} context={{ auth }} />
    </QueryClientProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
