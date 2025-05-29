import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./authStore";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      isSyncing: false,

      // Initialize cart - sync with backend if authenticated
      initCart: async () => {
        const { isAuthenticated } = useAuthStore.getState();

        if (isAuthenticated) {
          await get().syncCart();
        }
      },

      // Sync cart with backend
      syncCart: async () => {
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) return;

        set({ isSyncing: true });
        try {
          const response = await axios.get("/cart");
          const backendItems = response.data.cart.items.map((item) => ({
            productId: item.product._id,
            productName: item.product.name,
            productImage: item.product.images[0],
            variantId: item.variant.variantId,
            color: item.variant.color,
            size: item.variant.size,
            price: item.variant.price,
            quantity: item.quantity,
            _id: item._id,
          }));

          set({ items: backendItems, isSyncing: false });
        } catch (error) {
          console.error("Cart sync error:", error);
          set({ isSyncing: false });
        }
      },

      // Add item to cart
      addItem: async (product, variant, quantity = 1) => {
        const { isAuthenticated } = useAuthStore.getState();

        // Check if item already exists
        const existingItem = get().items.find(
          (item) =>
            item.productId === product._id && item.variantId === variant._id
        );

        if (existingItem) {
          return get().updateQuantity(
            existingItem._id,
            existingItem.quantity + quantity
          );
        }

        // Add to local state immediately for better UX
        const newItem = {
          productId: product._id,
          productName: product.name,
          productImage: product.images[0],
          variantId: variant._id,
          color: variant.color,
          size: variant.size,
          price: variant.price,
          quantity,
          _id: Date.now().toString(), // Temporary ID
        };

        set((state) => ({
          items: [...state.items, newItem],
        }));

        // Sync with backend if authenticated
        if (isAuthenticated) {
          try {
            const response = await axios.post("/cart/add", {
              productId: product._id,
              variantId: variant._id,
              quantity,
            });

            // Update with real cart data
            await get().syncCart();
            toast.success("Added to cart");
          } catch (error) {
            // Remove from local state if backend fails
            set((state) => ({
              items: state.items.filter((item) => item._id !== newItem._id),
            }));
            toast.error(
              error.response?.data?.message || "Failed to add to cart"
            );
          }
        } else {
          toast.success("Added to cart");
        }
      },

      // Update item quantity
      updateQuantity: async (itemId, quantity) => {
        if (quantity <= 0) {
          return get().removeItem(itemId);
        }

        const { isAuthenticated } = useAuthStore.getState();

        // Update local state immediately
        set((state) => ({
          items: state.items.map((item) =>
            item._id === itemId ? { ...item, quantity } : item
          ),
        }));

        // Sync with backend if authenticated
        if (isAuthenticated) {
          try {
            await axios.put(`/cart/items/${itemId}`, { quantity });
          } catch (error) {
            // Revert on error
            await get().syncCart();
            toast.error(
              error.response?.data?.message || "Failed to update quantity"
            );
          }
        }
      },

      // Remove item from cart
      removeItem: async (itemId) => {
        const { isAuthenticated } = useAuthStore.getState();
        const item = get().items.find((i) => i._id === itemId);

        // Remove from local state immediately
        set((state) => ({
          items: state.items.filter((item) => item._id !== itemId),
        }));

        // Sync with backend if authenticated
        if (isAuthenticated) {
          try {
            await axios.delete(`/cart/items/${itemId}`);
            toast.success("Removed from cart");
          } catch (error) {
            // Re-add on error
            if (item) {
              set((state) => ({
                items: [...state.items, item],
              }));
            }
            toast.error("Failed to remove item");
          }
        } else {
          toast.success("Removed from cart");
        }
      },

      // Clear cart
      clearCart: async () => {
        const { isAuthenticated } = useAuthStore.getState();

        set({ items: [] });

        if (isAuthenticated) {
          try {
            await axios.delete("/cart/clear");
          } catch (error) {
            // Sync with backend on error
            await get().syncCart();
          }
        }
      },

      // Get cart totals
      getCartTotals: () => {
        const items = get().items;
        const subtotal = items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        const tax = subtotal * 0.08; // 8% tax
        const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
        const total = subtotal + tax + shipping;

        return {
          itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
          subtotal,
          tax,
          shipping,
          total,
        };
      },

      // Validate cart before checkout
      validateCart: async () => {
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) return { valid: false, issues: [] };

        try {
          const response = await axios.post("/cart/validate");
          if (!response.data.valid) {
            await get().syncCart(); // Sync to get updated cart
          }
          return response.data;
        } catch (error) {
          return { valid: false, issues: [] };
        }
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);
