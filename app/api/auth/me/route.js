import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getAuthFromCookies } from "@/lib/auth";

export async function GET() {
  try {
    const auth = await getAuthFromCookies();
    if (!auth || !auth.userId) {
      return NextResponse.json(
        { message: "Not authorized, no token" },
        { status: 401 },
      );
    }
    await connectDB();
    const user = await User.findById(auth.userId).select("-password");
    if (user) {
      return NextResponse.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
  } catch (err) {
    console.error("Get user error:", err);
    return NextResponse.json(
      { message: "Not authorized, token failed" },
      { status: 401 },
    );
  }
}
