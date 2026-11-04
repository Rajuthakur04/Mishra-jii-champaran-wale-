import express from "express";
import {
  getFeaturedMenuItems,
  getShopMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleItemAvailability,
} from "../controllers/menuController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/menu/featured", getFeaturedMenuItems);
router.get("/shops/:shopId/menu", getShopMenuItems);

// Admin (Protected)
router.post("/admin/shops/:shopId/menu", protectAdmin, createMenuItem);
router.put("/admin/menu/:id", protectAdmin, updateMenuItem);
router.delete("/admin/menu/:id", protectAdmin, deleteMenuItem);
router.patch("/admin/menu/:id/toggle-availability", protectAdmin, toggleItemAvailability);

export default router;

