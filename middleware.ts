import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Public routes that don't require authentication
const publicRoutes = ["/login", "/register", "/forgot-password"];

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ["/login", "/register"];

// Refresh token when remaining time < 15 phút
const MAX_TIME_REFRESH = 15 * 60 * 1000; // 15 minutes

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenExpires: number; // Timestamp in milliseconds
}

// Function to refresh access token
async function refreshAccessToken(
  refreshToken: string,
): Promise<TokenResponse | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      },
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch {
    return null;
  }
}

// Apply new auth cookies to response
function applyAuthCookies(
  response: NextResponse,
  data: TokenResponse,
): NextResponse {
  const maxAgeSeconds = Math.floor((data.tokenExpires - Date.now()) / 1000);

  response.cookies.set("access_token", data.accessToken, {
    path: "/",
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: maxAgeSeconds,
  });

  response.cookies.set("refresh_token", data.refreshToken, {
    path: "/",
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  response.cookies.set("token_expiry", data.tokenExpires.toString(), {
    path: "/",
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: maxAgeSeconds,
  });

  return response;
}

// Clear all auth cookies
function clearAuthCookies(response: NextResponse): NextResponse {
  response.cookies.set("access_token", "", { path: "/", maxAge: 0 });
  response.cookies.set("refresh_token", "", { path: "/", maxAge: 0 });
  response.cookies.set("token_expiry", "", { path: "/", maxAge: 0 });
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get tokens from cookies
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const tokenExpiry = request.cookies.get("token_expiry")?.value;
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

  // Check if token needs refresh (only on protected routes)
  if (isAuthenticated && !isPublicRoute && refreshToken && tokenExpiry) {
    const expiryTime = Number(tokenExpiry);
    const now = Date.now();

    // Refresh if token expires in less than 30 seconds
    // Logic: expires - (now + 30s) < 0 means less than 30s remaining
    if (expiryTime - (now + MAX_TIME_REFRESH) < 0) {
      const newTokens = await refreshAccessToken(refreshToken);
      console.log("newTokens", newTokens);

      if (newTokens) {
        // Token refreshed successfully
        const response = NextResponse.next();
        applyAuthCookies(response, newTokens);

        // Add security headers
        response.headers.set("X-Frame-Options", "DENY");
        response.headers.set("X-Content-Type-Options", "nosniff");
        response.headers.set(
          "Referrer-Policy",
          "strict-origin-when-cross-origin",
        );

        return response;
      } else {
        // Refresh failed - logout user
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        loginUrl.searchParams.set("sessionExpired", "true");

        const response = NextResponse.redirect(loginUrl);
        clearAuthCookies(response);

        return response;
      }
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
