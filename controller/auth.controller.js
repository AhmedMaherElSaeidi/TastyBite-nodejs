import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";

export const register = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

export const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(req.body.password, user.password);

  if (!isMatch) return res.status(400).json({ message: "Wrong password" });

  res.status(201).json({
    user,
    token: generateToken(user),
  });
};
