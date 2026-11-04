import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Store,
  CheckCircle2,
  XCircle,
  UtensilsCrossed,
  PlusCircle,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  Phone,
  Eye,
  Edit,
  Clock,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { getDashboardStatsApi } from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getDashboardStatsApi();
      if (res.data?.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error("Failed to load dashboard stats:", err);
      setError("Unable to connect to backend server. Make sure MongoDB and backend are running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <AdminLayout
      title="Platform Overview"
      subtitle="Complete live metrics of registered shops and menus in Bagaha"
    >
      {/* ─── QUICK BANNER & ACTIONS ─── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-navy via-[#141d4b] to-[#25101a] p-6 sm:p-8 text-white shadow-xl mb-8">
        <div
          aria-hidden="true"
          className="absolute -right-10 -bottom-10 w-60 h-60 bg-brand/20 rounded-full blur-3xl pointer-events-none"
        />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/20 text-brand text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Mishra Ji Multi-Shop Hub
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white leading-tight">
              Control which shops and menus your customers explore.
            </h2>
            <p className="text-white/70 text-sm mt-2">
              Every shop you add or publish here automatically appears on your public storefront in real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/shops/new"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-brand to-accent hover:opacity-95 text-white font-display font-bold text-sm shadow-glow transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Shop</span>
            </Link>
            <button
              onClick={loadStats}
              title="Refresh"
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={loadStats}
            className="text-xs font-bold underline ml-4 hover:text-rose-900"
          >
            Retry
          </button>
        </div>
      )}

      {/* ─── 4 KEY METRIC CARDS ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {/* Total Shops */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-navy/50">Total Shops</span>
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-brand flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
          </div>
          <div className="font-display font-bold text-3xl sm:text-4xl text-navy">
            {loading ? "..." : stats?.totalShops || 0}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-emerald-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Multi-vendor directory</span>
          </div>
        </div>

        {/* Active Shops */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-navy/50">Active Shops</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="font-display font-bold text-3xl sm:text-4xl text-emerald-600">
            {loading ? "..." : stats?.activeShops || 0}
          </div>
          <div className="mt-2 text-xs font-medium text-navy/50">Visible on public website</div>
        </div>

        {/* Inactive Shops */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-navy/50">Inactive Shops</span>
            <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="font-display font-bold text-3xl sm:text-4xl text-gray-600">
            {loading ? "..." : stats?.inactiveShops || 0}
          </div>
          <div className="mt-2 text-xs font-medium text-navy/50">Drafted or hidden</div>
        </div>

        {/* Total Menu Items */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-navy/50">Menu Items</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
          </div>
          <div className="font-display font-bold text-3xl sm:text-4xl text-navy">
            {loading ? "..." : stats?.totalMenuItems || 0}
          </div>
          <div className="mt-2 text-xs font-medium text-navy/50">Across all shop menus</div>
        </div>
      </div>

      {/* ─── RECENTLY ADDED SHOPS TABLE ─── */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <div className="flex items-center justify-between pb-6 border-b border-gray-100 mb-6">
          <div>
            <h3 className="font-display font-bold text-lg text-navy">Recently Added Shops</h3>
            <p className="text-xs text-navy/50 mt-0.5">Quick access to manage latest registered shops</p>
          </div>
          <Link
            to="/admin/shops"
            className="text-xs font-bold text-brand hover:text-accent flex items-center gap-1"
          >
            <span>View All Shops</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-navy/50">Loading shops...</div>
        ) : !stats?.recentShops || stats.recentShops.length === 0 ? (
          <div className="py-12 text-center">
            <Store className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h4 className="font-display font-bold text-navy text-base">No Shops Registered Yet</h4>
            <p className="text-xs text-navy/50 mt-1 max-w-sm mx-auto">
              Get started by adding your first local partner shop in Bagaha.
            </p>
            <Link
              to="/admin/shops/new"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand text-white text-xs font-bold"
            >
              <PlusCircle className="w-4 h-4" /> Add First Shop
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-[11px] font-bold uppercase tracking-wider text-navy/40 border-b border-gray-100">
                  <th className="pb-3 font-semibold">Shop</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold">Contact & Location</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.recentShops.map((shop) => (
                  <tr key={shop._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-cream border border-brand/20 overflow-hidden shrink-0 flex items-center justify-center p-1">
                          {shop.logo ? (
                            <img src={shop.logo} alt={shop.name} className="w-full h-full object-contain" />
                          ) : (
                            <Store className="w-5 h-5 text-brand" />
                          )}
                        </div>
                        <div>
                          <div className="font-display font-bold text-navy hover:text-brand transition-colors">
                            {shop.name}
                          </div>
                          {shop.ownerName && (
                            <div className="text-xs text-navy/50">Owner: {shop.ownerName}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-xs font-medium text-navy/70">
                      <span className="px-2.5 py-1 rounded-full bg-cream text-brand font-semibold text-[11px]">
                        {shop.category}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-xs text-navy/60">
                      <div className="flex items-center gap-1.5 font-medium text-navy">
                        <Phone className="w-3 h-3 text-brand" />
                        <span>{shop.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5 text-navy/50">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span>{shop.city || "Bagaha"}</span>
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      {shop.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/shops/${shop._id}/menu`}
                          title="Manage Menu"
                          className="p-2 rounded-lg bg-cream text-brand hover:bg-brand hover:text-white transition-colors"
                        >
                          <UtensilsCrossed className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/shops/${shop._id}/edit`}
                          title="Edit Shop"
                          className="p-2 rounded-lg bg-gray-100 text-navy/70 hover:bg-navy hover:text-white transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/shops/${shop.slug}`}
                          target="_blank"
                          title="Public Preview"
                          className="p-2 rounded-lg bg-gray-100 text-navy/70 hover:bg-emerald-600 hover:text-white transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

