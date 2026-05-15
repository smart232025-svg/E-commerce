import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import User from "@/models/User";
import { getAuthFromCookies } from "@/lib/auth";

/* ===================== GET PRODUCT BY ID ===================== */
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const product = await Product.findById(id);

    if (product) return NextResponse.json(product);
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

/* ===================== UPDATE PRODUCT ===================== */
export async function PUT(request, { params }) {
  try {
    const auth = await getAuthFromCookies();
    if (!auth)
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });

    await connectDB();
    const user = await User.findById(auth.userId);
    if (!user || user.role !== "admin")
      return NextResponse.json(
        { message: "Not authorized as admin" },
        { status: 403 },
      );

    const { id } = await params;
    const data = await request.json();
    const product = await Product.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (product) return NextResponse.json(product);
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

/* ===================== DELETE PRODUCT ===================== */
export async function DELETE(request, { params }) {
  try {
    const auth = await getAuthFromCookies();
    if (!auth)
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    await connectDB();
    const user = await User.findById(auth.userId);
    if (!user || user.role !== "admin")
      return NextResponse.json(
        { message: "Not authorized as admin" },
        { status: 403 },
      );

    const { id } = await params;
    const product = await Product.findByIdAndDelete(id);
    if (product)
      return NextResponse.json({
        message: "Product removed",
      });
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
