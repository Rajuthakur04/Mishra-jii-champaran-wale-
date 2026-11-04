import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log("[Cloudinary]: Configured successfully");
} else {
  console.log("[Storage]: Local uploads enabled (Cloudinary keys not provided in .env)");
}

export const uploadToCloudinaryOrLocal = async (file, req) => {
  if (isCloudinaryConfigured) {
    try {
      const resourceType = file.mimetype === "application/pdf" ? "raw" : "auto";
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "mishra_ji_champaran",
        resource_type: resourceType,
      });
      // remove local temp file
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      return result.secure_url;
    } catch (err) {
      console.error("[Cloudinary Upload Error]:", err);
      // Fallback to local
    }
  }

  // Return full public URL for locally stored file
  const protocol = req.protocol || "http";
  const host = req.get("host") || "localhost:5000";
  return `${protocol}://${host}/uploads/${path.basename(file.path)}`;
};

export { cloudinary, isCloudinaryConfigured };

