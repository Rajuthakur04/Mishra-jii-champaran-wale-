import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Store,
  PlusCircle,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Shield,
  UtensilsCrossed,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout({ children, title, subtitle }) {
  const { admin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out of Admin Dashboard?")) {
      logout();
      navigate("/admin/login");
    }
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
      active: location.pathname === "/admin/dashboard",
    },
    {
      name: "Manage Shops",
      path: "/admin/shops",
      icon: Store,
      active: location.pathname === "/admin/shops",
    },
    {
      name: "Add New Shop",
      path: "/admin/shops/new",
      icon: PlusCircle,
      active: location.pathname === "/admin/shops/new",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex font-sans text-navy">
      {/* ─── DESKTOP SIDEBAR ─── */}
      <aside className="hidden lg:flex w-64 flex-col bg-[#0a112e] text-white shrink-0 shadow-xl border-r border-white/5">
        {/* Brand Header */}
        <div className="p-5 border-b border-white/10 flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-[#320104] p-1 ring-1 ring-amber-400/50 shadow-md flex items-center justify-center shrink-0">
            <img src="/images/logo-brand.png" alt="Logo" className="h-full w-auto object-contain" />
          </div>
          <div className="flex flex-col leading-tight overflow-hidden">
            <span className="font-brand-title font-bold text-base tracking-wide text-white truncate">
              MISHRA JI
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-brand">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-1 space-y-1.5">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white/40">
            Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  item.active
                    ? "bg-gradient-to-r from-brand to-accent text-white shadow-md font-semibold"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${item.active ? "text-white" : "text-brand"}`} />
                <span>{item.name}</span>
                {item.active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-white/70" />}
              </Link>
            );
          })}

          <div className="pt-4 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white/40">
            Website
          </div>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-emerald-400" />
            <span>View Public Site</span>
          </a>
          <Link
            to="/shops"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors"
          >
            <UtensilsCrossed className="w-4 h-4 text-amber-400" />
            <span>Public Shops Directory</span>
          </Link>
        </nav>

        {/* Admin User Footer */}
        <div className="p-4 border-t border-white/10 bg-black/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand to-amber-500 flex items-center justify-center font-bold text-white text-xs uppercase shadow-sm shrink-0">
                {admin?.name?.charAt(0) || "A"}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-white truncate">{admin?.name || "Admin"}</span>
                <span className="text-[10px] text-white/50 truncate">{admin?.email}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 rounded-lg text-white/50 hover:text-rose-400 hover:bg-white/5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ─── MOBILE DRAWER OVERLAY ─── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] bg-[#0a112e] text-white flex flex-col z-10 p-4">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-[#320104] p-1 ring-1 ring-amber-400/50">
                  <img src="/images/logo-brand.png" alt="Logo" className="h-full w-auto object-contain" />
                </div>
                <span className="font-brand-title font-bold text-sm text-white">MISHRA JI</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="mt-4 flex-1 space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm ${
                      item.active ? "bg-brand text-white font-semibold" : "text-white/70 hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              <div className="pt-4 border-t border-white/10 mt-4">
                <a
                  href="/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm text-white/70"
                >
                  <ExternalLink className="w-4 h-4 text-emerald-400" />
                  <span>Public Site</span>
                </a>
              </div>
            </nav>

            <button
              onClick={handleLogout}
              className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 bg-rose-500/20 text-rose-300 rounded-xl text-xs font-bold hover:bg-rose-500/30 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      )}

      {/* ─── MAIN CONTENT AREA ─── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-navy/70 hover:bg-gray-100"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-display font-bold text-lg sm:text-xl text-navy leading-tight">
                {title || "Admin Dashboard"}
              </h1>
              {subtitle && <p className="text-xs text-navy/50 hidden sm:block">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-navy hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-brand" />
              <span>Public Site</span>
            </a>
            <div className="h-5 w-px bg-gray-200 hidden sm:block" />
            <div className="flex items-center gap-2 bg-cream/70 border border-brand/20 px-3 py-1.5 rounded-full">
              <Shield className="w-3.5 h-3.5 text-brand" />
              <span className="text-xs font-bold text-navy truncate max-w-[120px] sm:max-w-none">
                {admin?.name || "Admin"}
              </span>
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

