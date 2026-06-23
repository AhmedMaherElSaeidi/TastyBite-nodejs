import express from "express";
import {
  createOrder,
  getOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controller/order.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";

const router = express.Router();

router.post("/", protect, createOrder);

router.get("/my-orders", protect, getOrders);

router.get("/", protect, adminOnly, getAllOrders);

router.patch("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;
