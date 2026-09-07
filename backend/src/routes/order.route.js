import { Router } from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();


router.post("/", protect, createOrder);


router.get("/my", protect, getMyOrders);

router.get("/", protect, authorize("admin"), getAllOrders);

router.patch("/:id/status", protect, authorize("admin"), updateOrderStatus);

export default router;
