import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controller/product.controller.js";

import { upload } from "../middleware/upload.middleware.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", protect, adminOnly, upload.single("image"), createProduct);
router.put("/:id", protect, adminOnly, upload.single("image"), updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
