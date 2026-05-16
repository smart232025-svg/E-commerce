import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        qty: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true, default: 0.0 },
    status: {
      type: String,
      required: true,
      default: "pending",
      enum: ["pending", "confirmed", "shipping", "delivered", "cancelled"],
    },

    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      city: { type: String, required: true },
      governorate: { type: String, required: true },
      address: { type: String, required: true },
      notes: { type: String, default: "" },
    },

    paymentMethod: {
      type: String,
      required: true,
      default: "cash_on_delivery",
      enum: ["cash_on_delivery", "online"],
    },

    paymentStatus: {
      type: String,
      default: "unpaid",
      enum: ["unpaid", "pending", "paid", "failed"],
    },

    paymentProvider: { type: String },
    paymentRef: { type: String },

    paymentResult: {
      id: { type: String },
      status: { type: String },
      email_address: { type: String },
    },
    stripeSessionId: { type: String, unique: true, sparse: true },
  },
  { timestamps: true },
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
