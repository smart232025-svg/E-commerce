import { NextResponse } from "next/server";
import Stripe from "stripe";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  const sig = request.headers.get("stripe-signature");

  let event;

  try {
    const body = await request.text();

    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    if (session.metadata?.orderId) {
      try {
        await connectDB();

        const order = await Order.findById(session.metadata.orderId);

        if (order) {
          order.status = "paid";

          order.paymentResult = {
            id: session.id,
            status: session.payment_status,
            email_address: session.customer_details?.email,
          };

          await order.save();

          for (const item of order.orderItems) {
            await Product.findByIdAndUpdate(item.product, {
              $inc: {
                stock: -item.qty,
              },
            });
          }
        }
      } catch (error) {
        console.error("Webhook processing error:", error);
      }
    }
  }

  return NextResponse.json({
    received: true,
  });
}
