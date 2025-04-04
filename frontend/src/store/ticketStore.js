import { create } from 'zustand';
import axios from 'axios';
import { useAuthStore } from './authStore';

export const useTicketStore = create((set, get) => ({
  tickets: [],
  loading: false,
  error: null,

  fetchTickets: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get('/api/tickets');
      set({ 
        tickets: response.data.data, 
        loading: false 
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Ticket Fetch Error:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to fetch tickets', 
        loading: false 
      });
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  getTicketById: async (id, seatCategory) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/api/tickets/${id}/${seatCategory}`);
      console.log('Fetched Ticket by ID:', response.data.data);
      set({ loading: false });
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Get Ticket by ID Error:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to fetch ticket', 
        loading: false 
      });
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  getTicketByTicketId: async (ticketId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/api/tickets/${ticketId}`);
      console.log('Fetched Ticket by Ticket ID:', response.data.data);
      set({ loading: false });
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Get Ticket by Ticket ID Error:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to fetch ticket', 
        loading: false 
      });
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  createTicket: async (ticketData) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const response = await axios.post('/api/tickets', ticketData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      // Fetch the full ticket data with populated matchId
      const ticketResponse = await get().getTicketByTicketId(response.data.data._id);
      if (ticketResponse.success) {
        set({ 
          tickets: [...get().tickets, ticketResponse.data],
          loading: false 
        });
        return { success: true, data: ticketResponse.data };
      } else {
        throw new Error('Failed to fetch full ticket data after creation');
      }
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to create ticket', 
        loading: false 
      });
      return { success: false, message: error.response?.data?.message || 'Failed to create ticket' };
    }
  },

  updateTicket: async (id, ticketData) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const response = await axios.put(`/api/tickets/${id}`, ticketData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      set({ 
        tickets: get().tickets.map(ticket => 
          ticket._id === id ? response.data.data : ticket
        ),
        loading: false 
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to update ticket', 
        loading: false 
      });
      return { success: false, message: error.response?.data?.message || 'Failed to update ticket' };
    }
  },

  deleteTicket: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      await axios.delete(`/api/tickets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ 
        tickets: get().tickets.filter(ticket => ticket._id !== id),
        loading: false 
      });
      return { success: true, message: 'Ticket successfully deleted' };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete ticket', 
        loading: false 
      });
      return { success: false, message: error.response?.data?.message || 'Failed to delete ticket' };
    }
  }
}));