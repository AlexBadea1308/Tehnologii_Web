import { create } from 'zustand';
import axios from 'axios';
import { useAuthStore } from './authStore';

export const useSquadStore = create((set, get) => ({
  squads: [],
  loading: false,
  error: null,

  // Functie pentru a seta manual eroarea
  setError: (error) => set({ error }),

  getSquadByMatchId: async (matchId) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error('No authentication token found');

      const response = await axios.get(`/api/match-squads/match/${matchId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ loading: false });
      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'No squad found for this match';
      set({
        error: errorMessage,
        loading: false,
      });
      return {
        success: false,
        message: errorMessage,
      };
    }
  },

  createSquad: async (squadData) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error('No authentication token found');

      const response = await axios.post('/api/match-squads', squadData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({
        squads: [...get().squads, response.data.data],
        loading: false,
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to create squad',
        loading: false,
      });
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create squad',
      };
    }
  },

  updateSquad: async (id, squadData) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error('No authentication token found');

      const response = await axios.put(`/api/match-squads/${id}`, squadData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({
        squads: get().squads.map((squad) =>
          squad._id === id ? response.data.data : squad
        ),
        loading: false,
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update squad',
        loading: false,
      });
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update squad',
      };
    }
  },

  deleteSquad: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error('No authentication token found');

      await axios.delete(`/api/match-squads/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({
        squads: get().squads.filter((squad) => squad._id !== id),
        loading: false,
      });
      return { success: true, message: 'Squad successfully deleted' };
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to delete squad',
        loading: false,
      });
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete squad',
      };
    }
  },
}));