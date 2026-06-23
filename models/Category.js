import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      ar: { type: String, unique: true, required: true },
      en: { type: String, unique: true, required: true },
    },
    icon: { type: String, unique: false, required: true },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Category", categorySchema);
