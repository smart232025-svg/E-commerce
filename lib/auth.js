import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
const JWT_SECRET = process.env.JWT_SECRET;
const isProduction = process.env.NODE_ENV === "production";
export function signToken(userId, role) {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" });
}
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function getCookieOptions() {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    getMaxAge: 7 * 24 * 60 * 60,
    path: "/",
  };
}
export async function getAuthFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt")?.value;
  if (!token) {
    return null;
  }
  return verifyToken(token);
}

export function createAuthCookie(userId, role) {
  const token = signToken(userId, role);
  return {
    name: "jwt",
    value: token,
    ...getCookieOptions(),
  };
}
