export function redirectToLogin(redirect?: string) {
  const url = new URL("/login", window.location.origin);

  const finalRedirect =
    redirect ?? window.location.pathname + window.location.search;
  // Avoid redirect loops if we're already on /login
  if (finalRedirect && !finalRedirect.startsWith("/login")) {
    url.searchParams.set("redirect", finalRedirect);
  }

  window.location.assign(url.toString());
}
