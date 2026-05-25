import { create } from "zustand";
import { persist } from "zustand/middleware"
import useFavoritesStore from "./useFavoritesStore";
import api from "../api/api";

const useUserStore = create(persist((set, get) => ({
    user: null,
    token: null,
    hasHydrated: false,
    setToken: (userToken) => (set({ token: userToken })),
    setUser: (userData) => (set({ user: userData })),
    setHasHydrated: (state) => (set({ hasHydrated: state })),
    logout: () => {
        set({ user: null, token: null })
        useFavoritesStore.getState().setFavorites([]);
    },
    updateUser: (partialData) => {
        const currentUser = get().user || {}
        if (partialData.address) {
            const address = { ...currentUser.address, ...partialData.address }
            const newUser = { ...currentUser, address };
            set({ user: newUser })
            return;
        }
        const newUser = { ...currentUser, ...partialData }
        set({ user: newUser })
    },

    refreshUser: async () => {
        const token = get().token;
        if (!token) return;

        try {
            const res = await api.get("/api/user/mine");
            if (res.data) {
                set({ user: res.data });
            }
        } catch (err) {
            console.error("Failed to sync user data from server:", err);
            throw err;
        }
    },
    navigateToLogin: null,
    setNavigateToLogin: (fn) => set({ navigateToLogin: fn })

}),
    {
        name: "user-storage",
        onRehydrateStorage: () => (state) => {
            if (state) state.setHasHydrated(true);
        }
    }
)
)
export default useUserStore; 