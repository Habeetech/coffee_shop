import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../api/api.js"; 

const useOptionsStore = create(
  persist(
    (set, get) => ({
      isLoading: false,
      error: "",
      hasHydrated: false,
      lastFetched: null,
      options: {},
      isOptionsOpen: false,
      selectedItem: null,

      openModal: (item) => set({ isOptionsOpen: true, selectedItem: item }),
      closeModal: () => set({ isOptionsOpen: false, selectedItem: null }),
      setHasHydrated: (state) => set({ hasHydrated: state }),

      fetchOptions: async () => {
        const cacheDuration = 24 * 60 * 60 * 1000;
        const lastFetched = get().lastFetched;
        

        if (lastFetched && Date.now() - lastFetched < cacheDuration) return;

        set({ isLoading: true, error: "" });

        try {

          const res = await api.get("/api/options");
          
          set({ 
            options: res.data, 
            lastFetched: Date.now(),
            isLoading: false 
          });
        } catch (e) {
          const msg = e.response?.data?.message || "Failed to load options";
          set({ error: msg, isLoading: false });
        }
      },
    }),
    {
      name: "options",
      onRehydrateStorage: () => (state) => {
        if (state) state.setHasHydrated(true);
      },
    }
  )
);

export default useOptionsStore;