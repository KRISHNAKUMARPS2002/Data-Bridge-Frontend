// middleware.ts (create this file in your project root)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get auth data from localStorage (client-side storage isn't available in middleware)
  // Instead, we'll use cookies - you'll need to update your auth system
  const accessToken = request.cookies.get("accessToken")?.value;
  const userCookie = request.cookies.get("user")?.value;
  const user = userCookie ? JSON.parse(userCookie) : null;

  // If user is on homepage and authenticated, redirect to dashboard
  if (request.nextUrl.pathname === "/" && accessToken && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Protect dashboard routes
  if (
    request.nextUrl.pathname.startsWith("/dashboard") &&
    (!accessToken || !user)
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Specify which routes this middleware should run on
export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
