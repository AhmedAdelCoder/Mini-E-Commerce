import { Router } from "express";
import { getAllUsers, getUserById } from "../controllers/userController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();


router.use(protect, authorize("admin"));

router.get("/", getAllUsers);
router.get("/:id", getUserById);

export default router;
