import { create } from "zustand";
import { persist } from "zustand/middleware"

const useUserStore = create(persist((set, get) => ({
    user: null,
    token: null,
    hasHydareted: false,
    setToken: (userToken) => (set({ token: userToken })),
    setUser: (userData) => (set({ user: userData })),
    setHasHydrated: (state) => (set({ hasHydrated: state })),
    logout: () => set({ user: null, token: null }),
    updateUser: (partialData) => {
        const currentUser = get().user || {}
        const newUser = { ...currentUser, ...partialData }
        set({ user: newUser })
    }

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