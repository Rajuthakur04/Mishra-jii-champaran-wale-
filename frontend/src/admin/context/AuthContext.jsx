import React, { createContext, useContext, useState, useEffect } from "react";
import { loginApi, getAdminProfileApi } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("mishra_ji_admin_token") || "");
  const [admin, setAdmin] = useState(() => {
    try {
      const saved = localStorage.getItem("mishra_ji_admin_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const res = await getAdminProfileApi();
          if (res.data?.success) {
            setAdmin(res.data.admin);
            localStorage.setItem("mishra_ji_admin_user", JSON.stringify(res.data.admin));
          }
        } catch (err) {
          console.error("Token verification failed:", err);
          logout();
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, [token]);

  const login = async (email, password) => {
    const res = await loginApi(email, password);
    if (res.data?.success) {
      const { token: newToken, admin: adminData } = res.data;
      setToken(newToken);
      setAdmin(adminData);
      localStorage.setItem("mishra_ji_admin_token", newToken);
      localStorage.setItem("mishra_ji_admin_user", JSON.stringify(adminData));
      return { success: true };
    }
    return { success: false, message: res.data?.message || "Login failed" };
  };

  const logout = () => {
    setToken("");
    setAdmin(null);
    localStorage.removeItem("mishra_ji_admin_token");
    localStorage.removeItem("mishra_ji_admin_user");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        admin,
        isAuthenticated: Boolean(token && admin),
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

