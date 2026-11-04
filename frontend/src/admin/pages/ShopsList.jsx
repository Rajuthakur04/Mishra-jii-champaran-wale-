import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Store,
  PlusCircle,
  Search,
  Filter,
  Edit,
  Trash2,
  UtensilsCrossed,
  Eye,
  CheckCircle2,
  XCircle,
  Star,
  Phone,
  MapPin,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { getAdminShopsApi, deleteShopApi, toggleShopStatusApi } from "../services/api";

const CATEGORIES = [
  "All",
  "Sweets & Mithai",
  "Namkeen & Snacks",
  "Bakery",
  "Ice Cream",
  "Beverages",
  "Restaurant",
];

export default function ShopsList() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("all");

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadShops = async () => {
    setLoading(true);
    try {
      const res = await getAdminShopsApi({
        search: search || undefined,
        category: category !== "All" ? category : undefined,
        status: status !== "all" ? status : undefined,
      });
      if (res.data?.success) {
        setShops(res.data.shops || []);
      }
    } catch (err) {
      console.error("Failed to load shops:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShops();
  }, [category, status]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadShops();
  };

  const handleToggle = async (id, field) => {
    try {
      const res = await toggleShopStatusApi(id, field);
      if (res.data?.success) {
        setShops((prev) =>
          prev.map((s) => (s._id === id ? { ...s, [field]: res.data.shop[field] } : s))
        );
      }
    } catch (err) {
      alert("Failed to update status: " + (err.response?.data?.message || err.message));
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await deleteShopApi(deleteTarget._id);
      if (res.data?.success) {
        setShops((prev) => prev.filter((s) => s._id !== deleteTarget._id));
        setDeleteTarget(null);
      }
    } catch (err) {
      alert("Failed to delete shop: " + (err.response?.data?.message || err.message));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout
      title="Manage Shops"
      subtitle="Complete list of all partner shops registered on the platform"
    >
      {/* ─── ACTION BAR & FILTERS ─── */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-navy/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by shop name, owner, phone..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none"
            />
          </form>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-navy bg-white outline-none focus:border-brand"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c === "All" ? "All Categories" : c}
                </option>
              ))}
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-navy bg-white outline-none focus:border-brand"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>

            <button
              onClick={loadShops}
              title="Refresh"
              className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-navy/70 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>

            <Link
              to="/admin/shops/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand to-accent text-white font-display font-bold text-xs shadow-glow hover:opacity-95 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Shop</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ─── SHOPS DATA TABLE / LIST ─── */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-sm text-navy/50">Loading registered shops...</div>
        ) : shops.length === 0 ? (
          <div className="py-16 text-center p-6">
            <Store className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="font-display font-bold text-navy text-lg">No Shops Found</h3>
            <p className="text-xs text-navy/50 mt-1 max-w-sm mx-auto">
              No shops match your current search or filter criteria. Try clearing filters or create a new shop.
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                  setStatus("all");
                }}
                className="px-4 py-2 rounded-xl bg-gray-100 text-navy font-bold text-xs hover:bg-gray-200"
              >
                Reset Filters
              </button>
              <Link
                to="/admin/shops/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand text-white font-bold text-xs shadow-glow"
              >
                <PlusCircle className="w-4 h-4" /> Add Shop
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#fcfaf6] border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-navy/50">
                <tr>
                  <th className="py-4 px-6">Shop Info</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Contact</th>
                  <th className="py-4 px-4 text-center">Menu Items</th>
                  <th className="py-4 px-4 text-center">Featured</th>
                  <th className="py-4 px-4 text-center">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {shops.map((shop) => (
                  <tr key={shop._id} className="hover:bg-gray-50/70 transition-colors">
                    {/* Shop Info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-cream border border-brand/20 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                          {shop.logo ? (
                            <img src={shop.logo} alt={shop.name} className="w-full h-full object-contain" />
                          ) : (
                            <Store className="w-6 h-6 text-brand" />
                          )}
                        </div>
                        <div>
                          <div className="font-display font-bold text-navy text-base leading-tight">
                            {shop.name}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-navy/50">
                            {shop.ownerName && <span>Owner: {shop.ownerName}</span>}
                            <span>•</span>
                            <span>/{shop.slug}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 rounded-full bg-cream text-brand text-xs font-semibold">
                        {shop.category}
                      </span>
                    </td>

                    {/* Contact */}
                    <td className="py-4 px-4 text-xs text-navy/70">
                      <div className="flex items-center gap-1 font-medium text-navy">
                        <Phone className="w-3 h-3 text-brand" />
                        <span>{shop.phone}</span>
                      </div>
                      <div className="flex items-center gap-1 text-navy/50 mt-0.5">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="truncate max-w-[150px]">{shop.city || "Bagaha"}</span>
                      </div>
                    </td>

                    {/* Menu items count & manage */}
                    <td className="py-4 px-4 text-center">
                      <Link
                        to={`/admin/shops/${shop._id}/menu`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 text-brand text-xs font-bold hover:bg-brand hover:text-white transition-colors"
                      >
                        <UtensilsCrossed className="w-3.5 h-3.5" />
                        <span>{shop.itemCount || 0} Items</span>
                      </Link>
                    </td>

                    {/* Featured Toggle */}
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleToggle(shop._id, "isFeatured")}
                        title={shop.isFeatured ? "Featured on Home" : "Click to mark as Featured"}
                        className={`p-2 rounded-xl transition-colors ${
                          shop.isFeatured
                            ? "bg-amber-100 text-amber-600 hover:bg-amber-200"
                            : "bg-gray-100 text-gray-400 hover:text-amber-500 hover:bg-gray-200"
                        }`}
                      >
                        <Star className={`w-4 h-4 ${shop.isFeatured ? "fill-amber-500" : ""}`} />
                      </button>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleToggle(shop._id, "isActive")}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                          shop.isActive
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {shop.isActive ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-gray-400" />
                            <span>Hidden</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/shops/${shop.slug}`}
                          target="_blank"
                          title="Preview Public Page"
                          className="p-2 rounded-xl text-navy/60 hover:text-brand hover:bg-cream transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/shops/${shop._id}/menu`}
                          title="Manage Dynamic Menu"
                          className="p-2 rounded-xl text-navy/60 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                        >
                          <UtensilsCrossed className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/shops/${shop._id}/edit`}
                          title="Edit Details"
                          className="p-2 rounded-xl text-navy/60 hover:text-navy hover:bg-gray-100 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(shop)}
                          title="Delete Shop"
                          className="p-2 rounded-xl text-navy/60 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── CONFIRM DELETE MODAL ─── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-navy">
              Delete "{deleteTarget.name}"?
            </h3>
            <p className="text-sm text-navy/70 mt-2 leading-relaxed">
              This will permanently remove this shop along with all its uploaded menus, banners, and
              settings. This action cannot be undone.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-navy hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={confirmDelete}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold shadow-md transition disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Yes, Delete Shop"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

