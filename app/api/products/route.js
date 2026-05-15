import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import User from "@/models/User";
import { getAuthFromCookies } from "@/lib/auth";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get("keyword");

    const query = keyword
      ? { title: { $regex: keyword, $options: "i" }, isActive: true }
      : { isActive: true };

    const products = await Product.find(query).sort({ createdAt: -1 });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = await getAuthFromCookies();

    if (!auth || !auth.userId) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(auth.userId);

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { message: "Not authorized as admin" },
        { status: 403 },
      );
    }

    const body = await request.json();

    const product = await Product.create({
      title: body.title,
      description: body.description,
      price: Number(body.price),
      currency: body.currency,
      category: body.category,
      imageUrl: body.imageUrl,
      images: body.images || [],
      stock: Number(body.stock),
      isActive: body.isActive,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);

    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
