import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fff7f1] flex flex-col items-center justify-center p-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-full border-4 border-brand/20 border-t-brand animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-brand" />
          </div>
        </div>
        <p className="mt-4 font-display font-medium text-navy/70 text-sm">
          Loading Mishra Ji Admin...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}

