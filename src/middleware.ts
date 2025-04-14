// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "./helpers/getCurrentUser";

const authRoutes = ["/login"];
const protectedRoutes = ["/admin", "/superadmin", "/trainer", "/dashboard"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const session = await getCurrentUser();

  // Redirect logged-in users away from auth pages
  if (authRoutes.includes(path)) {
    // Fixed missing parenthesis
    if (session?.user?.role) {
      const role = session.user.role.toLowerCase();
      return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
    }
    return NextResponse.next();
  }

  // Protect routes that require authentication
  const isProtected = protectedRoutes.some((route) => path.startsWith(route));
  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Role-based redirection for root path
  if (session?.user?.role && path === "/") {
    const role = session.user.role.toLowerCase();
    return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
  }

  // Role-based route protection
  if (session?.user?.role) {
    const role = session.user.role.toLowerCase();
    const isUnauthorized = protectedRoutes.some(
      (route) => path.startsWith(route) && !path.startsWith(`/${role}`)
    );

    if (isUnauthorized) {
      return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/admin/:path*",
    "/superadmin/:path*",
    "/trainer/:path*",
    "/dashboard/:path*",
  ],
  runtime: "nodejs", // Explicitly set runtime to Node.js
};
