import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    notes: {
      type: String,
      default: "",
    },

    payment: {
      type: String,
      enum: ["cod", "online"],
      default: "cod",
    },

    subtotal: {
      type: Number,
      required: true,
    },

    deliveryFee: {
      type: Number,
      default: 25,
    },

    total: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Order", orderSchema);
