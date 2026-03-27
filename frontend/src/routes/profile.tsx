import { authGuard } from "@/auth/authGuard";
import { useAuth } from "@/auth/AuthProvider";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/profile")({
  beforeLoad: authGuard,
  component: RouteComponent,
});

function RouteComponent() {
  const { user, isAuthenticated } = useAuth();

  const profileInfo = user?.profile
    ? (Object.entries(user.profile) as [string, unknown][]).map(
        ([key, value]) => (
          <li key={key}>
            {key}: {String(value)}
          </li>
        ),
      )
    : [];

  if (!isAuthenticated) return null;

  return (
    <>
      <ul>{profileInfo}</ul>
    </>
  );
}
