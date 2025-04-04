import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCartStore } from "./cartStore"; 

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (userData, token) => {
        set({ 
          user: userData, 
          token: token, 
          isAuthenticated: true 
        });
        useCartStore.getState().loadUserCart();
      },

      logout: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        });
        useCartStore.getState().clearCart();
      },
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  )
);