import { keycloak } from "./AuthProvider";

function isPublicRequest(input: RequestInfo | URL): boolean {
  const raw = typeof input === "string" ? input : input.toString();

  // Extract pathname without assuming any particular base URL/host.
  // Works for:
  // - absolute URLs: https://example.com/api/iam/register
  // - relative URLs: /api/iam/register
  // - (rare) relative without leading slash: api/iam/register
  let pathname = raw;
  try {
    pathname = new URL(raw).pathname;
  } catch {
    pathname = raw.split("?")[0].split("#")[0];
    if (!pathname.startsWith("/")) pathname = `/${pathname}`;
  }

  // Public IAM endpoints (no Keycloak session required)
  // Support both direct and reverse-proxy forms.
  return pathname === "/iam/register" || pathname === "/api/iam/register";
}

export async function authFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  if (isPublicRequest(input)) {
    // Do not try to refresh token or force Keycloak login for public endpoints.
    return fetch(input, init);
  }

  // Odśwież token, jeśli wygaśnie w ciągu najbliższych 10 sekund
  try {
    await keycloak.updateToken(10);
  } catch (error) {
    keycloak.login(); // Przekieruj do logowania jeśli odświeżenie padło
    throw new Error("Session expired");
  }

  const headers = new Headers(init.headers);
  if (keycloak.token) {
    headers.set("Authorization", `Bearer ${keycloak.token}`);
  }

  return fetch(input, {
    ...init,
    headers,
  });
}
