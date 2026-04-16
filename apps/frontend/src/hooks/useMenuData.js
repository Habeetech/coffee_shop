import { useEffect, useState, useCallback } from "react";
import api from "../api/api.js";

export default function useMenuData(endpoint) {
    const [result, setResult] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState(null);

    const fetchData = useCallback(async (signal = null) => {
        setIsLoading(true);

        try {
            const response = await api.get(endpoint, { signal });
            setResult(response.data);
            setErrors(null);
        } catch (e) {
            if (e.name === "CanceledError" || e.name === "AbortError") return;
            const msg = e.response?.data?.message || "Could not get data";
            setErrors(msg);
        } finally {
            setIsLoading(false);
        }
    }, [endpoint]);


    useEffect(() => {
        const controller = new AbortController();
        fetchData(controller.signal);

        return () => controller.abort();
    }, [fetchData]);

    const reload = () => {
        fetchData();
    };

    return { result, isLoading, errors, reload };
}