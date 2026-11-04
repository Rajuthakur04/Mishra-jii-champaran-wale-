import { MenuItem } from "../models/MenuItem.js";
import { Shop } from "../models/Shop.js";

// @desc    Get all featured / active menu items across active shops
// @route   GET /api/menu/featured
// @access  Public
export const getFeaturedMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find({ isAvailable: true })
      .populate({
        path: "shop",
        select: "name slug logo isActive category",
      })
      .sort({ isFeatured: -1, isBestseller: -1, order: 1, createdAt: -1 })
      .limit(20);

    const activeItems = items.filter((item) => item.shop && item.shop.isActive);

    res.json({
      success: true,
      count: activeItems.length,
      items: activeItems,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all menu items for a shop
// @route   GET /api/shops/:shopId/menu
// @access  Public
export const getShopMenuItems = async (req, res) => {
  try {
    const { shopId } = req.params;
    const items = await MenuItem.find({ shop: shopId }).sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new menu item
// @route   POST /api/admin/shops/:shopId/menu
// @access  Private (Admin)
export const createMenuItem = async (req, res) => {
  try {
    const { shopId } = req.params;

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ success: false, message: "Shop not found." });
    }

    const {
      name,
      image,
      description,
      regularPrice,
      discountedPrice,
      category,
      isAvailable,
      isFeatured,
      isBestseller,
      priceVisible,
      descriptionVisible,
      order,
    } = req.body;

    if (!name || regularPrice === undefined) {
      return res.status(400).json({
        success: false,
        message: "Item name and regular price are required.",
      });
    }

    const item = new MenuItem({
      shop: shopId,
      name,
      image: image || "",
      description: description || "",
      regularPrice: Number(regularPrice),
      discountedPrice: discountedPrice ? Number(discountedPrice) : null,
      category: category || "Special Menu",
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      isFeatured: Boolean(isFeatured),
      isBestseller: Boolean(isBestseller),
      priceVisible: priceVisible !== undefined ? priceVisible : true,
      descriptionVisible: descriptionVisible !== undefined ? descriptionVisible : true,
      order: Number(order) || 0,
    });

    const saved = await item.save();

    res.status(201).json({
      success: true,
      message: "Menu item added successfully!",
      item: saved,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update menu item
// @route   PUT /api/admin/menu/:id
// @access  Private (Admin)
export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await MenuItem.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: "Menu item not found." });
    }

    res.json({
      success: true,
      message: "Menu item updated successfully!",
      item: updated,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete menu item
// @route   DELETE /api/admin/menu/:id
// @access  Private (Admin)
export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await MenuItem.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Menu item not found." });
    }

    res.json({
      success: true,
      message: `Menu item "${deleted.name}" deleted successfully.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle menu item availability
// @route   PATCH /api/admin/menu/:id/toggle-availability
// @access  Private (Admin)
export const toggleItemAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findById(id);

    if (!item) {
      return res.status(404).json({ success: false, message: "Menu item not found." });
    }

    item.isAvailable = !item.isAvailable;
    await item.save();

    res.json({
      success: true,
      message: `Item availability set to ${item.isAvailable ? "Available" : "Unavailable"}.`,
      item,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

