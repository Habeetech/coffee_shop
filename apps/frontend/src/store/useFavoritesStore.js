import { create } from "zustand";
import { persist } from "zustand/middleware"
import api from "../api/api.js";
import useUserStore from "./useUserStore.js";



const useFavoritesStore = create(
    persist(
        (set, get) => ({
            favorites: [],
            isLoading: false,
            error: "",
            hasHydrated: false,
            setHasHydarated: (state) => set({ hasHydrated: state }),
            setFavorites: (fav) => set({ favorites: fav }),
            toggleFavorite: async (itemId) => {
                const { favorites, setFavorites } = get();

                let newFavorites;
                if (favorites?.some(item => item._id === itemId)) {
                    newFavorites = favorites.filter(id => id !== itemId);
                } else {
                    newFavorites = [...favorites, { _id: itemId }];
                }
                setFavorites(newFavorites);

                try {
                    const res = await api.patch(`api/user/favorites/${itemId}`);
                    if (res.data) {
                        setFavorites(res.data);
                    }
                } catch (err) {
                    console.log("Favorite sync failed, rolling back", err);
                    setFavorites(favorites);
                }
            },
            syncFavorites: async () => {
                try {
                    const res = await api.get("/api/user/favorites");
                    if (res.data) {
                        set({ favorites: res.data });
                    }
                } catch (err) {
                    console.log("Failed to sync favorites", err);
                }
            },



        }), {
        name: "favorites",
        onRehydrateStorage: () => (state) => {
            if (state)
                state.setHasHydarated(true);
        },
        partialize: (state) => ({
            favorites: state.favorites
        })
    }
    ))

export default useFavoritesStore;