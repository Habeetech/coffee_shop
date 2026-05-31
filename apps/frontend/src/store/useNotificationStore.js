import { create } from "zustand";
import {persist} from "zustand/middleware";
import api from "../api/api";


const useNotificationStore = create(
    persist(
        (set, get) => ({
            messages: [],
            unread: [],
            isLoading: false,
            setHasHydrated: (state) => set({hasHydrated: state}),
            hasHydrated: false,
            fetchNotifications: async () => {

                try {
                    set({ isLoading: true });
                    const res = await api.get("/api/notifications");
                    set({ messages: res.data });
                    set({ unread: res.data.filter(m => m.isRead === false) })

                } catch (e) {
                    console.error(e?.response?.data?.message);
                } finally {
                    set({ isLoading: false })
                }
            },
            addNotification: (newMsg) => {
                set((state) => ({
                    messages: [newMsg, ...state.messages],
                    unread: [newMsg, ...state.unread]
                }))
            },
            markAsRead: async (msgId) => {
                try {
                    const res = await api.patch(`/api/notifications/${msgId}`, {});
                    if (res.status === 200) {
                        const newUnread = get().unread.filter(msg => msg._id !== msgId);
                        const newMessages = get().messages.map((msg) => {
                            if (msg._id === msgId) {
                                return { ...msg, isRead: true }
                            }
                            return msg
                        })
                        set({ messages: newMessages })
                        set({ unread: newUnread });
                    }
                } catch (e) {
                    console.error(e?.response?.data?.message);
                }

            },
            deleteNotification: async (msgId) => {
                try {
                    const res = await api.delete(`/api/notifications/${msgId}`)
                    if(res.status === 204) {
                        const newUnread = get().unread.filter(msg => msg._id !== msgId);
                        const newMessages = get().messages.filter(msg => msg._id !== msgId);
                        set({unread: newUnread})
                        set({messages: newMessages})
                    }
                } catch (e) {
                    console.error(e?.response?.data?.message);
                }
            }
        }), {
        name: "notification-storage",
        onRehydrateStorage: () => (state) => {
            if (state) {
                state.setHasHydrated(true);
            }
        },
        partialize: (state) => ({
            messages: state.messages
        })
    }))

    export default useNotificationStore;