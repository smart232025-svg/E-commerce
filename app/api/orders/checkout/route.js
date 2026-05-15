import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { getAuthFromCookies } from "@/lib/auth";

export async function POST(request) {
  try {
    const auth = await getAuthFromCookies();

    if (!auth?.userId) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    const { productId, qty = 1 } = await request.json();

    await connectDB();

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    if (product.stock < qty) {
      return NextResponse.json(
        { message: "Not enough stock" },
        { status: 400 },
      );
    }

    const user = await User.findById(auth.userId);

    // 🟢 Create Order (pending)
    const order = await Order.create({
      user: auth.userId,
      orderItems: [
        {
          product: product._id,
          name: product.title,
          image: product.imageUrl,
          price: product.price,
          qty,
        },
      ],
      totalPrice: product.price * qty,
      status: "pending",
    });

    // 🟢 Create Fawaterk invoice
    const fawaterkRes = await fetch(
      "https://app.fawaterk.com/api/v2/createInvoiceLink",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.FAWATERK_API_KEY}`,
        },

        body: JSON.stringify({
          cartTotal: order.totalPrice,
          currency: "EGP",

          customer: {
            first_name: user?.name || "User",
            email: user?.email || "test@test.com",
            phone: "01000000000",
          },

          cartItems: [
            {
              name: product.title,
              price: product.price,
              quantity: qty,
            },
          ],

          redirectionUrls: {
            successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
            failUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/failed`,
            pendingUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/pending`,
          },
        }),
      },
    );

    const fawaterkData = await fawaterkRes.json();

    const paymentUrl =
      fawaterkData?.data?.url || fawaterkData?.data?.invoice_url;

    if (!paymentUrl) {
      return NextResponse.json(
        { message: "Payment link not created" },
        { status: 500 },
      );
    }

    // 🟢 Save payment reference
    order.paymentProvider = "fawaterk";
    order.paymentRef =
      fawaterkData?.data?.invoiceId || fawaterkData?.data?.invoice_key;

    await order.save();

    return NextResponse.json({ url: paymentUrl });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
