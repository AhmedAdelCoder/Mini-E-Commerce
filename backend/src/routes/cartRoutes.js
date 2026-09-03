import express from "express";

import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
} from "../controllers/cartController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addToCart);

router.get("/", protect, getCart);

router.put("/:productId", protect, updateCartItem);

router.delete("/:productId", protect, removeFromCart);

export default router;