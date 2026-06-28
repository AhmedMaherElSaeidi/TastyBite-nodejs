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
const uploadHandler = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", protect, adminOnly, uploadHandler, createProduct);
router.put("/:id", protect, adminOnly, uploadHandler, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
