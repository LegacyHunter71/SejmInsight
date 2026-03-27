import { authGuard } from "@/auth/authGuard";
import { createFileRoute } from "@tanstack/react-router";

// import { userManager } from "@/auth/AuthProvider";

export const Route = createFileRoute("/")({
  beforeLoad: authGuard,
  component: RouteComponent,
});

function RouteComponent() {
  return <span>Main Page</span>;
}
