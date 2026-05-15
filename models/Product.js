import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      required: true,
      default: "USD",
    },

    category: {
      type: String,
      required: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true },
);

// Text search index
productSchema.index({
  title: "text",
  description: "text",
  category: "text",
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
