import { useEffect, useState } from "react";

export default function useMenuData(endpoint) {
    const [result, setResult] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState(null);

    useEffect(() => {
        const controller = new AbortController();
        setIsLoading(true);
        
        const fetchData = async () => {
            try {
                const response = await fetch(endpoint, { signal: controller.signal });
                if (response.status === 304)
                {
                    setIsLoading(false);
                    return;
                }

                if (!response.ok) {
                    throw new Error("An error occured: Could not get the data from the server")
                }
                
                const data = await response.json()
                    setResult(data);
                    setIsLoading(false);
                    return;
            }
            catch (e) {
                if (e.name === "AbortError") {
                    return controller.abort();
                }
                setErrors(e);
                setIsLoading(false);
            }
        }
            fetchData();
    
        

        return () => controller.abort();
    }, [endpoint])
    return { result, isLoading, errors }
}