import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Cart from "@/models/Cart";
import { getAuthFromCookies } from "@/lib/auth";

export async function GET() {
  try {
    const auth = await getAuthFromCookies();

    if (!auth?.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const cart = await Cart.findOne({
      user: auth.userId,
    }).populate("items.product");

    if (cart) {
      cart.items = cart.items.filter((item) => item.product);
      await cart.save();
    }

    return NextResponse.json(cart || { items: [] });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = await getAuthFromCookies();

    if (!auth?.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { productId } = await request.json();

    let cart = await Cart.findOne({
      user: auth.userId,
    });

    // CREATE CART
    if (!cart) {
      cart = await Cart.create({
        user: auth.userId,
        items: [],
      });
    }

    // CHECK EXISTING PRODUCT
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (!existingItem) {
      cart.items.push({
        product: productId,
        quantity: 1,
      });
    } else {
      // لو المنتج موجود، زود الكمية
      existingItem.quantity += 1;
    }

    await cart.save();

    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// ✅ DELETE - Clear entire cart (أضف الدالة دي)
export async function DELETE() {
  try {
    const auth = await getAuthFromCookies();

    if (!auth?.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const cart = await Cart.findOne({ user: auth.userId });

    if (cart) {
      cart.items = []; // تفريغ السلة
      await cart.save();
    }

    return NextResponse.json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 500 },
    );
  }
}
