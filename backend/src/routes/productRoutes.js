import express from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";


import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getProducts);

router.get("/:id", getProductById);

router.post("/", protect, authorize("admin"), createProduct);

router.put("/:id", protect, authorize("admin"), updateProduct);

router.delete("/:id", protect, authorize("admin"), deleteProduct);

export default router;