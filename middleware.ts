import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Public routes that don't require authentication
const publicRoutes = ["/login", "/register", "/forgot-password"];

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get access token from cookies
  const accessToken = request.cookies.get("access_token")?.value;
  const isAuthenticated = !!accessToken;

  // Check if the current route is public
  const isPublicRoute = publicRoutes.some((route) => pathname === route);
  const isAuthRoute = authRoutes.some((route) => pathname === route);

  // Redirect root to login or dashboard based on auth status
  if (pathname === "/") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // If user is not authenticated and trying to access protected route
  if (!isAuthenticated && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If user is authenticated and trying to access auth routes (login, register)
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Add security headers
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)",
  ],
};
