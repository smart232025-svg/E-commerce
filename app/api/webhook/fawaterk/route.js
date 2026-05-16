import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req) {
  try {
    const body = await req.json();

    const { invoiceId, status, paymentStatus } = body;

    await connectDB();

    if (status === "paid" || paymentStatus === "paid") {
      await Order.findOneAndUpdate(
        { paymentRef: invoiceId },
        {
          paymentStatus: "paid",
          status: "processing",
        },
      );
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
