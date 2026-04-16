import useUserStore from "../store/useUserStore.js"
import { useState, useCallback } from "react";

export default function useApi({ endpoint, method = "GET" }) {
    const { token, setToken, logout } = useUserStore();
    const API_URL = import.meta.env.VITE_API_URL;
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState(null);

    const request = useCallback(async (data) => {
        const options = {
            method: method,
            headers: { "Authorization": `Bearer ${token}`, ...(method !== "GET" && { "Content-Type": "application/json" }) },
            ...(method !== "GET" && {body: JSON.stringify(data)})
        };

        try {
            setIsLoading(true);
            setErrors("")
            const response = await fetch(`${API_URL}/api/${endpoint}`, options);
            if (response.ok) {
                return await response.json()

            } else if (response.status === 401) {
               /*  const success = await attemptRefresh();
                if (success) {
                    return await request(data);
                } else { */
                    logout();
                    return;
               // }
                return;
                // try and get a refresh token
            }
            throw new Error("Request Failed");
        } catch (e) {
            console.error(e.message);
            setErrors(e.message);
        } finally {
            setIsLoading(false);
        }
    }, [endpoint, method, token])

    return { request, isLoading, errors }
}