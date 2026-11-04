import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./admin/context/AuthContext";
import ProtectedRoute from "./admin/components/ProtectedRoute";

// Public Pages
// @ts-ignore -- JavaScript module
import SiteHome from "./site/App.jsx";
// @ts-ignore -- JavaScript module
import ShopsPage from "./site/pages/ShopsPage.jsx";
// @ts-ignore -- JavaScript module
import ShopDetailPage from "./site/pages/ShopDetailPage.jsx";

// Admin Pages
// @ts-ignore -- JavaScript module
import Login from "./admin/pages/Login.jsx";
// @ts-ignore -- JavaScript module
import Dashboard from "./admin/pages/Dashboard.jsx";
// @ts-ignore -- JavaScript module
import ShopsList from "./admin/pages/ShopsList.jsx";
// @ts-ignore -- JavaScript module
import ShopForm from "./admin/pages/ShopForm.jsx";
// @ts-ignore -- JavaScript module
import MenuManager from "./admin/pages/MenuManager.jsx";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ─── Public Website Routes ─── */}
          <Route path="/" element={<SiteHome />} />
          <Route path="/shops" element={<ShopsPage />} />
          <Route path="/shops/:slug" element={<ShopDetailPage />} />

          {/* ─── Admin Authentication ─── */}
          <Route path="/admin/login" element={<Login />} />

          {/* ─── Protected Admin Dashboard ─── */}
          <Route
            path="/admin"
            element={<Navigate to="/admin/login" replace />}
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/shops"
            element={
              <ProtectedRoute>
                <ShopsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/shops/new"
            element={
              <ProtectedRoute>
                <ShopForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/shops/:id/edit"
            element={
              <ProtectedRoute>
                <ShopForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/shops/:id/menu"
            element={
              <ProtectedRoute>
                <MenuManager />
              </ProtectedRoute>
            }
          />

          {/* ─── Fallback ─── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
