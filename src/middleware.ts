import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import axios from "axios";
// export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("nextjs.session-token") || null;
  const publicRoutes = ["/login"];
  const mytoken = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  console.log("mytoken", mytoken);

  // const { data: resData } = await axios.get(
  //   "http://localhost:3000/api/users/getloggedinuser"
  // );

  // const loggedin = resData.statusCode == 200;
  // console.log("request", request);

  if (publicRoutes.includes(path) && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!token && !publicRoutes.includes(path)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/",
    "/login",
    "/superadmin/:path",
    "/admin/:path",
    "/student/:path",
    "/trainer/:path",
  ],
};
