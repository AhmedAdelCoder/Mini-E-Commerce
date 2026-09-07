import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { parseUpload } from "../middleware/uploadMiddleware.js";

const router = express.Router();


router.get("/",    getProducts);
router.get("/:id", getProductById);


router.post("/",    protect, authorize("admin"), parseUpload, createProduct);
router.put("/:id",  protect, authorize("admin"), parseUpload, updateProduct);
router.delete("/:id", protect, authorize("admin"), deleteProduct);

export default router;
