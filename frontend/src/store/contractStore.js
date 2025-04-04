import { create } from 'zustand';
import axios from 'axios';
import { useAuthStore } from './authStore';

export const useContractStore = create((set, get) => ({
  contracts: [],
  loading: false,
  error: null,

  // Fetch all contracts
  fetchContracts: async () => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error('No authentication token found');

      const response = await axios.get('/api/contracts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ contracts: response.data.data || [], loading: false });
      return { success: true, data: response.data.data || [] };
    } catch (error) {
      console.error('Error fetching contracts:', error.message);
      set({
        error: error.response?.data?.message || 'Failed to fetch contracts',
        loading: false,
      });
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch contracts',
      };
    }
  },

  // Get single contract by ID
  getContractById: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;

      const response = await axios.get(`/api/contracts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ loading: false });
      return { success: true, data: response.data.data };
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch contract',
        loading: false,
      });
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch contract',
      };
    }
  },

  // Get contract by player ID
  getContractByPlayerId: async (playerId) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;

      const response = await axios.get(`/api/contracts/player/${playerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ loading: false });
      return { success: true, data: response.data.data };
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch contract for this player',
        loading: false,
      });
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch contract for this player',
      };
    }
  },

  // Create a new contract
  createContract: async (contractData) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;

      const response = await axios.post('/api/contracts', contractData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({
        contracts: [...get().contracts, response.data.data],
        loading: false,
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to create contract',
        loading: false,
      });
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create contract',
      };
    }
  },

  // Update an existing contract
  updateContract: async (id, contractData) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;

      const response = await axios.put(`/api/contracts/${id}`, contractData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({
        contracts: get().contracts.map((contract) =>
          contract._id === id ? response.data.data : contract
        ),
        loading: false,
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update contract',
        loading: false,
      });
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update contract',
      };
    }
  },

  // Delete a contract
  deleteContract: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;

      await axios.delete(`/api/contracts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({
        contracts: get().contracts.filter((contract) => contract._id !== id),
        loading: false,
      });
      return { success: true, message: 'Contract successfully deleted' };
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to delete contract',
        loading: false,
      });
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete contract',
      };
    }
  },
}));