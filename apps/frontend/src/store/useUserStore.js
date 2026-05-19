import { create } from "zustand";
import { persist } from "zustand/middleware"
import useFavoritesStore from "./useFavoritesStore";

const useUserStore = create(persist((set, get) => ({
    user: null,
    token: null,
    hasHydareted: false,
    setToken: (userToken) => (set({ token: userToken })),
    setUser: (userData) => (set({ user: userData })),
    setHasHydrated: (state) => (set({ hasHydrated: state })),
    logout: () => {
        set({ user: null, token: null })
        useFavoritesStore.getState().setFavorites([]);
    },
    updateUser: (partialData) => {
        const currentUser = get().user || {}
        const newUser = { ...currentUser, ...partialData }
        set({ user: newUser })
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