import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define public routes that don't require authentication
const publicRoutes = ["/", "/login", "/signup"];

// Define routes that should redirect to dashboard if user is already authenticated
const authRoutes = ["/login", "/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get auth token from cookies
  const authToken = request.cookies.get("auth-token")?.value;
  const isAuthenticated = !!authToken;

  // Check if the current route is public
  const isPublicRoute = publicRoutes.some((route) => pathname === route);

  // Check if the current route is an auth route (login/signup)
  const isAuthRoute = authRoutes.some((route) => pathname === route);

  // If user is authenticated and trying to access login/signup, redirect to dashboard
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If user is not authenticated and trying to access protected route, redirect to login
  if (!isAuthenticated && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    // Store the attempted URL to redirect back after login (optional)
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     * - api routes (if you want API routes to be unprotected)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
