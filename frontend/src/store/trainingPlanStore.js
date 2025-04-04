import { create } from 'zustand';
import axios from 'axios';
import { useAuthStore } from './authStore';

export const useTrainingPlanStore = create((set, get) => ({
  trainingPlans: [],
  loading: false,
  error: null,

  // Fetch all training plans
  fetchTrainingPlans: async () => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      console.log('Fetching training plans with token:', token);
      if (!token) throw new Error('No authentication token found');
  
      const response = await axios.get('/api/training-plans', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Training plans response:', response.data);
  
      set({ trainingPlans: response.data.data || [], loading: false });
      return { success: true, data: response.data.data || [] };
    } catch (error) {
      console.error('Error fetching training plans:', error.message);
      set({
        error: error.response?.data?.message || 'Failed to fetch training plans',
        loading: false,
      });
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch training plans',
      };
    }
  },

  // Get single training plan by ID
  getTrainingPlanById: async (id) => {
    set({ loading: true, error: null });
    try {
      // Get token from auth store
      const token = useAuthStore.getState().token;

      const response = await axios.get(`/api/training-plans/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ loading: false });
      return { success: true, data: response.data.data };
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch training plan',
        loading: false,
      });
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch training plan',
      };
    }
  },

  // Create a new training plan
  createTrainingPlan: async (trainingData) => {
    set({ loading: true, error: null });
    try {
      // Get token from auth store
      const token = useAuthStore.getState().token;

      const response = await axios.post('/api/training-plans', trainingData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({
        trainingPlans: [...get().trainingPlans, response.data.data],
        loading: false,
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to create training plan',
        loading: false,
      });
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create training plan',
      };
    }
  },

  // Update an existing training plan
  updateTrainingPlan: async (id, trainingData) => {
    set({ loading: true, error: null });
    try {
      // Get token from auth store
      const token = useAuthStore.getState().token;

      const response = await axios.put(`/api/training-plans/${id}`, trainingData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({
        trainingPlans: get().trainingPlans.map((plan) =>
          plan._id === id ? response.data.data : plan
        ),
        loading: false,
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update training plan',
        loading: false,
      });
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update training plan',
      };
    }
  },

  // Delete a training plan
  deleteTrainingPlan: async (id) => {
    set({ loading: true, error: null });
    try {
      // Get token from auth store
      const token = useAuthStore.getState().token;

      await axios.delete(`/api/training-plans/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({
        trainingPlans: get().trainingPlans.filter((plan) => plan._id !== id),
        loading: false,
      });
      return { success: true, message: 'Training plan successfully deleted' };
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to delete training plan',
        loading: false,
      });
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete training plan',
      };
    }
  },
}));