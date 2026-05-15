import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Cart from "@/models/Cart";
import { getAuthFromCookies } from "@/lib/auth";

export async function DELETE(request, context) {
  try {
    const auth = await getAuthFromCookies();
    if (!auth?.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { productId } = await context.params;
    const cart = await Cart.findOne({
      user: auth.userId,
    });

    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    cart.items = cart.items.filter(
      (item) =>
        (item.product._id
          ? item.product._id.toString()
          : item.product.toString()) !== productId,
    );

    await cart.save();
    return NextResponse.json({
      message: "Item removed",
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
