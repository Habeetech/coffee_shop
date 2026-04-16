import api from "../api/api.js";
import useUserStore from "../store/useUserStore";

export const performLogout = async (navigate, redirectPath = "/login") => {
    try {
        await api.post("/api/auth/logout");
    } catch (err) {
        console.error("Server logout failed", err);
    } finally {
        useUserStore.getState().logout();
        if (navigate) navigate(redirectPath, { replace: true });
    }
};