import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

// Attach JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("mishra_ji_admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (window.location.pathname.startsWith("/admin") && !window.location.pathname.includes("/login")) {
        localStorage.removeItem("mishra_ji_admin_token");
        localStorage.removeItem("mishra_ji_admin_user");
        window.location.href = "/admin/login?expired=1";
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const loginApi = (email, password) => api.post("/auth/login", { email, password });
export const getAdminProfileApi = () => api.get("/auth/me");
export const updatePasswordApi = (currentPassword, newPassword) =>
  api.put("/auth/password", { currentPassword, newPassword });

// Dashboard APIs
export const getDashboardStatsApi = () => api.get("/admin/dashboard/stats");

// Admin Shops APIs
export const getAdminShopsApi = (params) => api.get("/admin/shops", { params });
export const getAdminShopByIdApi = (id) => api.get(`/admin/shops/${id}`);
export const createShopApi = (data) => api.post("/admin/shops", data);
export const updateShopApi = (id, data) => api.put(`/admin/shops/${id}`, data);
export const deleteShopApi = (id) => api.delete(`/admin/shops/${id}`);
export const toggleShopStatusApi = (id, field) => api.patch(`/admin/shops/${id}/toggle`, { field });

// Menu APIs
export const getShopMenuApi = (shopId) => api.get(`/shops/${shopId}/menu`);
export const createMenuItemApi = (shopId, data) => api.post(`/admin/shops/${shopId}/menu`, data);
export const updateMenuItemApi = (id, data) => api.put(`/admin/menu/${id}`, data);
export const deleteMenuItemApi = (id) => api.delete(`/admin/menu/${id}`);
export const toggleMenuItemAvailabilityApi = (id) => api.patch(`/admin/menu/${id}/toggle-availability`);

// Upload APIs
export const uploadFileApi = (formData) =>
  api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const uploadMultipleFilesApi = (formData) =>
  api.post("/upload/multiple", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Public APIs
export const getPublicShopsApi = (params) => api.get("/shops", { params });
export const getPublicShopBySlugApi = (slug) => api.get(`/shops/${slug}`);
export const getFeaturedMenuItemsApi = () => api.get("/menu/featured");

