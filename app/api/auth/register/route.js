import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { createAuthCookie } from "@/lib/auth";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();
    await connectDB();
    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 },
      );
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      const cookie = createAuthCookie(user._id.toString(), user.role);
      const res = NextResponse.json(
        {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        { status: 201 },
      );

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
        { message: "Invalid user data" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
