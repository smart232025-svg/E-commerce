import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Notification from "@/models/Notification";
import { getAuthFromCookies } from "@/lib/auth";

export async function PATCH(request, { params }) {
  try {
    const auth = await getAuthFromCookies();

    if (!auth) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const notification = await Notification.findById(id);

    if (!notification) {
      return NextResponse.json(
        { message: "Notification not found" },
        { status: 404 },
      );
    }

    if (notification.user.toString() !== auth.userId) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });
    }

    notification.isRead = true;
    await notification.save();
    return NextResponse.json(notification);
  } catch (error) {
    console.error("Mark notification read error:", error);

    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
