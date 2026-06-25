
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { getAuthFromCookies } from "@/lib/auth";

export async function POST(req) {
  try {
    const auth = await getAuthFromCookies();
    const { customer, cartItems, totalAmount, paymentMethod } =
      await req.json();

    console.log("📦 Received customer data:", customer);
    console.log("💰 Total amount:", totalAmount);
    console.log("💳 Payment method:", paymentMethod);
    console.log("👤 Is authenticated:", !!auth?.userId);

    await connectDB();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    // ===== بناء بيانات الطلب =====
    const orderData = {
      orderItems: cartItems.map((item) => ({
        product: item.product,
        name: item.name,
        image: item.image,
        price: item.price,
        qty: item.quantity,
      })),
      totalPrice: totalAmount,
      status: "pending",
      paymentMethod: paymentMethod,
      paymentStatus:
        paymentMethod === "cash_on_delivery" ? "unpaid" : "pending",
      customer: {
        name: customer.name,
        phone: customer.phone,
        city: customer.city || "",
        governorate: customer.governorate,
        address: customer.address,
        notes: customer.notes || "",
      },
    };

    // ===== التحقق من المصادقة =====
    if (auth?.userId) {
      // ✅ مستخدم مسجل (أدمن)
      orderData.user = auth.userId;
      orderData.isGuest = false;
      console.log("👤 Order as authenticated user (Admin)");
    } else {
      // ✅ مستخدم غير مسجل (زائر)
      orderData.isGuest = true;
      orderData.guestInfo = {
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
        city: customer.city || "",
        governorate: customer.governorate,
        email: customer.email || "",
      };
      console.log("👤 Order as Guest");
    }

    // ===== إنشاء الطلب =====
    const order = await Order.create(orderData);
    console.log("✅ Order created with ID:", order._id);
    console.log("👤 Customer saved:", order.customer);
    console.log("🏷️ Is Guest:", order.isGuest);

    // ===== الدفع أونلاين (فواتيرك) =====
    if (paymentMethod === "online") {
      try {
        // جلب بيانات العميل للدفع
        const customerName = customer.name || "Customer";
        const firstName = customerName.split(" ")[0] || customerName;
        const lastName =
          customerName.split(" ").slice(1).join(" ") || "Customer";

        // بريد مؤقت للضيف لو مفيش بريد
        const customerEmail =
          customer.email ||
          `${customerName.replace(/\s/g, "").toLowerCase()}@temp.com`;

        const fawaterkRes = await fetch(
          "https://app.fawaterk.com/api/v2/createInvoiceLink",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.FAWATERK_API_KEY}`,
            },
            body: JSON.stringify({
              cartTotal: totalAmount,
              currency: "EGP",
              customer: {
                first_name: firstName,
                last_name: lastName,
                email: customerEmail,
                phone: customer.phone || "01000000000",
              },
              cartItems: cartItems.map((item) => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
              })),
              redirectionUrls: {
                successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
                failUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/failed`,
                pendingUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/pending`,
              },
            }),
          },
        );

        const fawaterkData = await fawaterkRes.json();
        console.log("📤 Fawaterk Response:", fawaterkData);

        const paymentUrl =
          fawaterkData?.data?.url || fawaterkData?.data?.invoice_url;

        if (!paymentUrl) {
          // حذف الطلب لو فشل إنشاء رابط الدفع
          await Order.findByIdAndDelete(order._id);
          return NextResponse.json(
            { message: "فشل إنشاء رابط الدفع، حاول مرة أخرى" },
            { status: 500 },
          );
        }

        // تحديث الطلب بمعلومات الدفع
        order.paymentProvider = "fawaterk";
        order.paymentRef =
          fawaterkData?.data?.invoiceId || fawaterkData?.data?.id;
        order.paymentStatus = "pending";
        await order.save();

        // مسح السلة للمستخدمين المسجلين فقط
        if (auth?.userId) {
          try {
            const User = (await import("@/models/User")).default;
            await User.findByIdAndUpdate(auth.userId, { $set: { cart: [] } });
          } catch (error) {
            console.log("⚠️ Could not clear user cart:", error.message);
          }
        }

        return NextResponse.json({ url: paymentUrl });
      } catch (fawaterkError) {
        console.error("❌ Fawaterk error:", fawaterkError);
        // حذف الطلب لو فشل الدفع
        await Order.findByIdAndDelete(order._id);
        return NextResponse.json(
          { message: "حدث خطأ في بوابة الدفع، حاول مرة أخرى" },
          { status: 500 },
        );
      }
    }

    // ===== الدفع عند الاستلام (كاش) =====
    // مسح السلة للمستخدمين المسجلين فقط
    if (auth?.userId) {
      try {
        const User = (await import("@/models/User")).default;
        await User.findByIdAndUpdate(auth.userId, { $set: { cart: [] } });
      } catch (error) {
        console.log("⚠️ Could not clear user cart:", error.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: "تم إنشاء الطلب بنجاح",
      orderId: order._id,
      isGuest: order.isGuest,
    });
  } catch (error) {
    console.error("❌ Checkout API error:", error);
    return NextResponse.json(
      { message: error.message || "حدث خطأ في إنشاء الطلب" },
      { status: 500 },
    );
  }
}
