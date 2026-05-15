import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Notification from "@/models/Notification";
import User from "@/models/User";
import { getAuthFromCookies } from "@/lib/auth";

export async function PATCH(request, context) {
  try {
    const { id } = await context.params;

    const { status } = await request.json();

    const auth = await getAuthFromCookies();

    if (!auth) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    await connectDB();

    const adminUser = await User.findById(auth.userId);

    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json(
        { message: "Not authorized as admin" },
        { status: 403 },
      );
    }

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const validTransitions = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["shipping", "cancelled"],
      shipping: ["delivered", "cancelled"],
      delivered: [],
      cancelled: [],
    };

    const allowed = validTransitions[order.status];

    if (!allowed || !allowed.includes(status)) {
      return NextResponse.json(
        {
          message: `Invalid status transition from ${order.status} to ${status}`,
        },
        { status: 400 },
      );
    }

    order.status = status;

    await order.save();

    await Notification.create({
      user: order.user,
      message: `Your order #${order._id.toString().slice(-8)} is now ${status}`,
      type: "info",
      isRead: false,
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Order status update error:", error);

    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
