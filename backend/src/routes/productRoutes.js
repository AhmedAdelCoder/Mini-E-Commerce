import express from "express";
import { createProduct } from "../controllers/productController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/", protect, authorize("admin"), createProduct);

export default router;