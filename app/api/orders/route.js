import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";
import { getAuthFromCookies } from "@/lib/auth";

export async function GET() {
  try {
    const auth = await getAuthFromCookies();
    if (!auth)
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    await connectDB();
    const user = await User.findById(auth.userId);
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { message: "Not authorized as admin" },
        { status: 403 },
      );
    }
    const orders = await Order.find({})
      .populate("user", "id name email")
      .sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
