// import { NextResponse } from "next/server";
// import connectDB from "@/lib/db";
// import Order from "@/models/Order";
// import { getAuthFromCookies } from "@/lib/auth";
// import User from "@/models/User";
// import Product from "@/models/Product";

// // export async function POST(req) {
// //   try {
// //     const auth = await getAuthFromCookies();

// //     if (!auth?.userId) {
// //       return NextResponse.json({ message: "Not authorized" }, { status: 401 });
// //     }

// //     const { customer } = await req.json();

// //     await connectDB();

// //     const user = await User.findById(auth.userId).populate("cart.product");

// //     const cartItems = user?.cart || [];

// //     if (cartItems.length === 0) {
// //       return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
// //     }

// //     // 🟢 calculate total
// //     let total = 0;

// //     const orderItems = cartItems.map((item) => {
// //       total += item.product.price * item.quantity;

// //       return {
// //         product: item.product._id,
// //         name: item.product.title,
// //         image: item.product.imageUrl,
// //         price: item.product.price,
// //         qty: item.quantity,
// //       };
// //     });

// //     // 🟢 create order
// //     const order = await Order.create({
// //       user: auth.userId,
// //       orderItems,
// //       totalPrice: total,
// //       status: "pending",

// //       customer: {
// //         name: customer.name,
// //         phone: customer.phone,
// //         city: customer.city,
// //         address: customer.address,
// //       },
// //     });

// //     // 🟢 create Fawaterk invoice
// //     const res = await fetch(
// //       "https://app.fawaterk.com/api/v2/createInvoiceLink",
// //       {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${process.env.FAWATERK_API_KEY}`,
// //         },

// //         body: JSON.stringify({
// //           cartTotal: total,
// //           currency: "EGP",

// //           customer: {
// //             first_name: customer.name,
// //             email: "test@test.com",
// //             phone: customer.phone,
// //           },

// //           cartItems: orderItems.map((item) => ({
// //             name: item.name,
// //             price: item.price,
// //             quantity: item.qty,
// //           })),

// //           redirectionUrls: {
// //             successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
// //             failUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/failed`,
// //             pendingUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/pending`,
// //           },
// //         }),
// //       },
// //     );

// //     const data = await res.json();

// //     const paymentUrl = data?.data?.url || data?.data?.invoice_url;

// //     if (!paymentUrl) {
// //       return NextResponse.json(
// //         { message: "Payment link failed" },
// //         { status: 500 },
// //       );
// //     }

// //     // 🟢 save payment reference
// //     order.paymentProvider = "fawaterk";
// //     order.paymentRef = data?.data?.invoiceId;

// //     await order.save();

// //     return NextResponse.json({ url: paymentUrl });
// //   } catch (error) {
// //     return NextResponse.json({ message: error.message }, { status: 500 });
// //   }
// // }

// export async function POST(req) {
//   try {
//     const auth = await getAuthFromCookies();
//     if (!auth?.userId) {
//       return NextResponse.json({ message: "Not authorized" }, { status: 401 });
//     }

//     const { customer, cartItems, totalAmount } = await req.json(); // ← استقبل الـ items من الفورم

//     await connectDB();

//     if (!cartItems || cartItems.length === 0) {
//       return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
//     }

//     // 🟢 create order (مباشرة من البيانات اللي جات)
//     const order = await Order.create({
//       user: auth.userId,
//       orderItems: cartItems.map((item) => ({
//         product: item.product,
//         name: item.name,
//         image: item.image,
//         price: item.price,
//         qty: item.quantity,
//       })),
//       totalPrice: totalAmount,
//       status: "pending",
//       customer: {
//         name: customer.name,
//         phone: customer.phone,
//         city: customer.city,
//         address: customer.address,
//       },
//     });

//     // 🟢 create invoice from Fawaterk
//     const res = await fetch(
//       "https://app.fawaterk.com/api/v2/createInvoiceLink",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${process.env.FAWATERK_API_KEY}`,
//         },
//         body: JSON.stringify({
//           cartTotal: totalAmount,
//           currency: "EGP",
//           customer: {
//             first_name: customer.name,
//             email: `${customer.name.replace(/\s/g, "")}@temp.com`,
//             phone: customer.phone,
//           },
//           cartItems: cartItems.map((item) => ({
//             name: item.name,
//             price: item.price,
//             quantity: item.quantity,
//           })),
//           redirectionUrls: {
//             successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
//             failUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/failed`,
//             pendingUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/pending`,
//           },
//         }),
//       },
//     );

//     const data = await res.json();
//     const paymentUrl = data?.data?.url || data?.data?.invoice_url;

//     if (!paymentUrl) {
//       return NextResponse.json(
//         { message: "Payment link failed" },
//         { status: 500 },
//       );
//     }

//     // 🟢 save payment reference & clear cart
//     order.paymentProvider = "fawaterk";
//     order.paymentRef = data?.data?.invoiceId;
//     await order.save();

//     // 🟢 CLEAR CART FROM USER
//     await User.findByIdAndUpdate(auth.userId, { $set: { cart: [] } });

//     return NextResponse.json({ url: paymentUrl });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ message: error.message }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { getAuthFromCookies } from "@/lib/auth";
import User from "@/models/User";

export async function POST(req) {
  try {
    const auth = await getAuthFromCookies();

    if (!auth?.userId) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    const { customer, cartItems, totalAmount, paymentMethod } =
      await req.json();

    // ✅ للتأكد من البيانات
    console.log("📦 Received customer data:", customer);
    console.log("💰 Total amount:", totalAmount);
    console.log("💳 Payment method:", paymentMethod);

    await connectDB();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    // 🟢 Create order in MongoDB
    const order = await Order.create({
      user: auth.userId,
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
    });

    console.log("✅ Order created with ID:", order._id);
    console.log("👤 Customer saved:", order.customer);

    // 🟢 If payment method is online, create Fawaterk invoice
    if (paymentMethod === "online") {
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
              first_name: customer.name.split(" ")[0] || customer.name,
              last_name: customer.name.split(" ")[1] || "Customer",
              email: `${customer.name.replace(/\s/g, "").toLowerCase()}@temp.com`,
              phone: customer.phone,
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
      const paymentUrl =
        fawaterkData?.data?.url || fawaterkData?.data?.invoice_url;

      if (!paymentUrl) {
        await Order.findByIdAndDelete(order._id);
        return NextResponse.json(
          { message: "Payment link creation failed" },
          { status: 500 },
        );
      }

      order.paymentProvider = "fawaterk";
      order.paymentRef = fawaterkData?.data?.invoiceId;
      await order.save();

      await User.findByIdAndUpdate(auth.userId, { $set: { cart: [] } });

      return NextResponse.json({ url: paymentUrl });
    }

    // 🟢 If cash on delivery
    await User.findByIdAndUpdate(auth.userId, { $set: { cart: [] } });

    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      orderId: order._id,
    });
  } catch (error) {
    console.error("❌ Checkout API error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
