import slugify from "slugify";
import { Shop } from "../models/Shop.js";
import { MenuItem } from "../models/MenuItem.js";

// Helper to generate a unique slug
const createUniqueSlug = async (name, currentId = null) => {
  let baseSlug = slugify(name, { lower: true, strict: true, trim: true }) || "shop";
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await Shop.findOne({ slug });
    if (!existing || (currentId && existing._id.toString() === currentId.toString())) {
      return slug;
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

// ─── PUBLIC ENDPOINTS ──────────────────────────────────────

// @desc    Get all active public shops
// @route   GET /api/shops
// @access  Public
export const getPublicShops = async (req, res) => {
  try {
    const { category, search, featured } = req.query;
    const filter = { isActive: true };

    if (category && category !== "All") {
      filter.category = category;
    }

    if (featured === "true") {
      filter.isFeatured = true;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    const shops = await Shop.find(filter).sort({ isFeatured: -1, displayOrder: 1, createdAt: -1 });

    res.json({
      success: true,
      count: shops.length,
      shops,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single shop by slug with grouped menu
// @route   GET /api/shops/:slug
// @access  Public
export const getPublicShopBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // Check by slug first, or fallback to _id if valid MongoDB id
    let shop = await Shop.findOne({ slug, isActive: true });
    if (!shop && slug.match(/^[0-9a-fA-F]{24}$/)) {
      shop = await Shop.findOne({ _id: slug, isActive: true });
    }

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found or currently inactive.",
      });
    }

    // Fetch available menu items
    const menuItems = await MenuItem.find({ shop: shop._id, isAvailable: true }).sort({
      order: 1,
      createdAt: -1,
    });

    // Group menu items by category
    const categoriesMap = {};
    menuItems.forEach((item) => {
      const cat = item.category || "General";
      if (!categoriesMap[cat]) {
        categoriesMap[cat] = [];
      }
      categoriesMap[cat].push(item);
    });

    res.json({
      success: true,
      shop,
      menuCategories: Object.keys(categoriesMap).map((name) => ({
        name,
        items: categoriesMap[name],
      })),
      totalMenuItems: menuItems.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── ADMIN ENDPOINTS ───────────────────────────────────────

// @desc    Get dashboard metrics & statistics
// @route   GET /api/admin/dashboard/stats
// @access  Private (Admin)
export const getDashboardStats = async (req, res) => {
  try {
    const [totalShops, activeShops, inactiveShops, totalMenuItems, recentShops] =
      await Promise.all([
        Shop.countDocuments(),
        Shop.countDocuments({ isActive: true }),
        Shop.countDocuments({ isActive: false }),
        MenuItem.countDocuments(),
        Shop.find().sort({ createdAt: -1 }).limit(5),
      ]);

    res.json({
      success: true,
      stats: {
        totalShops,
        activeShops,
        inactiveShops,
        totalMenuItems,
        recentShops,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all shops for admin with filter & search
// @route   GET /api/admin/shops
// @access  Private (Admin)
export const getAllShopsAdmin = async (req, res) => {
  try {
    const { search, category, status } = req.query;
    const filter = {};

    if (status === "active") filter.isActive = true;
    if (status === "inactive") filter.isActive = false;

    if (category && category !== "All") filter.category = category;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { ownerName: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
      ];
    }

    const shops = await Shop.find(filter).sort({ createdAt: -1 });

    // Attach item count to each shop
    const shopIds = shops.map((s) => s._id);
    const itemCounts = await MenuItem.aggregate([
      { $match: { shop: { $in: shopIds } } },
      { $group: { _id: "$shop", count: { $sum: 1 } } },
    ]);

    const countMap = {};
    itemCounts.forEach((c) => {
      countMap[c._id.toString()] = c.count;
    });

    const enrichedShops = shops.map((s) => ({
      ...s.toObject(),
      itemCount: countMap[s._id.toString()] || 0,
    }));

    res.json({
      success: true,
      count: enrichedShops.length,
      shops: enrichedShops,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single shop by ID for admin
// @route   GET /api/admin/shops/:id
// @access  Private (Admin)
export const getShopByIdAdmin = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) {
      return res.status(404).json({ success: false, message: "Shop not found" });
    }

    const itemCount = await MenuItem.countDocuments({ shop: shop._id });

    res.json({
      success: true,
      shop: {
        ...shop.toObject(),
        itemCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new shop
// @route   POST /api/admin/shops
// @access  Private (Admin)
export const createShop = async (req, res) => {
  try {
    const { name, slug } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Shop name is required." });
    }

    // Auto-generate or sanitize slug
    const finalSlug = slug ? await createUniqueSlug(slug) : await createUniqueSlug(name);

    const shop = new Shop({
      ...req.body,
      slug: finalSlug,
    });

    const savedShop = await shop.save();

    res.status(201).json({
      success: true,
      message: "Shop created successfully!",
      shop: savedShop,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create shop.",
    });
  }
};

// @desc    Update existing shop
// @route   PUT /api/admin/shops/:id
// @access  Private (Admin)
export const updateShop = async (req, res) => {
  try {
    const { id } = req.params;
    let shop = await Shop.findById(id);

    if (!shop) {
      return res.status(404).json({ success: false, message: "Shop not found." });
    }

    // If slug is being updated or name changed, ensure unique slug
    if (req.body.slug && req.body.slug !== shop.slug) {
      req.body.slug = await createUniqueSlug(req.body.slug, id);
    } else if (req.body.name && req.body.name !== shop.name && !req.body.slug) {
      req.body.slug = await createUniqueSlug(req.body.name, id);
    }

    const updatedShop = await Shop.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: "Shop updated successfully!",
      shop: updatedShop,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update shop.",
    });
  }
};

// @desc    Delete shop and its menu items
// @route   DELETE /api/admin/shops/:id
// @access  Private (Admin)
export const deleteShop = async (req, res) => {
  try {
    const { id } = req.params;
    const shop = await Shop.findById(id);

    if (!shop) {
      return res.status(404).json({ success: false, message: "Shop not found." });
    }

    // Delete associated menu items
    await MenuItem.deleteMany({ shop: id });
    await Shop.findByIdAndDelete(id);

    res.json({
      success: true,
      message: `Shop "${shop.name}" and all its menu items have been deleted.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle shop status (active, featured, open)
// @route   PATCH /api/admin/shops/:id/toggle
// @access  Private (Admin)
export const toggleShopStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { field } = req.body; // 'isActive' | 'isFeatured' | 'isOpen'

    if (!["isActive", "isFeatured", "isOpen"].includes(field)) {
      return res.status(400).json({
        success: false,
        message: "Invalid toggle field.",
      });
    }

    const shop = await Shop.findById(id);
    if (!shop) {
      return res.status(404).json({ success: false, message: "Shop not found." });
    }

    shop[field] = !shop[field];
    await shop.save();

    res.json({
      success: true,
      message: `Shop ${field} updated to ${shop[field]}.`,
      shop,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

