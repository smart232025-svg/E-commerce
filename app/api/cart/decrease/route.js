import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Cart from "@/models/Cart";
import { getAuthFromCookies } from "@/lib/auth";

export async function PUT(request) {
  try {
    const auth = await getAuthFromCookies();
    if (!auth?.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { productId } = await request.json();

    const cart = await Cart.findOne({ user: auth.userId });
    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (itemIndex !== -1) {
      if (cart.items[itemIndex].quantity > 1) {
        cart.items[itemIndex].quantity -= 1;
      } else {
        cart.items.splice(itemIndex, 1);
      }
      await cart.save();
      return NextResponse.json(cart);
    }

    return NextResponse.json(
      { message: "Product not found in cart" },
      { status: 404 },
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
