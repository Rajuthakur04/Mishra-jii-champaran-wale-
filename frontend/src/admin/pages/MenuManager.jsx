import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  UtensilsCrossed,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Star,
  Flame,
  Upload,
  Image as ImageIcon,
  DollarSign,
  Tag,
  Eye,
  EyeOff,
  Filter,
  Check,
  AlertTriangle,
  FileText,
  Store,
} from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import {
  getAdminShopByIdApi,
  getAdminShopsApi,
  getShopMenuApi,
  createMenuItemApi,
  updateMenuItemApi,
  deleteMenuItemApi,
  toggleMenuItemAvailabilityApi,
  uploadFileApi,
} from "../services/api";

const DEFAULT_CATEGORIES = [
  "Special Menu",
  "Mithai",
  "Namkeen & Snacks",
  "Main Course",
  "Beverages",
  "Combos",
  "Ice Cream",
];

export default function MenuManager() {
  const { id: routeShopId } = useParams();
  const [shops, setShops] = useState([]);
  const [selectedShopId, setSelectedShopId] = useState(routeShopId || "");
  const [currentShop, setCurrentShop] = useState(null);

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modal State for Add / Edit Item
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [savingItem, setSavingItem] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form State
  const [itemForm, setItemForm] = useState({
    name: "",
    image: "",
    description: "",
    regularPrice: "",
    discountedPrice: "",
    category: "Special Menu",
    isAvailable: true,
    isFeatured: false,
    isBestseller: false,
    priceVisible: true,
    descriptionVisible: true,
  });

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Load all shops for selector
  useEffect(() => {
    const loadShopsList = async () => {
      try {
        const res = await getAdminShopsApi();
        if (res.data?.success && res.data.shops.length > 0) {
          setShops(res.data.shops);
          if (!selectedShopId) {
            setSelectedShopId(res.data.shops[0]._id);
          }
        }
      } catch (err) {
        console.error("Error loading shops list:", err);
      }
    };
    loadShopsList();
  }, []);

  // When selected shop changes, load shop details & menu
  useEffect(() => {
    if (!selectedShopId) return;

    const loadMenuData = async () => {
      setLoading(true);
      try {
        const [shopRes, menuRes] = await Promise.all([
          getAdminShopByIdApi(selectedShopId),
          getShopMenuApi(selectedShopId),
        ]);

        if (shopRes.data?.success) {
          setCurrentShop(shopRes.data.shop);
        }
        if (menuRes.data?.success) {
          setMenuItems(menuRes.data.items || []);
        }
      } catch (err) {
        console.error("Failed to load shop menu:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMenuData();
  }, [selectedShopId]);

  // Derived categories from existing items + defaults
  const categoriesList = Array.from(
    new Set(["All", ...DEFAULT_CATEGORIES, ...menuItems.map((i) => i.category)])
  );

  const filteredItems = menuItems.filter((item) => {
    if (selectedCategory === "All") return true;
    return item.category === selectedCategory;
  });

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingItem(null);
    setItemForm({
      name: "",
      image: "",
      description: "",
      regularPrice: "",
      discountedPrice: "",
      category: selectedCategory !== "All" ? selectedCategory : "Special Menu",
      isAvailable: true,
      isFeatured: false,
      isBestseller: false,
      priceVisible: true,
      descriptionVisible: true,
    });
    setModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setItemForm({
      name: item.name || "",
      image: item.image || "",
      description: item.description || "",
      regularPrice: item.regularPrice || "",
      discountedPrice: item.discountedPrice || "",
      category: item.category || "Special Menu",
      isAvailable: item.isAvailable !== undefined ? item.isAvailable : true,
      isFeatured: Boolean(item.isFeatured),
      isBestseller: Boolean(item.isBestseller),
      priceVisible: item.priceVisible !== undefined ? item.priceVisible : true,
      descriptionVisible: item.descriptionVisible !== undefined ? item.descriptionVisible : true,
    });
    setModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await uploadFileApi(fd);
      if (res.data?.success) {
        setItemForm((prev) => ({ ...prev, image: res.data.url }));
      }
    } catch (err) {
      alert("Failed to upload image: " + (err.response?.data?.message || err.message));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!itemForm.name.trim() || !itemForm.regularPrice) {
      alert("Please provide both Item Name and Regular Price.");
      return;
    }

    setSavingItem(true);
    try {
      if (editingItem) {
        const res = await updateMenuItemApi(editingItem._id, itemForm);
        if (res.data?.success) {
          setMenuItems((prev) =>
            prev.map((i) => (i._id === editingItem._id ? res.data.item : i))
          );
          setModalOpen(false);
        }
      } else {
        const res = await createMenuItemApi(selectedShopId, itemForm);
        if (res.data?.success) {
          setMenuItems((prev) => [res.data.item, ...prev]);
          setModalOpen(false);
        }
      }
    } catch (err) {
      alert("Failed to save menu item: " + (err.response?.data?.message || err.message));
    } finally {
      setSavingItem(false);
    }
  };

  const handleToggleAvailability = async (id) => {
    try {
      const res = await toggleMenuItemAvailabilityApi(id);
      if (res.data?.success) {
        setMenuItems((prev) =>
          prev.map((i) => (i._id === id ? { ...i, isAvailable: res.data.item.isAvailable } : i))
        );
      }
    } catch (err) {
      alert("Failed to toggle availability: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteItem = async () => {
    if (!deleteTarget) return;
    try {
      const res = await deleteMenuItemApi(deleteTarget._id);
      if (res.data?.success) {
        setMenuItems((prev) => prev.filter((i) => i._id !== deleteTarget._id));
        setDeleteTarget(null);
      }
    } catch (err) {
      alert("Failed to delete item: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <AdminLayout
      title="Dynamic Menu Management"
      subtitle={
        currentShop
          ? `Managing live menu items for "${currentShop.name}"`
          : "Add and customize dynamic dishes, prices & categories"
      }
    >
      {/* ─── SHOP SELECTOR & QUICK BAR ─── */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cream border border-brand/20 p-1 flex items-center justify-center shrink-0 overflow-hidden">
            {currentShop?.logo ? (
              <img src={currentShop.logo} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <Store className="w-6 h-6 text-brand" />
            )}
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-navy/50">
              Selected Shop
            </div>
            <select
              value={selectedShopId}
              onChange={(e) => setSelectedShopId(e.target.value)}
              className="font-display font-bold text-base text-navy bg-transparent outline-none cursor-pointer pr-4 hover:text-brand"
            >
              {shops.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.category})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {currentShop?.menuPdf && (
            <a
              href={currentShop.menuPdf}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-navy hover:bg-gray-50 transition"
            >
              <FileText className="w-3.5 h-3.5 text-brand" />
              <span>Menu PDF</span>
            </a>
          )}

          {currentShop && (
            <Link
              to={`/shops/${currentShop.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-navy hover:bg-gray-50 transition"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-600" />
              <span>Live Shop Preview</span>
            </Link>
          )}

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand to-accent text-white font-display font-bold text-xs shadow-glow hover:opacity-95 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Menu Item</span>
          </button>
        </div>
      </div>

      {/* ─── CATEGORIES FILTER BAR ─── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {categoriesList.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? "bg-navy text-white shadow-sm"
                : "bg-white text-navy/70 hover:bg-gray-100 hover:text-navy border border-gray-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ─── MENU ITEMS GRID ─── */}
      {loading ? (
        <div className="bg-white rounded-3xl p-16 text-center text-sm text-navy/50">
          Loading menu items...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
          <UtensilsCrossed className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-display font-bold text-navy text-lg">No Menu Items in this Category</h3>
          <p className="text-xs text-navy/50 mt-1 max-w-sm mx-auto">
            Click the button below to add your first delicious delicacy or beverage to this category.
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand text-white font-bold text-xs shadow-glow"
          >
            <PlusCircle className="w-4 h-4" /> Add Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className={`bg-white rounded-3xl p-5 border transition-all hover:shadow-md ${
                item.isAvailable ? "border-gray-100" : "border-rose-200 bg-gray-50/50 opacity-80"
              }`}
            >
              {/* Image & Badges */}
              <div className="relative h-44 rounded-2xl overflow-hidden bg-gray-100 mb-4 border border-gray-100">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <UtensilsCrossed className="w-8 h-8 mb-1" />
                    <span className="text-[10px] font-medium">No Image</span>
                  </div>
                )}

                {/* Top badges */}
                <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-navy/80 backdrop-blur-sm text-white text-[10px] font-bold">
                    {item.category}
                  </span>
                  {item.isBestseller && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                      <Flame className="w-3 h-3 fill-white" /> Bestseller
                    </span>
                  )}
                  {item.isFeatured && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 fill-white" /> Featured
                    </span>
                  )}
                </div>

                {/* Availability status badge */}
                <div className="absolute bottom-2.5 right-2.5">
                  {item.isAvailable ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold shadow-sm">
                      In Stock
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white text-[10px] font-bold shadow-sm">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Price */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="font-display font-bold text-navy text-base leading-tight">
                  {item.name}
                </h4>
                <div className="text-right shrink-0">
                  <div className="font-display font-bold text-brand text-base">
                    ₹{item.discountedPrice || item.regularPrice}
                  </div>
                  {item.discountedPrice && (
                    <div className="text-[10px] text-gray-400 line-through">
                      ₹{item.regularPrice}
                    </div>
                  )}
                </div>
              </div>

              {item.description && (
                <p className="text-xs text-navy/60 line-clamp-2 mb-4 leading-relaxed">
                  {item.description}
                </p>
              )}

              {/* Bottom Action Controls */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleToggleAvailability(item._id)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${
                    item.isAvailable
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                  }`}
                >
                  {item.isAvailable ? "Toggle Out of Stock" : "Toggle Available"}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    title="Edit Item"
                    className="p-2 rounded-xl text-navy/60 hover:text-navy hover:bg-gray-100 transition"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(item)}
                    title="Delete Item"
                    className="p-2 rounded-xl text-navy/60 hover:text-rose-600 hover:bg-rose-50 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── ADD / EDIT MENU ITEM MODAL ─── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 my-8">
            <h3 className="font-display font-bold text-xl text-navy border-b border-gray-100 pb-3 mb-5">
              {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
            </h3>

            <form onSubmit={handleSaveItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5">
                  Item Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={itemForm.name}
                  onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                  placeholder="e.g. Champaran Special Pedha (1 Kg)"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5">
                    Regular Price (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={itemForm.regularPrice}
                    onChange={(e) => setItemForm({ ...itemForm, regularPrice: e.target.value })}
                    placeholder="480"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5">
                    Discounted Price (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={itemForm.discountedPrice}
                    onChange={(e) => setItemForm({ ...itemForm, discountedPrice: e.target.value })}
                    placeholder="440 (optional)"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand outline-none font-bold text-brand"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5">
                  Category
                </label>
                <input
                  type="text"
                  list="category-suggestions"
                  value={itemForm.category}
                  onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                  placeholder="Select or type custom category"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand outline-none"
                />
                <datalist id="category-suggestions">
                  {DEFAULT_CATEGORIES.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={itemForm.description}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  placeholder="Taste, ingredients, portions (e.g. prepared in pure desi ghee)..."
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:border-brand outline-none"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5">
                  Item Image
                </label>
                <div className="flex items-center gap-3">
                  {itemForm.image ? (
                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                      <img src={itemForm.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 text-gray-400">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                  <div className="flex-1 space-y-1">
                    <input
                      type="file"
                      accept="image/*"
                      id="item-image-upload"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="item-image-upload"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-navy hover:bg-gray-50 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-brand" />
                      <span>{uploadingImage ? "Uploading..." : "Upload Image"}</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Or paste image URL"
                      value={itemForm.image}
                      onChange={(e) => setItemForm({ ...itemForm, image: e.target.value })}
                      className="w-full px-3 py-1 rounded-lg border border-gray-200 text-xs outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-navy cursor-pointer">
                  <input
                    type="checkbox"
                    checked={itemForm.isBestseller}
                    onChange={(e) => setItemForm({ ...itemForm, isBestseller: e.target.checked })}
                    className="w-4 h-4 rounded text-brand"
                  />
                  <span>Mark as Bestseller</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-navy cursor-pointer">
                  <input
                    type="checkbox"
                    checked={itemForm.isFeatured}
                    onChange={(e) => setItemForm({ ...itemForm, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-brand"
                  />
                  <span>Mark as Featured</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-navy cursor-pointer">
                  <input
                    type="checkbox"
                    checked={itemForm.isAvailable}
                    onChange={(e) => setItemForm({ ...itemForm, isAvailable: e.target.checked })}
                    className="w-4 h-4 rounded text-brand"
                  />
                  <span>Available / In Stock</span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-navy hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingItem}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-brand to-accent text-white font-display font-bold text-xs shadow-glow hover:opacity-95 disabled:opacity-60"
                >
                  {savingItem ? "Saving..." : editingItem ? "Update Item" : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── CONFIRM DELETE ITEM MODAL ─── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl">
            <h4 className="font-display font-bold text-lg text-navy mb-2">Delete Item?</h4>
            <p className="text-xs text-navy/70 mb-5">
              Are you sure you want to delete <strong>"{deleteTarget.name}"</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteItem}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

