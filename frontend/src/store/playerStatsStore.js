import { create } from 'zustand';
import axios from 'axios';
import { useAuthStore } from './authStore'; 

export const usePlayerStatsStore = create((set, get) => ({
  playerStats: [],
  loading: false,
  error: null,

  // Fetch all player stats
  fetchPlayerStats: async () => {
    set({ loading: true, error: null });
    try {
      // Get token from auth store
      const token = useAuthStore.getState().token;
      
      // Include the token in the request headers
      const response = await axios.get('/api/player-stats', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      set({ playerStats: response.data.data, loading: false });
      return { success: true, data: response.data.data };
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch player stats',
        loading: false,
      });
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch player stats',
      };
    }
  },

  // Get single player's stats by ID
  getPlayerStatsById: async (id) => {
    set({ loading: true, error: null });
    try {
      // Get token from auth store
      const token = useAuthStore.getState().token;
      
      const response = await axios.get(`/api/player-stats/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      set({playerStats: response.data.data,loading: false });
      return { success: true, data: response.data.data };
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch player stats',
        loading: false,
      });
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch player stats',
      };
    }
  },

  getStatsByPlayerId: async (playerId) => {
    set({ loading: true, error: null });
    try {
        const token = useAuthStore.getState().token;
        const response = await axios.get(`/api/player-stats/player/${playerId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        set({ playerStats: response.data.data, loading: false }); // Stocam direct obiectul
        return { success: true, data: response.data.data };
    } catch (error) {
        set({
            error: error.response?.data?.message || 'Failed to fetch player stats by player ID',
            loading: false,
        });
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch player stats by player ID',
        };
    }
},

  // Create a new player stat
  createPlayerStat: async (playerData) => {
    set({ loading: true, error: null });
    try {
      // Get token from auth store
      const token = useAuthStore.getState().token;
      
      const response = await axios.post('/api/player-stats', playerData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      set({
        playerStats: [...get().playerStats, response.data.data],
        loading: false,
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to create player stat',
        loading: false,
      });
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create player stat',
      };
    }
  },

  // Update an existing player stat
  updatePlayerStat: async (id, playerData) => {
    set({ loading: true, error: null });
    try {
      // Get token from auth store
      const token = useAuthStore.getState().token;
      
      const response = await axios.put(`/api/player-stats/${id}`, playerData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      set({
        playerStats: get().playerStats.map((playerStat) =>
          playerStat._id === id ? response.data.data : playerStat
        ),
        loading: false,
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update player stat',
        loading: false,
      });
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update player stat',
      };
    }
  },

  // Delete a player stat
  deletePlayerStat: async (id) => {
    set({ loading: true, error: null });
    try {
      // Get token from auth store
      const token = useAuthStore.getState().token;
      
      await axios.delete(`/api/player-stats/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      set({
        playerStats: get().playerStats.filter(
          (playerStat) => playerStat._id !== id
        ),
        loading: false,
      });
      return { success: true, message: 'Player stat successfully deleted' };
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to delete player stat',
        loading: false,
      });
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete player stat',
      };
    }
  },
}));