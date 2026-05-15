import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { getAuthFromCookies } from "@/lib/auth";

export async function GET() {
  try {
    const auth = await getAuthFromCookies();

    if (!auth)
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    await connectDB();

    const orders = await Order.find({
      user: auth.userId,
    }).sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
