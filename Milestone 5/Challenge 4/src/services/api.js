import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// 🔐 Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ⚠️ Response interceptor
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      console.error("Unauthorized — redirect to login");
    } else if (err.response?.status >= 500) {
      console.error("Server error");
    }
    return Promise.reject(err);
  }
);

// 🔧 API METHODS

export const getProducts = () => api.get("/products").then(r => r.data);

export const getProduct = (id) => api.get(`/products/${id}`).then(r => r.data);

export const getCategories = () => api.get("/products/categories").then(r => r.data);

export const addToCart = (data) => api.post("/carts", data).then(r => r.data);

export const getCart = (userId) => api.get(`/carts/user/${userId}`).then(r => r.data);

export const deleteCartItem = (id) => api.delete(`/carts/${id}`).then(r => r.data);

export const getUser = (id) => api.get(`/users/${id}`).then(r => r.data);

export const updateUser = (id, data) =>
  api.put(`/users/${id}`, data).then(r => r.data);

export default api;