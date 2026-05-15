import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { createAuthCookie } from "@/lib/auth";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    await connectDB();
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      const cookie = createAuthCookie(user._id.toString(), user.role);
      const res = NextResponse.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });

      res.cookies.set(cookie.name, cookie.value, {
        httpOnly: cookie.httpOnly,
        secure: cookie.secure,
        sameSite: cookie.sameSite,
        maxAge: cookie.maxAge,
        path: cookie.path,
      });

      return res;
    } else {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 },
      );
    }
  } catch (error) {
    console.error("Login error", error);
    return NextResponse.json(
      { message: error.message || "Server error" },
      { status: 500 },
    );
  }
}
