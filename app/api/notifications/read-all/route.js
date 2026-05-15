import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Notification from "@/models/Notification";
import { getAuthFromCookies } from "@/lib/auth";

export async function PUT() {
  try {
    const auth = await getAuthFromCookies();

    if (!auth) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    await connectDB();

    await Notification.updateMany(
      { user: auth.userId, isRead: false },
      { $set: { isRead: true } },
    );

    return NextResponse.json({
      message: "All notifications marked as read",
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
