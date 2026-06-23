import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    name: {
      ar: { type: String, required: true },
      en: { type: String, required: true },
    },

    description: {
      ar: { type: String, required: true },
      en: { type: String, required: true },
    },

    price: {
      type: Number,
      required: true,
    },

    image: String,

    available: {
      type: Boolean,
      default: true,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Product", productSchema);
