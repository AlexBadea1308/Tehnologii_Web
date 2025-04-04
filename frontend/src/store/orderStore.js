import { create } from 'zustand';
import axios from 'axios';
import { useAuthStore } from './authStore'; 

const useOrderStore = create((set) => ({
  orders: [],
  loading: false,
  error: null,

  fetchOrders: async (userId) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token; 
      const response = await axios.get(`/api/orders/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ orders: response.data.data, loading: false });
      return response.data.data;
    } catch (error) {
      set({ error: error.message || 'Failed to fetch orders', loading: false });
      return { success: false, message: error.message };
    }
  },

  fetchAllOrders: async () => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token; 
      const response = await axios.get('/api/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ orders: response.data.data, loading: false });
      return response.data.data;
    } catch (error) {
      set({ error: error.message || 'Failed to fetch all orders', loading: false });
      return { success: false, message: error.message };
    }
  },

  updateOrder: async (id, orderData) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token; 
      const response = await axios.put(`/api/orders/${id}`, orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', 
        },
      });
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === id ? { ...order, ...response.data.data } : order
        ),
        loading: false,
      }));
      return response.data.data;
    } catch (error) {
      set({ error: error.message || 'Failed to update order', loading: false });
      return { success: false, message: error.message };
    }
  },

  deleteOrder: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const response = await axios.delete(`/api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set((state) => ({
        orders: state.orders.filter((order) => order.id !== id),
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message || 'Failed to delete order', loading: false });
      return { success: false, message: error.message };
    }
  },
}));

export { useOrderStore };