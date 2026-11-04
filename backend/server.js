import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import { Admin } from "./models/Admin.js";
import { Shop } from "./models/Shop.js";
import { seedData } from "./seed.js";

import authRoutes from "./routes/authRoutes.js";
import shopRoutes from "./routes/shopRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Ensure local uploads directory exists
const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Connect to MongoDB and Auto-Seed if empty
connectDB().then(async () => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      console.log("[Auto-Seed]: Empty database detected. Seeding initial admin and shop...");
      await seedData(false);
    }
  } catch (seedErr) {
    console.warn("[Auto-Seed Warning]:", seedErr.message);
  }
});

// Middleware
app.set("trust proxy", 1);
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Static files for local uploads
app.use("/uploads", express.static(uploadDir));

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "Mishra Ji Champaran Wale API",
    time: new Date().toISOString(),
  });
});

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api", shopRoutes);
app.use("/api", menuRoutes);
app.use("/api", uploadRoutes);

// Dynamic XML Sitemap for Googlebot & SEO Crawlers
app.get("/sitemap.xml", async (req, res) => {
  try {
    const shops = await Shop.find({ isActive: true }).select("slug updatedAt").lean();
    const baseUrl = "https://mishrajichamparnwale.com";

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

    // Static pages
    xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n    <image:image>\n      <image:loc>${baseUrl}/images/logo.jpg</image:loc>\n      <image:title>Mishra Ji Champaran Wale Official Logo</image:title>\n    </image:image>\n  </url>\n`;
    xml += `  <url>\n    <loc>${baseUrl}/shops</loc>\n    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;

    // Dynamic Shop Pages
    for (const s of shops) {
      const lastmod = s.updatedAt ? new Date(s.updatedAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];
      xml += `  <url>\n    <loc>${baseUrl}/shops/${s.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    }

    xml += `</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(xml);
  } catch (err) {
    res.status(500).send("Error generating sitemap");
  }
});

// In production, serve React frontend build (dist directory)
const frontendDist = path.resolve(__dirname, "../frontend/dist");
const rootDist = path.resolve(__dirname, "../dist");
const distPath = fs.existsSync(frontendDist) ? frontendDist : (fs.existsSync(rootDist) ? rootDist : null);

if (distPath) {
  console.log(`[Production]: Serving React frontend from ${distPath}`);
  app.use(express.static(distPath));

  // Client-side SPA routing fallback
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
      return next();
    }
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

// 404 Handler for unmatched API routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("[Server Error]:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Mishra Ji API Server] Running on http://localhost:${PORT}`);
});
