import { userManager } from "./AuthProvider";

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export async function authFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  const withAuth = async (): Promise<Response> => {
    const user = await userManager.getUser();
    const token = user?.access_token;

    const headers = new Headers(init.headers);
    if (token) headers.set("Authorization", `Bearer ${token}`);

    return fetch(input, {
      ...init,
      headers,
    });
  };

  const res = await withAuth();
  if (res.status !== 401) return res;

  try {
    await userManager.signinSilent();
  } catch {
    throw new AuthError("Unauthorized (token expired)");
  }

  return withAuth();
}
