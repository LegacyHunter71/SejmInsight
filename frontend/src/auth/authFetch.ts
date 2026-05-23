import { keycloak } from "./AuthProvider";

export async function authFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
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
