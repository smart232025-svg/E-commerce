import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const protectedPaths = ["/orders", "/profile", "/notifications", "/chat"];
const adminPaths = ["/dashboard", "/admin"];
const authPaths = ["/auth/login", "/auth/register"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("jwt")?.value;

  let user = null;

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      user = payload;
    } catch (error) {
      console.log("Token verification failed:", error.message);
    }
  }

  if (user && authPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (protectedPaths.some((p) => pathname.startsWith(p)) && !user) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  if (adminPaths.some((p) => pathname.startsWith(p))) {
    if (!user || user.role != "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/orders/:path*",
    "/profile/:path*",
    "/dashboard/:path*",
    "/admin/:path*",
    "/notifications/:path*",
    "/chat/:path*",
    "/auth/:path*",
  ],
};
