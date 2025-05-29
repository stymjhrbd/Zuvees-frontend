import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Configure axios defaults
axios.defaults.baseURL = API_URL;

// Add token to requests if it exists
axios.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      toast.error("Session expired. Please login again.");
    }
    return Promise.reject(error);
  }
);

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (idToken) => {
        set({ isLoading: true });
        try {
          console.log(
            "Attempting login with token:",
            idToken?.substring(0, 50) + "..."
          );

          const response = await axios.post("/auth/google", { idToken });
          const { token, user } = response.data;

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });

          toast.success(`Welcome back, ${user.name}!`);
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          const message = error.response?.data?.message || "Login failed";
          toast.error(message);
          return { success: false, error: message };
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        toast.success("Logged out successfully");
      },

      updateProfile: async (data) => {
        try {
          const response = await axios.put("/auth/profile", data);
          set((state) => ({
            user: { ...state.user, ...response.data.user },
          }));
          toast.success("Profile updated successfully");
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.message || "Update failed";
          toast.error(message);
          return { success: false, error: message };
        }
      },

      checkAuth: async () => {
        const token = useAuthStore.getState().token;
        if (!token) return;

        try {
          const response = await axios.get("/auth/me");
          set({ user: response.data });
        } catch (error) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
