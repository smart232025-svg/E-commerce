import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { getAuthFromCookies } from "@/lib/auth";

export async function GET() {
  try {
    const auth = await getAuthFromCookies();

    if (!auth) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(auth.userId);

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { message: "Not authorized as admin" },
        { status: 403 },
      );
    }

    const totalUsers = await User.countDocuments({ role: "user" });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const paidOrders = await Order.find({
      status: { $ne: "cancelled" },
    });

    const totalRevenue = paidOrders.reduce(
      (acc, order) => acc + (order.totalPrice || 0),
      0,
    );

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email");

    return NextResponse.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
