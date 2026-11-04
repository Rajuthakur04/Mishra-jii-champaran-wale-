import express from "express";
import { handleSingleUpload, handleMultipleUpload } from "../controllers/uploadController.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Upload single file (image or pdf)
router.post("/upload", protectAdmin, upload.single("file"), handleSingleUpload);

// Upload multiple files (gallery)
router.post("/upload/multiple", protectAdmin, upload.array("files", 10), handleMultipleUpload);

export default router;

