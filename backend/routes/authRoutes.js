import express from "express";
import { loginAdmin, getAdminProfile, updatePassword } from "../controllers/authController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/me", protectAdmin, getAdminProfile);
router.put("/password", protectAdmin, updatePassword);

export default router;

