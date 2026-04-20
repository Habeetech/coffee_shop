import { create } from "zustand";
import { persist } from "zustand/middleware"
import api from "../api/api.js";

const useOrdersStore = create(
    persist(
        (set, get) => ({
            activeOrders: [],
            orders: [],
            recentOrders: [],
            frequentOrders: [],
            isLoading: false,
            error: "",
            hasHydrated: false,
            setHasHydarated: (state) => set({ hasHydrated: state }),

            fetchOrders: async () => {
                try {
                    set({ isLoading: true, error: "" })
                    const res = await api.get("/api/orders/mine")
                    set({
                        orders: res.data.orders.all,
                        activeOrders: res.data.orders.active,
                        recentOrders: res.data.orders.recent,
                        frequentOrders: res.data.orders.frequent
                    })
                } catch (e) {
                    const msg = e?.response?.data?.message || "Unable to retrieve orders"
                    set({ error: msg })
                } finally {
                    set({ isLoading: false })
                }
            }
        }), {
        name: "userOrders",
        onRehydrateStorage: () => (state) => {
            if (state)
                state.setHasHydarated(true);
        },
        partialize: (state) => ({
            orders: state.orders
        })
    }
    ))

export default useOrdersStore;