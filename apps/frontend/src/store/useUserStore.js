import { create } from "zustand";
import { persist } from "zustand/middleware"

const useUserStore = create(persist((set, get) => ({
    user: null,
    setUser: (userData) => (set({ user: userData })),
    logout: () => set({ user: null }),
    updateUser: (partialData) => {
        const currentUser = get().user || {}
        const newUser = { ...currentUser, ...partialData }
        set({ user: newUser })
    }

})))
export default useUserStore;