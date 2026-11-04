import { uploadToCloudinaryOrLocal } from "../config/cloudinary.js";

// @desc    Upload single image or PDF
// @route   POST /api/upload
// @access  Private (Admin)
export const handleSingleUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file provided for upload." });
    }

    const fileUrl = await uploadToCloudinaryOrLocal(req.file, req);

    res.json({
      success: true,
      message: "File uploaded successfully!",
      url: fileUrl,
      fileName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Upload failed." });
  }
};

// @desc    Upload multiple images (gallery)
// @route   POST /api/upload/multiple
// @access  Private (Admin)
export const handleMultipleUpload = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No files provided." });
    }

    const uploadPromises = req.files.map((file) => uploadToCloudinaryOrLocal(file, req));
    const urls = await Promise.all(uploadPromises);

    res.json({
      success: true,
      message: `${urls.length} files uploaded successfully!`,
      urls,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Upload failed." });
  }
};

