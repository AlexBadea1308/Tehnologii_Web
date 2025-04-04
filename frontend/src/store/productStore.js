import { create } from 'zustand';
import axios from 'axios';
import { useAuthStore } from './authStore';

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/api/products`);
      set({ products: response.data.data, loading: false });
      return { success: true, data: response.data.data };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || "Failed to fetch products", 
        loading: false 
      });
      return { success: false, message: error.response?.data?.message || "Failed to fetch products" };
    }
  },

  getProductById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/api/products/${id}`);
      set({ loading: false });
      return { success: true, data: response.data.data };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || "Failed to fetch product", 
        loading: false 
      });
      return { success: false, message: error.response?.data?.message || "Failed to fetch product" };
    }
  },

  createProduct: async (productData) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const response = await axios.post(`/api/products`, productData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      set({ 
        products: [...get().products, response.data.data],
        loading: false 
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || "Failed to create product", 
        loading: false 
      });
      return { success: false, message: error.response?.data?.message || "Failed to create product" };
    }
  },

  updateProduct: async (id, productData) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const response = await axios.put(`/api/products/${id}`, productData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      set({ 
        products: get().products.map(product => 
          product._id === id ? response.data.data : product
        ),
        loading: false 
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || "Failed to update product", 
        loading: false 
      });
      return { success: false, message: error.response?.data?.message || "Failed to update product" };
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      await axios.delete(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ 
        products: get().products.filter(product => product._id !== id),
        loading: false 
      });
      return { success: true, message: "Product successfully deleted" };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || "Failed to delete product", 
        loading: false 
      });
      return { success: false, message: error.response?.data?.message || "Failed to delete product" };
    }
  }
}));