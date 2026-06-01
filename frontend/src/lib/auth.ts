const TOKEN_KEY = "sm_token";
// Short-lived cookie used by Edge Middleware to protect /user/* routes.
// Value is just "1" — actual JWT validation is done server-side.
const COOKIE_NAME = "sm_auth";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function storage(): Storage | null {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

function setCookie(name: string, value: string, days = 1) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

/** Retrieve the stored JWT token */
export function getToken(): string | null {
  return storage()?.getItem(TOKEN_KEY) ?? null;
}

/**
 * Persist the JWT token after a successful login.
 * Also sets the sm_auth cookie so Edge Middleware can protect /user/* routes.
 */
export function setToken(token: string): void {
  storage()?.setItem(TOKEN_KEY, token);
  setCookie(COOKIE_NAME, "1", 30); // 30-day hint cookie
}

/**
 * Remove the JWT token from storage and clear the auth cookie.
 * Called on logout or when a 401 is received.
 */
export function clearToken(): void {
  storage()?.removeItem(TOKEN_KEY);
  deleteCookie(COOKIE_NAME);
}

/** Return true when a valid-looking token is present */
export function isAuthenticated(): boolean {
  return !!getToken();
}

/**
 * Instant logout:
 *  1. Clears the local token AND cookie immediately (synchronous, instant UI effect).
 *  2. Calls the backend /auth/logout in the background to blacklist the JWT.
 *  3. Redirects to the specified path.
 */
export function logout(redirectTo = "/"): void {
  const token = getToken();

  // 1. Clear local state FIRST — instant effect, no waiting for the network
  clearToken();

  // 2. Blacklist the token on the backend in the background (fire-and-forget)
  if (token) {
    fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).catch(() => {
      // Ignore network errors — the local session is already cleared
    });
  }

  // 3. Redirect immediately
  if (typeof window !== "undefined") {
    window.location.href = redirectTo;
  }
}
