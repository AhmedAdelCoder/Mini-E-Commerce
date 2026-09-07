import { Router } from "express";
import { createOrder } from "../controllers/order.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", protect, createOrder);

export default router;