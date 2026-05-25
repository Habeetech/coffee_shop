import api from "../api/api.js";
import useUserStore from "../store/useUserStore";


export const performLogout = async (navigate, redirectPath = "/login") => {
    const token = useUserStore.getState().token;
    try {
        const baseUrl = import.meta.env.VITE_API_URL;
        const endpoint = `${baseUrl}/api/auth/logout`;

        await fetch(endpoint, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
    } catch (err) {

        console.error("Server logout failed", err);
    } finally {

        console.log("redirecting to...", redirectPath)
        if (navigate) {
            navigate(redirectPath, { replace: true });
            setTimeout(() => {
                useUserStore.getState().logout();
            }, 100);
        } else {
            useUserStore.getState().logout();
            window.location.replace(redirectPath);
        }
    }
};