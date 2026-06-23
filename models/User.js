import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const biLanguage = (schema) => {
  return {
    en: schema,
    ar: schema,
  };
};
const addressSchema = new mongoose.Schema({
  title: String,
  street: String,
  city: String,
  country: String,
  zipCode: String,
});

const userSchema = new mongoose.Schema(
  {
    firstName: biLanguage({
      type: String,
      required: true,
      trim: true,
    }),

    lastName: biLanguage({
      type: String,
      required: true,
      trim: true,
    }),

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    phone: String,

    role: {
      en: {
        type: String,
        enum: ["customer", "admin"],
        default: "customer",
      },
      ar: {
        type: String,
        enum: ["عميل", "ادمن"],
        default: "عميل",
      },
    },

    location: String,
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.model("User", userSchema);
