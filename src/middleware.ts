import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth"; // Import auth from NextAuth

export async function middleware(request: NextRequest) {
  console.log("Middleware running");

  const session = await auth(); // Get authentication session
  console.log("Session data:", session);

  const path = request.nextUrl.pathname;
  const isPublic = path === "/login" || path == "/";

  if (!session && path == "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  // Redirect unauthenticated users trying to access private pages
  if (!session && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If logged in and accessing "/", redirect to their role-based dashboard
  if (session && isPublic) {
    const role = session.user.role;
    return NextResponse.redirect(
      new URL(`/${role.toLowerCase()}/dashboard`, request.url)
    );
  }

  // Prevent admins from accessing superadmin routes and vice versa
  if (session) {
    const role = session.user.role.toLowerCase();
    if (session && path == "/") {
      return NextResponse.redirect(
        new URL(`/${role.toLowerCase()}/dashboard`, request.url)
      );
    }
    if (role === "admin" && !path.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    if (role === "superadmin" && !path.startsWith("/superadmin")) {
      return NextResponse.redirect(
        new URL("/superadmin/dashboard", request.url)
      );
    }

    if (role === "trainer" && !path.startsWith("/trainer")) {
      return NextResponse.redirect(new URL("/trainer/dashboard", request.url));
    }
  }

  // Allow access by default
  return NextResponse.next();
}

// Match paths where middleware should be applied
export const config = {
  matcher: [
    "/",
    "/login",
    "/admin/:path*",
    "/superadmin/:path*",
    "/trainer/:path*",
  ],
};
