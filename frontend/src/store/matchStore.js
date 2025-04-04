import { create } from 'zustand';
import { useAuthStore } from './authStore';

export const useMatchStore = create((set) => ({
  matches: [],
  loading: false,
  error: null,

  fetchMatches: async () => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const response = await fetch('/api/matches', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Failed to fetch matches');
      set({ matches: data.data || [], loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createMatch: async (matchData) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const response = await fetch('/api/matches/create-match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(matchData),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Failed to create match');
      
      set((state) => ({
        matches: [...state.matches, data.data], // Add the new match to the state
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error; // Re-throw the error to be handled in the component
    }
  },

  updateMatch: async (id, matchData) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const response = await fetch(`/api/matches/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(matchData),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Failed to update match');
      
      set((state) => ({
        matches: state.matches.map((match) =>
          match._id === id ? { ...match, ...data.data } : match // Ensure _id is used
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error; // Re-throw the error to be handled in the component
    }
  },

  deleteMatch: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const response = await fetch(`/api/matches/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Failed to delete match');
      
      set((state) => ({
        matches: state.matches.filter((match) => match._id !== id), // Ensure _id is used
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error; // Re-throw the error to be handled in the component
    }
  },
}));