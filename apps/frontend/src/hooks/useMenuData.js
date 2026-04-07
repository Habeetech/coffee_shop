import { useEffect, useState, useCallback } from "react";

export default function useMenuData(endpoint) {
    const [result, setResult] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState(null);

      const fetchData = useCallback(async (signal) => {
        setIsLoading(true);
        setErrors(null);
        
        try {
            const response = await fetch(endpoint, { signal });
            
            if (response.status === 304) {
                setIsLoading(false);
                return;
            }
            
            if (!response.ok) {
                throw new Error("Could not get the data from the server");
            }
            
            const data = await response.json();
            setResult(data);
        } catch (e) {
            if (e.name === "AbortError") return;
            setErrors(e);
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