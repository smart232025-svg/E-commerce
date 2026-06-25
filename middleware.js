import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// المسارات المحمية (تحتاج تسجيل دخول)
const protectedPaths = ["/orders", "/profile", "/notifications", "/chat"];

// مسارات الأدمن (تحتاج دور admin)
const adminPaths = ["/dashboard", "/admin"];

// مسارات المصادقة (لو مسجل دخول يتحول للرئيسية)
const authPaths = ["/auth/login"]; 

// المسارات العامة (الضيوف يقدر يوصلها)
const publicPaths = ["/cart", "/checkout"];

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

  // لو مسجل دخول وبيحاول يروح لصفحة login
  if (user && authPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // المسارات المحمية (تحتاج تسجيل دخول)
  if (protectedPaths.some((p) => pathname.startsWith(p)) && !user) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // مسارات الأدمن (تحتاج دور admin)
  if (adminPaths.some((p) => pathname.startsWith(p))) {
    if (!user || user.role !== "admin") {
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
    "/cart/:path*",
    "/checkout/:path*",
  ],
};
