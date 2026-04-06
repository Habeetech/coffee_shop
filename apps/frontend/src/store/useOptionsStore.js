import { create } from "zustand";
import { persist } from "zustand/middleware";


const useOptionsStore = create(persist
    ((set, get) => ({
        isLoading: false,
        error: "",
        hasHydrated: false,
        lastFetched: null,
        options: {},
        isOptionsOpen: false,
        selectedItem: null,

        openModal: (item) => set({ isOptionsOpen: true, selectedItem: item }),
        closeModal: () => set({ isOptionsOpen: false, selectedItem: null }),
        setHasHydrated: (state) => (set({ hasHydrated: state })),

        fetchOptions: async () => {
            const hours = 24 * 60 * 60 * 1000;
            if (get().lastFetched && Date.now() - get().lastFetched < hours) return;
            const API_URL = import.meta.env.VITE_API_URL;
            const endpoint = `${API_URL}/api/options`

            try {
                set({ isLoading: true });
                const result = await fetch(endpoint);
                const data = await result.json()
                set({ options: data })
                set({ lastFetched: Date.now() })
            } catch (e) {
                set({ error: e.message });
            }

        }
    }), {
        name: "options", onRehydrateStorage: () => (state) => {
            if (state) state.setHasHydrated(true);
        }
    }
    ));
export default useOptionsStore;