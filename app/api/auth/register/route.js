import { NextResponse } from "next/server";

export async function POST(request) {
  return NextResponse.json(
    {
      message: "التسجيل غير متاح حالياً. يمكنك الشراء كزائر.",
      success: false,
    },
    { status: 403 },
  );
}
