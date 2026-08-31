import express from "express";
import { register, login } from "../controllers/authController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/customer", protect, authorize("customer"), (req, res) => {
  res.json({
    success: true,
    message: "Customer access granted",
    user: req.user,
  });
});

router.get("/admin", protect, authorize("admin"), (req, res) => {
  res.json({
    success: true,
    message: "Admin access granted",
    user: req.user,
  });
});

export default router;