import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Notification from "@/models/Notification";
import { getAuthFromCookies } from "@/lib/auth";

export async function GET() {
  try {
    const auth = await getAuthFromCookies();

    if (!auth) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    await connectDB();

    const notifications = await Notification.find({
      user: auth.userId,
    })
      .sort({ createdAt: -1 })
      .limit(10);

    return NextResponse.json({ notifications });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
