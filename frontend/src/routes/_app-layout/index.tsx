import { authGuard } from "@/auth/authGuard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app-layout/")({
  beforeLoad: authGuard,
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-5/6 overflow-auto">
      <span>Main Page</span>
    </div>
  );
}
