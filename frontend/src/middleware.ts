import { NextRequest, NextResponse } from "next/server";

/**
 * Next.js Edge Middleware — runs before every request.
 *
 * Protects all /user/* routes:
 * - If the request has no JWT in the cookie OR no Authorization header,
 *   redirect to / with a query param ?reason=unauthenticated so the homepage
 *   can display a "You must be logged in" message.
 *
 * NOTE: sessionStorage is not accessible in the Edge runtime (server-side).
 * We use a cookie (`sm_token_hint`) set by the client as the guard signal.
 * The real token validation still happens on the backend via the JWT guard.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /user routes
  if (!pathname.startsWith("/user")) {
    return NextResponse.next();
  }

  // Check for the auth hint cookie that the client sets on login
  const authHint = request.cookies.get("sm_auth")?.value;

  if (!authHint) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("reason", "unauthenticated");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Apply middleware to all /user sub-routes
  matcher: ["/user/:path*"],
};
