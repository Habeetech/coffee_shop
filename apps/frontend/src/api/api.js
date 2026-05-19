import axios from "axios";
import useUserStore from "../store/useUserStore.js"

let isRefreshing = false;
let failedQueue = [];


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
})
const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.onFailure(error);
        } else {
            prom.onSuccess(token);
        }
    });
    failedQueue = [];
};
api.interceptors.request.use(
    (config) => {
        const token = useUserStore.getState().token;
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        onSuccess: (token) => {
                            originalRequest.headers["Authorization"] = "Bearer " + token;
                            resolve(api(originalRequest));
                        },
                        onFailure: (err) => {
                            reject(err)
                        }
                    })
                })
            } else {
                try {
                    isRefreshing = true;
                    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/refresh`,
                        {},
                        { withCredentials: true });
                    const newToken = response.data.token;
                    if (newToken) {
                        useUserStore.setState({ token: newToken });
                        originalRequest.headers["Authorization"] = "Bearer " + newToken;
                        processQueue(null, newToken);
                        return api(originalRequest);
                    }
                } catch (err) {
                    processQueue(err);
                    const { logout, navigateToLogin } = useUserStore.getState();
                    logout();
                    if (navigateToLogin) {
                        navigateToLogin();
                    }
                   
                } finally {
                    isRefreshing = false;
                }
                
            }
        }
        return Promise.reject(error)
    })

    export default api;