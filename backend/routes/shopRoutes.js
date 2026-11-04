import express from "express";
import {
  getPublicShops,
  getPublicShopBySlug,
  getDashboardStats,
  getAllShopsAdmin,
  getShopByIdAdmin,
  createShop,
  updateShop,
  deleteShop,
  toggleShopStatus,
} from "../controllers/shopController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ── Public Routes ──
router.get("/shops", getPublicShops);
router.get("/shops/:slug", getPublicShopBySlug);

// ── Protected Admin Routes ──
router.get("/admin/dashboard/stats", protectAdmin, getDashboardStats);
router.get("/admin/shops", protectAdmin, getAllShopsAdmin);
router.get("/admin/shops/:id", protectAdmin, getShopByIdAdmin);
router.post("/admin/shops", protectAdmin, createShop);
router.put("/admin/shops/:id", protectAdmin, updateShop);
router.delete("/admin/shops/:id", protectAdmin, deleteShop);
router.patch("/admin/shops/:id/toggle", protectAdmin, toggleShopStatus);

export default router;

