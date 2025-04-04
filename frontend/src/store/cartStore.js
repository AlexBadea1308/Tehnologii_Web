import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from './authStore';

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      shippingMethod: null,
      paymentMethod: null,

      addToCart: async (item) => {
        const cart = get().cart;
        const user = useAuthStore.getState().user;
        const storageKey = user ? `cart-${user._id}` : null;

        const existingItem = cart.find(
          (i) => i._id === item._id &&
            i.productType === item.productType &&
            (item.productType === 'ticket' ? i.seatCategory === item.seatCategory : true)
        );
        const quantityToAdd = item.quantity || 1;
        const currentQuantity = existingItem ? existingItem.quantity : 0;
        const newQuantity = currentQuantity + quantityToAdd;

        if (item.productType === 'ticket') {
          const ticketsForMatch = cart
            .filter((i) => i.productType === 'ticket' && i.matchId === item.matchId)
            .reduce((sum, i) => sum + i.quantity, 0);
          if (ticketsForMatch + quantityToAdd > 5) {
            throw new Error(`Only ${5 - ticketsForMatch} more tickets allowed for this match (max 5)`);
          }
        } else if (item.productType === 'product' && newQuantity > 10) {
          throw new Error('Maximum 10 items per product');
        }

        if (existingItem) {
          set({
            cart: cart.map((cartItem) =>
              cartItem._id === existingItem._id &&
              cartItem.productType === existingItem.productType &&
              (cartItem.productType === 'ticket' ? cartItem.seatCategory === existingItem.seatCategory : true)
                ? { ...cartItem, quantity: newQuantity }
                : cartItem
            ),
          });
        } else {
          set({
            cart: [...cart, { ...item, quantity: quantityToAdd }],
          });
        }

        if (user) {
          localStorage.setItem(storageKey, JSON.stringify(get().cart));
        }
      },

      removeFromCart: (productId, productType, seatCategory = null) => {
        const user = useAuthStore.getState().user;
        const storageKey = user ? `cart-${user._id}` : null;

        set({
          cart: get().cart.filter(
            (item) =>
              !(
                item._id === productId &&
                item.productType === productType &&
                (productType === 'ticket' ? item.seatCategory === seatCategory : true)
              )
          ),
        });

        if (user) {
          localStorage.setItem(storageKey, JSON.stringify(get().cart));
        }
      },

      updateQuantity: async (productId, productType, seatCategory, quantity) => {
        if (quantity < 1) return;
        const cart = get().cart;
        const user = useAuthStore.getState().user;
        const storageKey = user ? `cart-${user._id}` : null;

        const item = cart.find(
          (i) => i._id === productId &&
            i.productType === productType &&
            (productType === 'ticket' ? i.seatCategory === seatCategory : true)
        );
        if (!item) return;

        if (productType === 'ticket') {
          const ticketsForMatch = cart
            .filter((i) => i.productType === 'ticket' && i.matchId === item.matchId)
            .reduce((sum, i) => sum + i.quantity, 0) - item.quantity + quantity;
          if (ticketsForMatch > 5) {
            throw new Error(`Only ${5 - ticketsForMatch} more tickets allowed for this match (max 5)`);
          }
        } else if (productType === 'product' && quantity > 10) {
          throw new Error('Maximum 10 items per product');
        }

        set({
          cart: cart.map((item) =>
            item._id === productId &&
            item.productType === productType &&
            (productType === 'ticket' ? item.seatCategory === seatCategory : true)
              ? { ...item, quantity }
              : item
          ),
        });

        if (user) {
          localStorage.setItem(storageKey, JSON.stringify(get().cart));
        }
      },

      loadUserCart: () => {
        const user = useAuthStore.getState().user;
        if (!user) {
          set({ cart: [] });
          return;
        }
        const storageKey = `cart-${user._id}`;
        const savedCart = JSON.parse(localStorage.getItem(storageKey)) || [];
        set({ cart: savedCart });
      },

      clearCartInMemory: () => {
        set({ cart: [] });
      },

      clearCart: () => {
        const user = useAuthStore.getState().user;
        const storageKey = user ? `cart-${user._id}` : null;
        set({ cart: [] });
        if (user) {
          localStorage.removeItem(storageKey);
        }
      },

      checkout: () => {
        const user = useAuthStore.getState().user;
        if (!user) {
          throw new Error('You must be logged in to proceed with checkout.');
        }
      },

      setShippingMethod: (method) => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        const userId = user._id;
        set({ shippingMethod: method });
        localStorage.setItem(`shipping-${userId}`, method);
      },

      setPaymentMethod: (method) => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        const userId = user._id;
        set({ paymentMethod: method });
        localStorage.setItem(`payment-${userId}`, method);
      },

      loadUserPreferences: () => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        const userId = user._id;
        set({
          shippingMethod: localStorage.getItem(`shipping-${userId}`) || null,
          paymentMethod: localStorage.getItem(`payment-${userId}`) || null,
        });
      },

      getCartTotal: () => {
        return get().cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getCartCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
      getStorage: () => localStorage,
    }
  )
);